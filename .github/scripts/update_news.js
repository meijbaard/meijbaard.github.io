const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const url = process.env.RSS_FEED_URL;
const dataFile = '_data/news.json';

function flattenData(data) {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc, val) => 
        Array.isArray(val) ? acc.concat(flattenData(val)) : acc.concat(val), []
    );
}

function getDomain(urlStr) {
    if (!urlStr) return null;
    try {
        return new URL(urlStr).hostname.replace('www.', '');
    } catch (e) {
        return null;
    }
}

function getDedupKey(title) {
    if (!title) return "onbekend";
    return title.replace(/ - [^-]+$/, '').toLowerCase().trim();
}

// NIEUW: Functie om de irritante Google News tracking URL's om te zetten naar de echte directe kranten-URL
async function resolveGoogleNewsUrl(googleUrl) {
    if (!googleUrl.includes('news.google.com')) return googleUrl;
    try {
        const response = await fetch(googleUrl);
        const html = await response.text();
        
        // Google verstopt de echte link in specifieke tags op hun redirect pagina
        const match = html.match(/<a[^>]+rel=["']nofollow["'][^>]+href=["']([^"']+)["']/i) || 
                      html.match(/data-n-a-url=["']([^"']+)["']/i) ||
                      html.match(/window\.location\.replace\(['"]([^"']+)['"]\)/i);
        
        if (match && match[1]) {
            let realUrl = match[1].replace(/&amp;/g, '&');
            // Ontsleutel eventuele leestekens in de link
            realUrl = realUrl.replace(/\\x2F/g, '/').replace(/\\u0026/g, '&');
            if (realUrl.startsWith('http')) return realUrl;
        }
        return googleUrl;
    } catch (e) {
        return googleUrl;
    }
}

// Scraper die zich voordoet als Googlebot
async function scrapeArticleMetadata(articleUrl) {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://news.google.com/'
        };

        const response = await fetch(articleUrl, { headers: headers, redirect: 'follow' });
        if (!response.ok) return null;

        const html = await response.text();
        
        let imageUrl = "";
        let realDescription = "";
        let author = "";

        const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) || 
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
        if (imgMatch) imageUrl = imgMatch[1];

        const descMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        if (descMatch) {
            realDescription = descMatch[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
        }

        const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]*property=["']article:author["'][^>]*content=["']([^"']+)["']/i);
        if (authorMatch) {
            author = authorMatch[1].trim();
        }

        // Voorkom dat generieke teksten van foute redirects worden opgeslagen
        if (realDescription.includes("Uitgebreide up-to-date berichtgeving")) realDescription = "";
        if (imageUrl.includes("googleusercontent.com")) imageUrl = "";

        return { imageUrl, realDescription, author };
    } catch (e) {
        return null;
    }
}

async function updateNews() {
    try {
        console.log("Nieuws ophalen van Google News...");
        
        const rssHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        };
        
        const response = await fetch(url, { headers: rssHeaders });
        if (!response.ok) throw new Error(`HTTP fout! Status: ${response.status}`);
        const xmlData = await response.text();
        
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
        const jsonObj = parser.parse(xmlData);
        let items = jsonObj.rss?.channel?.item || [];
        if (!Array.isArray(items)) items = [items];
        
        let existingArticles = [];
        if (fs.existsSync(dataFile)) {
            existingArticles = flattenData(JSON.parse(fs.readFileSync(dataFile, 'utf-8')));
        }

        const allUniqueArticles = new Map();

        // OUDE DATA
        existingArticles.forEach(article => {
            if (article.source_id && !article.source_id.includes('.')) {
                article.source_id = getDomain(article.link) || article.source_id;
            }
            if (article.pubDate && typeof article.pubDate === 'string' && !article.pubDate.includes('T')) {
                const parsedDate = new Date(article.pubDate.replace(" ", "T") + "Z");
                if (!isNaN(parsedDate)) article.pubDate = parsedDate.toISOString();
            }
            if (article.title) {
                allUniqueArticles.set(getDedupKey(article.title), article);
            }
        });

        // NIEUWE DATA
        let addedCount = 0;
        for (const item of items) {
            const title = item.title || "";
            const cleanTitle = title.replace(/ - [^-]+$/, '').trim();
            const key = getDedupKey(cleanTitle);

            if (!allUniqueArticles.has(key)) {
                console.log(`\nNieuw artikel: "${cleanTitle}"`);
                
                // 1. Haal de verborgen, echte URL uit de Google link
                const rawLink = item.link || "";
                const realLink = await resolveGoogleNewsUrl(rawLink);
                console.log(`Directe link gevonden: ${realLink}`);
                
                // 2. Bezoek die echte URL om de ware foto en omschrijving te halen
                const meta = await scrapeArticleMetadata(realLink) || { imageUrl: "", realDescription: "", author: "" };

                let sourceDomain = getDomain(realLink) || "Onbekende bron";

                // Nood-omschrijving als de krant écht alles blokkeert
                let fallbackDesc = (item.description || "").replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').trim();
                if (fallbackDesc.includes('  ')) fallbackDesc = fallbackDesc.split('  ')[0].trim();
                if (fallbackDesc.includes("Uitgebreide up-to-date")) fallbackDesc = "";

                const newArticle = {
                    title: cleanTitle,
                    link: realLink, // We slaan nu jouw schone link op in plaats van de Google link!
                    pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    source_id: sourceDomain,
                    description: meta.realDescription || fallbackDesc,
                    creator: meta.author ? [meta.author] : [],
                    image_url: meta.imageUrl 
                };

                allUniqueArticles.set(key, newArticle);
                addedCount++;
            }
        }

        const combined = Array.from(allUniqueArticles.values());
        combined.sort((a, b) => {
            const dateA = new Date(a.pubDate).getTime();
            const dateB = new Date(b.pubDate).getTime();
            if (isNaN(dateA) && isNaN(dateB)) return 0;
            if (isNaN(dateA)) return 1;  
            if (isNaN(dateB)) return -1; 
            return dateB - dateA;
        });

        fs.writeFileSync(dataFile, JSON.stringify(combined, null, 2));
        console.log(`\n🎉 SUCCES! Er zijn ${addedCount} nieuwe artikelen toegevoegd.`);

    } catch (error) {
        console.error("Fout tijdens het updaten van nieuws:", error);
        process.exit(1);
    }
}

updateNews();

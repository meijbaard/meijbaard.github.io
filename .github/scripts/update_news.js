const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const url = process.env.RSS_FEED_URL;
const dataFile = '_data/news.json';

// Functie om de oude, geneste JSON-structuur plat te slaan
function flattenData(data) {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc, val) => 
        Array.isArray(val) ? acc.concat(flattenData(val)) : acc.concat(val), []
    );
}

// Haalt de schone domeinnaam uit een link
function getDomain(urlStr) {
    if (!urlStr) return null;
    try {
        return new URL(urlStr).hostname.replace('www.', '');
    } catch (e) {
        return null;
    }
}

// Slimme ontdubbelingssleutel: knipt " - Krantnaam" weg
function getDedupKey(title) {
    if (!title) return "onbekend";
    return title.replace(/ - [^-]+$/, '').toLowerCase().trim();
}

// GEAVANCEERDE SCRAPER: Doet zich voor als Googlebot om cookiemuren te omzeilen
async function scrapeArticleMetadata(url) {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7',
            'Referer': 'https://news.google.com/'
        };

        const response = await fetch(url, { headers: headers, redirect: 'follow' });
        if (!response.ok) return null;

        const html = await response.text();
        
        let imageUrl = "";
        let realDescription = "";
        let author = "";

        // 1. Zoek de originele foto (og:image)
        const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) || 
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
        if (imgMatch) imageUrl = imgMatch[1];

        // 2. Zoek de echte omschrijving (og:description of gewone description)
        const descMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
        if (descMatch) {
            // Opruimen van speciale HTML-tekens in de omschrijving
            realDescription = descMatch[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
        }

        // 3. Zoek de auteur
        const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]*property=["']article:author["'][^>]*content=["']([^"']+)["']/i);
        if (authorMatch) {
            author = authorMatch[1].trim();
        }

        return { imageUrl, realDescription, author };
    } catch (e) {
        console.log("-> Scrapen mislukt voor:", url);
        return null;
    }
}

async function updateNews() {
    try {
        console.log("Nieuws ophalen van Google News...");
        const response = await fetch(url);
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
                console.log(`Nieuw artikel: "${cleanTitle}". Echte data scrapen...`);
                const link = item.link || "";
                
                // Activeer de Googlebot scraper
                const meta = await scrapeArticleMetadata(link) || { imageUrl: "", realDescription: "", author: "" };

                let sourceDomain = "Onbekende bron";
                if (item.source && item.source['@_url']) {
                    sourceDomain = getDomain(item.source['@_url']) || "Onbekende bron";
                }

                // Noodoplossing als de scraper faalt: maak de lelijke Google News omschrijving toch nog mooi
                let fallbackDesc = (item.description || "").replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').trim();
                // Verwijder de "  Krantnaam" aan het einde van de tekst
                if (fallbackDesc.includes('  ')) {
                    fallbackDesc = fallbackDesc.split('  ')[0].trim();
                }

                const newArticle = {
                    title: cleanTitle,
                    link: link,
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

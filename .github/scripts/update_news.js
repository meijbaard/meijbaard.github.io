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

// Slimme ontdubbelingssleutel: knipt " - Krantnaam" weg voor een eerlijke vergelijking
function getDedupKey(title) {
    if (!title) return "onbekend";
    return title.replace(/ - [^-]+$/, '').toLowerCase().trim();
}

// NIEUW: Razendsnelle scraper om foto's van de krantenwebsite te halen
async function getOgImage(articleUrl) {
    try {
        const response = await fetch(articleUrl);
        if (!response.ok) return "";
        const html = await response.text();
        
        // Zoek naar de <meta property="og:image"> tag in de broncode van het artikel
        const match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) || 
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
        return match ? match[1] : "";
    } catch (e) {
        return ""; // Faalt het? Geen probleem, dan slaan we hem op zonder foto.
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
        
        console.log(`=> Er zijn ${items.length} actuele artikelen gevonden in de Google feed.`);

        // 1. Eerst oude data inlezen zodat we weten welke artikelen we al hebben
        let existingArticles = [];
        if (fs.existsSync(dataFile)) {
            existingArticles = flattenData(JSON.parse(fs.readFileSync(dataFile, 'utf-8')));
        }
        console.log(`=> Bestaand archief bevat ${existingArticles.length} artikelen.`);

        const allUniqueArticles = new Map();

        // 2. OUDE DATA EERST (Hierdoor beschermen we je bestaande url's en foto's)
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

        // 3. NIEUWE DATA ERBIJ (inclusief het zoeken naar een foto)
        let addedCount = 0;
        for (const item of items) {
            const title = item.title || "";
            const cleanTitle = title.replace(/ - [^-]+$/, '').trim();
            const key = getDedupKey(cleanTitle);

            // Controleer of we dit artikel al hebben. Zo nee: haal hem binnen!
            if (!allUniqueArticles.has(key)) {
                console.log(`Nieuw artikel ontdekt: "${cleanTitle}". Foto zoeken op originele site...`);
                const link = item.link || "";
                
                // Haal de foto op van de nieuwswebsite
                const imageUrl = await getOgImage(link);

                let sourceDomain = "Onbekende bron";
                if (item.source && item.source['@_url']) {
                    sourceDomain = getDomain(item.source['@_url']) || "Onbekende bron";
                }

                const newArticle = {
                    title: cleanTitle,
                    link: link,
                    pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    source_id: sourceDomain,
                    description: (item.description || "").replace(/<[^>]*>?/gm, '').trim(),
                    creator: [],
                    image_url: imageUrl 
                };

                allUniqueArticles.set(key, newArticle);
                addedCount++;
            }
        }

        // 4. Sorteren op datum (Nieuwste bovenaan) met valbeveiliging
        const combined = Array.from(allUniqueArticles.values());
        combined.sort((a, b) => {
            const dateA = new Date(a.pubDate).getTime();
            const dateB = new Date(b.pubDate).getTime();
            if (isNaN(dateA) && isNaN(dateB)) return 0;
            if (isNaN(dateA)) return 1;  
            if (isNaN(dateB)) return -1; 
            return dateB - dateA;
        });

        // 5. Opslaan
        fs.writeFileSync(dataFile, JSON.stringify(combined, null, 2));
        console.log(`\n🎉 SUCCES! Er zijn ${addedCount} nieuwe artikelen (met foto) toegevoegd.`);
        console.log(`Het complete archief bevat nu ${combined.length} artikelen.`);

    } catch (error) {
        console.error("Fout tijdens het updaten van nieuws:", error);
        process.exit(1);
    }
}

updateNews();

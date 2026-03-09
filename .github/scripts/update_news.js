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

async function updateNews() {
    try {
        console.log("Nieuws ophalen van Google News via URL:", url.substring(0, 50) + "...");
        
        // 1. Fetch gebruiken (deze volgt automatisch redirects van Google News)
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP fout! Status: ${response.status}`);
        }
        
        const xmlData = await response.text();
        
        // 2. XML Parsen
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
        const jsonObj = parser.parse(xmlData);
        let items = jsonObj.rss?.channel?.item || [];
        if (!Array.isArray(items)) items = [items];
        
        console.log(`=> Er zijn ${items.length} actuele artikelen gevonden in de Google feed.`);

        // 3. Nieuwe artikelen formatteren
        const newArticles = items.map(item => {
            const title = item.title || "";
            const description = item.description || "";
            
            let sourceDomain = "Onbekende bron";
            if (item.source && item.source['@_url']) {
                sourceDomain = getDomain(item.source['@_url']) || "Onbekende bron";
            }

            const cleanTitle = title.replace(/ - [^-]+$/, '').trim();

            return {
                title: cleanTitle,
                link: item.link || "",
                pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                source_id: sourceDomain,
                description: description.replace(/<[^>]*>?/gm, '').trim(),
                creator: [],
                image_url: "" 
            };
        });

        // 4. Bestaande historische data inlezen
        let existingArticles = [];
        if (fs.existsSync(dataFile)) {
            existingArticles = flattenData(JSON.parse(fs.readFileSync(dataFile, 'utf-8')));
        }
        console.log(`=> Bestaand archief bevat ${existingArticles.length} artikelen.`);

        const allUniqueArticles = new Map();

        // OUDE DATA EERST (beschermt je originele, directe URL's)
        existingArticles.forEach(article => {
            if (article.source_id && !article.source_id.includes('.')) {
                article.source_id = getDomain(article.link) || article.source_id;
            }
            
            // Datum normaliseren (veiligheidsnet)
            if (article.pubDate && typeof article.pubDate === 'string' && !article.pubDate.includes('T')) {
                const parsedDate = new Date(article.pubDate.replace(" ", "T") + "Z");
                if (!isNaN(parsedDate)) article.pubDate = parsedDate.toISOString();
            }
            
            if (article.title) {
                allUniqueArticles.set(getDedupKey(article.title), article);
            }
        });

        // NIEUWE DATA ERBIJ
        let addedCount = 0;
        newArticles.forEach(article => {
            if (article.title) {
                const key = getDedupKey(article.title);
                if (!allUniqueArticles.has(key)) {
                    allUniqueArticles.set(key, article);
                    addedCount++;
                }
            }
        });

        // 5. Sorteren op datum (Nieuwste eerst) met extra bescherming tegen ongeldige data
        const combined = Array.from(allUniqueArticles.values());
        combined.sort((a, b) => {
            const dateA = new Date(a.pubDate).getTime();
            const dateB = new Date(b.pubDate).getTime();
            
            if (isNaN(dateA) && isNaN(dateB)) return 0;
            if (isNaN(dateA)) return 1;  
            if (isNaN(dateB)) return -1; 
            
            return dateB - dateA;
        });

        // 6. Opslaan
        fs.writeFileSync(dataFile, JSON.stringify(combined, null, 2));
        console.log(`\n🎉 SUCCES! Er zijn ${addedCount} nieuwe artikelen toegevoegd.`);
        console.log(`Het complete, strak gesorteerde archief bevat nu ${combined.length} artikelen.`);

    } catch (error) {
        console.error("Fout tijdens het updaten van nieuws:", error);
        process.exit(1);
    }
}

updateNews();

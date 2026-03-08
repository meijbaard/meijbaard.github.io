const fs = require('fs');
const https = require('https');
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

// Functie om de schone domeinnaam uit een link te halen
function getDomain(urlStr) {
    if (!urlStr) return null;
    try {
        return new URL(urlStr).hostname.replace('www.', '');
    } catch (e) {
        return null;
    }
}

https.get(url, (res) => {
    let xmlData = '';
    res.on('data', (chunk) => { xmlData += chunk; });
    res.on('end', () => {
        try {
            // 1. Google Nieuws inladen (inclusief attributen voor de bron URL)
            const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
            const jsonObj = parser.parse(xmlData);
            let items = jsonObj.rss?.channel?.item || [];
            if (!Array.isArray(items)) items = [items];

            const regex = /Eijbaard/i;

            // 2. Nieuwe artikelen parseren
            const newArticles = items.map(item => {
                const title = item.title || "";
                const description = item.description || "";
                
                // Bij Google Nieuws staat de echte bron vaak als attribuut
                let sourceDomain = "Onbekende bron";
                if (item.source && item.source['@_url']) {
                    sourceDomain = getDomain(item.source['@_url']) || "Onbekende bron";
                }

                return {
                    title: title,
                    link: item.link || "",
                    pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    source_id: sourceDomain,
                    description: description.replace(/<[^>]*>?/gm, '').trim(),
                    creator: [],
                    image_url: "" 
                };
            }).filter(item => regex.test(item.title) || regex.test(item.description));

            // 3. Bestaande data inlezen
            let existingArticles = [];
            if (fs.existsSync(dataFile)) {
                existingArticles = flattenData(JSON.parse(fs.readFileSync(dataFile, 'utf-8')));
            }

            // 4. Samenvoegen, ontdubbelen en bronnen repareren
            const allUniqueArticles = new Map();

            // Oude data eerst: we repareren direct de 'Eugene Leenders'-fout
            existingArticles.forEach(article => {
                // Als de source_id geen domein (.nl/.com) bevat, haal hem dan uit de link
                if (article.source_id && !article.source_id.includes('.')) {
                    article.source_id = getDomain(article.link) || article.source_id;
                }
                
                if (article.title) {
                    allUniqueArticles.set(article.title.toLowerCase().trim(), article);
                }
            });

            // Nieuwe data erbij
            newArticles.forEach(article => {
                if (article.title) {
                    allUniqueArticles.set(article.title.toLowerCase().trim(), article);
                }
            });

            // 5. Resultaat sorteren en opslaan
            const combined = Array.from(allUniqueArticles.values());
            combined.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

            fs.writeFileSync(dataFile, JSON.stringify(combined, null, 2));
            console.log(`Succes! Het archief bevat nu ${combined.length} artikelen.`);

        } catch (error) {
            console.error("Fout bij het verwerken:", error);
            process.exit(1);
        }
    });
}).on('error', (err) => {
    console.error("Fout bij ophalen XML:", err.message);
    process.exit(1);
});

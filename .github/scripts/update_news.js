const fs = require('fs');
const https = require('https');
const { XMLParser } = require('fast-xml-parser');

const url = process.env.RSS_FEED_URL;
const dataFile = '_data/news.json';

// Functie om de oude, geneste JSON-structuur (arrays in arrays) plat te slaan
function flattenData(data) {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc, val) => 
        Array.isArray(val) ? acc.concat(flattenData(val)) : acc.concat(val), []
    );
}

https.get(url, (res) => {
    let xmlData = '';
    res.on('data', (chunk) => { xmlData += chunk; });
    res.on('end', () => {
        try {
            // 1. Parse de Google Nieuws XML
            const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
            const jsonObj = parser.parse(xmlData);
            let items = jsonObj.rss?.channel?.item || [];
            if (!Array.isArray(items)) items = [items];

            // 2. Filter en formatteer de nieuwe artikelen
            const newArticles = items.map(item => {
                const title = item.title || "";
                const description = item.description || "";
                
                return {
                    title: title,
                    link: item.link || "",
                    pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    source_id: item.source && item.source['#text'] ? item.source['#text'] : "Onbekende bron",
                    description: description.replace(/<[^>]*>?/gm, ''), // Verwijder eventuele HTML-tags uit beschrijving
                    creator: [],
                    image_url: "" // Optioneel in de toekomst te vullen via OpenGraph scraping
                };
            }).filter(item => {
                // Strenge controle: naam moet in titel of beschrijving staan
                const regex = /Eijbaard/i;
                return regex.test(item.title) || regex.test(item.description);
            });

            // 3. Bestaande data inlezen en repareren
            let existingArticles = [];
            if (fs.existsSync(dataFile)) {
                const rawData = fs.readFileSync(dataFile, 'utf-8');
                existingArticles = flattenData(JSON.parse(rawData));
            }

            // 4. Samenvoegen en ontdubbelen op basis van URL of exacte titel
            const combined = [...existingArticles];
            const existingLinks = new Set(existingArticles.map(a => a.link));
            const existingTitles = new Set(existingArticles.map(a => a.title));

            newArticles.forEach(article => {
                if (!existingLinks.has(article.link) && !existingTitles.has(article.title)) {
                    combined.push(article);
                }
            });

            // 5. Sorteren op datum (nieuwste eerst)
            combined.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

            // 6. Opslaan
            fs.writeFileSync(dataFile, JSON.stringify(combined, null, 2));
            console.log(`Succes! Het archief bevat nu ${combined.length} artikelen.`);

        } catch (error) {
            console.error("Fout bij het verwerken van de XML:", error);
            process.exit(1);
        }
    });
}).on('error', (err) => {
    console.error("Fout bij ophalen van Google News RSS:", err.message);
    process.exit(1);
});

const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const googleUrl = process.env.RSS_FEED_URL;
const dataFile = '_data/news.json';

// De directe, hoogwaardige RSS-bronnen (De "Premium" Data)
const directFeeds = [
    { url: 'https://www.rtvutrecht.nl/rss/nieuws.xml', source_id: 'rtvutrecht.nl' },
    { url: 'https://www.eemland1.nl/rss', source_id: 'eemland1.nl' },
    { url: 'https://www.baarnschecourant.nl/rss', source_id: 'baarnschecourant.nl' },
    { url: 'https://www.gooieneemlander.nl/rss/', source_id: 'gooieneemlander.nl' }
];

// 1. Essentiële Hulpfuncties
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

// DE STOFZUIGER: Deze functie voorkomt dat Jekyll ooit nog crasht
function cleanText(text) {
    if (!text) return "";
    return text.toString()
        .replace(/<[^>]*>?/gm, '') // Strip HTML tags
        .replace(/&nbsp;/g, ' ') // Vervang vreemde spaties
        .replace(/&quot;/g, '"')
        .replace(/[\n\r\t]/g, ' ') // VERWIJDER NEWLINES EN TABS (De boosdoener!)
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Verwijder onzichtbare control characters
        .trim();
}

function getImageUrl(item) {
    // Haal de prachtige, originele foto's uit de RSS structuur
    if (item.enclosure) {
        const enc = Array.isArray(item.enclosure) ? item.enclosure[0] : item.enclosure;
        if (enc && enc['@_url']) return enc['@_url'];
    }
    if (item['media:content']) {
        const mc = Array.isArray(item['media:content']) ? item['media:content'][0] : item['media:content'];
        if (mc && mc['@_url']) return mc['@_url'];
    }
    return "";
}

// 2. Ophaalfunctie
async function fetchAndParseXML(url) {
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        if (!response.ok) return [];
        const xmlData = await response.text();
        
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
        const jsonObj = parser.parse(xmlData);
        let items = jsonObj.rss?.channel?.item || [];
        return Array.isArray(items) ? items : [items];
    } catch (e) {
        console.error(`Fout bij ophalen feed: ${url}`, e.message);
        return [];
    }
}

async function updateNews() {
    try {
        const allUniqueArticles = new Map();

        // STAP 1: Oude data inlezen en grondig desinfecteren
        let existingArticles = [];
        if (fs.existsSync(dataFile)) {
            existingArticles = flattenData(JSON.parse(fs.readFileSync(dataFile, 'utf-8')));
            console.log(`=> Bestaand archief ingelezen: ${existingArticles.length} artikelen.`);
        }

        existingArticles.forEach(article => {
            // Bronnamen herstellen als het fout ging (bijv. "news.google.com" of een naam)
            if (article.source_id && (!article.source_id.includes('.') || article.source_id === 'news.google.com')) {
                article.source_id = getDomain(article.link) || article.source_id;
            }
            
            // Datums veilig normaliseren
            if (article.pubDate && typeof article.pubDate === 'string' && !article.pubDate.includes('T')) {
                const parsedDate = new Date(article.pubDate.replace(" ", "T") + "Z");
                if (!isNaN(parsedDate)) article.pubDate = parsedDate.toISOString();
            }
            
            // TITELS EN OMSCHRIJVINGEN VEILIGSTELLEN
            article.title = cleanText(article.title);
            article.description = cleanText(article.description);
            
            if (article.title) {
                allUniqueArticles.set(getDedupKey(article.title), article);
            }
        });

        let addedCount = 0;

        // STAP 2: Directe premium feeds uitlezen (Met de perfecte foto's en links)
        console.log("\n=> Directe kranten-feeds uitlezen (Premium data)...");
        for (const feed of directFeeds) {
            const items = await fetchAndParseXML(feed.url);
            for (const item of items) {
                const title = cleanText(item.title);
                const desc = cleanText(item.description);
                
                // Lokaal filter: Bevat het echt jouw naam?
                const searchRegex = /Eijbaard/i;
                if (searchRegex.test(title) || searchRegex.test(desc)) {
                    const key = getDedupKey(title);
                    
                    // We voegen hem toe als hij niet bestaat, OF overschrijven hem als de oude versie fout was
                    if (!allUniqueArticles.has(key) || allUniqueArticles.get(key).source_id === 'news.google.com') {
                        const newArticle = {
                            title: title,
                            link: item.link || "",
                            pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                            source_id: feed.source_id,
                            description: desc,
                            creator: item.author ? [cleanText(item.author)] : [],
                            image_url: getImageUrl(item)
                        };
                        allUniqueArticles.set(key, newArticle);
                        addedCount++;
                        console.log(`   + Toegevoegd/geüpdatet via directe feed: ${title}`);
                    }
                }
            }
        }

        // STAP 3: Google Nieuws vangnet (Voor AD.nl en landelijke incidenten)
        console.log("\n=> Google Nieuws vangnet uitlezen (Voor o.a. AD.nl)...");
        if (googleUrl) {
            const googleItems = await fetchAndParseXML(googleUrl);
            for (const item of googleItems) {
                const title = cleanText(item.title);
                const cleanTitle = title.replace(/ - [^-]+$/, '').trim(); 
                const key = getDedupKey(cleanTitle);

                // AD of Google-links alleen toelaten als we ze écht nergens anders konden vinden
                if (!allUniqueArticles.has(key)) {
                    
                    let sourceDomain = "Onbekende bron";
                    if (item.source && item.source['@_url']) {
                        sourceDomain = getDomain(item.source['@_url']) || "Onbekende bron";
                    }

                    let fallbackDesc = cleanText(item.description);
                    if (fallbackDesc.includes('  ')) fallbackDesc = fallbackDesc.split('  ')[0].trim();
                    if (fallbackDesc.includes("Uitgebreide up-to-date")) fallbackDesc = "";

                    const newArticle = {
                        title: cleanTitle,
                        link: item.link || "", 
                        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        source_id: sourceDomain,
                        description: fallbackDesc,
                        creator: [], 
                        image_url: "" 
                    };
                    allUniqueArticles.set(key, newArticle);
                    addedCount++;
                    console.log(`   + Toegevoegd via Google vangnet: ${cleanTitle}`);
                }
            }
        }

        // STAP 4: Sorteren met ijzeren logica
        const combined = Array.from(allUniqueArticles.values());
        combined.sort((a, b) => {
            const dateA = new Date(a.pubDate).getTime();
            const dateB = new Date(b.pubDate).getTime();
            if (isNaN(dateA) && isNaN(dateB)) return 0;
            if (isNaN(dateA)) return 1;  
            if (isNaN(dateB)) return -1; 
            return dateB - dateA;
        });

        // Schoon opslaan
        fs.writeFileSync(dataFile, JSON.stringify(combined, null, 2));
        console.log(`\n🎉 SUCCES! Het schone archief bevat nu ${combined.length} artikelen.`);

    } catch (error) {
        console.error("Fatale fout tijdens het updaten van nieuws:", error);
        process.exit(1);
    }
}

updateNews();

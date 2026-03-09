const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const googleUrl = process.env.RSS_FEED_URL;
const dataFile = '_data/news.json';

// De directe, hoogwaardige RSS-bronnen
const directFeeds = [
    { url: 'https://www.rtvutrecht.nl/rss/nieuws.xml', source_id: 'rtvutrecht.nl' },
    { url: 'https://www.eemland1.nl/rss', source_id: 'eemland1.nl' },
    { url: 'https://www.baarnschecourant.nl/rss', source_id: 'baarnschecourant.nl' },
    { url: 'https://www.gooieneemlander.nl/rss/', source_id: 'gooieneemlander.nl' }
];

const searchRegex = /Eijbaard/i;

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

// SLIMME TITEL OPSCHONER: Haalt veilig krantennamen weg, zelfs als ze een streepje bevatten
function removeBrandSuffix(title) {
    if (!title) return "";
    let clean = title;
    
    // 1. Haal specifieke bekende merken weg
    const brands = ["De Gooi- en Eemlander", "Baarnsche Courant", "AD.nl", "RTV Utrecht", "eemland1"];
    for (let brand of brands) {
        const regex = new RegExp(`\\s+-\\s+${brand}$`, 'i');
        if (regex.test(clean)) {
            return clean.replace(regex, '').trim();
        }
    }
    
    // 2. Algemene fallback voor onbekende kranten uit Google News
    clean = clean.replace(/\s+-\s+[^-]+$/, '');
    
    return clean.trim();
}

// Genereert een ontdubbelingssleutel op basis van de opgeschoonde titel
function getDedupKey(title) {
    if (!title) return "onbekend";
    return title.toLowerCase().trim();
}

function cleanText(text) {
    if (!text) return "";
    return text.toString()
        .replace(/<[^>]*>?/gm, '') 
        .replace(/&nbsp;/g, ' ') 
        .replace(/&quot;/g, '"')
        .replace(/[\n\r\t]/g, ' ') 
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") 
        .trim();
}

function getImageUrl(item) {
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

        // STAP 1: Bestaande data inlezen en direct opschonen
        let existingArticles = [];
        if (fs.existsSync(dataFile)) {
            existingArticles = flattenData(JSON.parse(fs.readFileSync(dataFile, 'utf-8')));
            console.log(`=> Bestaand archief ingelezen: ${existingArticles.length} artikelen.`);
        }

        existingArticles.forEach(article => {
            if (article.source_id && (!article.source_id.includes('.') || article.source_id === 'news.google.com')) {
                article.source_id = getDomain(article.link) || article.source_id;
            }
            if (article.pubDate && typeof article.pubDate === 'string' && !article.pubDate.includes('T')) {
                const parsedDate = new Date(article.pubDate.replace(" ", "T") + "Z");
                if (!isNaN(parsedDate)) article.pubDate = parsedDate.toISOString();
            }
            
            // Pas de slimme opschoner ook direct toe op je bestaande archief!
            article.title = removeBrandSuffix(cleanText(article.title));
            article.description = cleanText(article.description);
            
            if (article.title) {
                allUniqueArticles.set(getDedupKey(article.title), article);
            }
        });

        let addedCount = 0;

        // STAP 2: Directe feeds ophalen
        console.log("\n=> Directe kranten-feeds uitlezen...");
        for (const feed of directFeeds) {
            const items = await fetchAndParseXML(feed.url);
            for (const item of items) {
                const rawTitle = cleanText(item.title);
                const rawDesc = cleanText(item.description);
                
                if (searchRegex.test(rawTitle) || searchRegex.test(rawDesc)) {
                    // Haal de krantnaam eraf
                    const title = removeBrandSuffix(rawTitle);
                    const key = getDedupKey(title);
                    
                    if (!allUniqueArticles.has(key) || allUniqueArticles.get(key).source_id === 'news.google.com') {
                        const newArticle = {
                            title: title,
                            link: item.link || "",
                            pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                            source_id: feed.source_id,
                            description: rawDesc,
                            creator: item.author ? [cleanText(item.author)] : [],
                            image_url: getImageUrl(item)
                        };
                        allUniqueArticles.set(key, newArticle);
                        addedCount++;
                        console.log(`   + Toegevoegd/geüpdatet: ${title}`);
                    }
                }
            }
        }

        // STAP 3: Google Nieuws vangnet
        console.log("\n=> Google Nieuws vangnet uitlezen...");
        if (googleUrl) {
            const googleItems = await fetchAndParseXML(googleUrl);
            for (const item of googleItems) {
                const rawTitle = cleanText(item.title);
                const title = removeBrandSuffix(rawTitle);
                const key = getDedupKey(title);

                if (!allUniqueArticles.has(key)) {
                    let sourceDomain = "Onbekende bron";
                    if (item.source && item.source['@_url']) {
                        sourceDomain = getDomain(item.source['@_url']) || "Onbekende bron";
                    }

                    let fallbackDesc = cleanText(item.description);
                    if (fallbackDesc.includes('  ')) fallbackDesc = fallbackDesc.split('  ')[0].trim();
                    if (fallbackDesc.includes("Uitgebreide up-to-date")) fallbackDesc = "";

                    const newArticle = {
                        title: title,
                        link: item.link || "", 
                        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                        source_id: sourceDomain,
                        description: fallbackDesc,
                        creator: [], 
                        image_url: "" 
                    };
                    allUniqueArticles.set(key, newArticle);
                    addedCount++;
                    console.log(`   + Toegevoegd via Google vangnet: ${title}`);
                }
            }
        }

        // STAP 4: Sorteren en wegschrijven
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
        console.log(`\n🎉 SUCCES! Het schone archief bevat nu ${combined.length} artikelen.`);

    } catch (error) {
        console.error("Fout tijdens het updaten van nieuws:", error);
        process.exit(1);
    }
}

updateNews();
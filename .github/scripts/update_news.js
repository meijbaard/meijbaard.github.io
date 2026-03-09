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

// Zoekterm voor de lokale feeds
const searchRegex = /Eijbaard/i;

// 1. Hulpfuncties
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

function cleanText(text) {
    if (!text) return "";
    // Verwijdert HTML-tags en illegale/onzichtbare stuurkarakters waar Jekyll op crasht
    return text.toString()
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        .trim();
}

function getImageUrl(item) {
    // Zoekt naar de omslagfoto in de standaard RSS attributen
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

// 2. Fetch-functie voor de XML feeds
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

        // STAP 1: Oude data inlezen (De 1700 regels veiligstellen)
        let existingArticles = [];
        if (fs.existsSync(dataFile)) {
            existingArticles = flattenData(JSON.parse(fs.readFileSync(dataFile, 'utf-8')));
            console.log(`=> Bestaand archief ingelezen: ${existingArticles.length} artikelen.`);
        }

        existingArticles.forEach(article => {
            if (article.source_id && !article.source_id.includes('.')) {
                article.source_id = getDomain(article.link) || article.source_id;
            }
            if (article.pubDate && typeof article.pubDate === 'string' && !article.pubDate.includes('T')) {
                const parsedDate = new Date(article.pubDate.replace(" ", "T") + "Z");
                if (!isNaN(parsedDate)) article.pubDate = parsedDate.toISOString();
            }
            article.title = cleanText(article.title);
            article.description = cleanText(article.description);
            
            if (article.title) {
                allUniqueArticles.set(getDedupKey(article.title), article);
            }
        });

        let addedCount = 0;

        // STAP 2: Directe premium feeds uitlezen
        console.log("\n=> Directe kranten-feeds uitlezen (Premium data)...");
        for (const feed of directFeeds) {
            const items = await fetchAndParseXML(feed.url);
            for (const item of items) {
                const title = cleanText(item.title);
                const desc = cleanText(item.description);
                
                // Lokaal filter: Bevat het de naam Eijbaard?
                if (

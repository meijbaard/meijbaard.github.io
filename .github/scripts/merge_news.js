// .github/scripts/merge_news.js
const fs = require('fs');

const oldNewsPath = process.argv[2];
const newNewsPath = process.argv[3];

// Functie om JSON-bestanden robuust in te lezen en te strippen van onzichtbare tekens (BOM).
function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    // Lees als een ruwe buffer en converteer naar UTF-8, wat encoding-problemen oplost.
    let content = fs.readFileSync(filePath, 'utf-8');
    // Verwijder een eventueel BOM-teken aan het begin van het bestand.
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    try {
        return JSON.parse(content);
    } catch (e) {
        // Als het bestand corrupt is, behandel het als leeg.
        return [];
    }
}

// 1. Lees de nieuw-opgehaalde artikelen in.
const newArticles = readJsonFile(newNewsPath);

// 2. Lees de bestaande artikelen in.
const oldNewsFile = readJsonFile(oldNewsPath);

// 3. Pak de data correct uit, ongeacht of het [[...]] of [...] formaat is.
let oldArticles = [];
if (Array.isArray(oldNewsFile)) {
    if (Array.isArray(oldNewsFile[0]) && oldNewsFile.length === 1) {
        // Dit is de [[...]] structuur.
        oldArticles = oldNewsFile[0];
    } else {
        // Dit is de [...] structuur.
        oldArticles = oldNewsFile;
    }
}

// 4. Combineer, ontdubbel en sorteer.
const allArticles = [...oldArticles, ...newArticles];
const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.link, item])).values());
uniqueArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

// 5. Pak de definitieve lijst weer in in de [[...]] structuur.
const finalData = [uniqueArticles];

// 6. Print het resultaat.
console.log(JSON.stringify(finalData, null, 2));

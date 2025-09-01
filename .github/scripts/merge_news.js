// .github/scripts/merge_news.js
const fs = require('fs');

const oldNewsPath = process.argv[2];
const newNewsPath = process.argv[3];

// Functie om JSON-bestanden robuust in te lezen, ongeacht encoding.
function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) return [];
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
    try {
        return JSON.parse(content);
    } catch (e) {
        return [];
    }
}

// 1. Lees de nieuw-opgehaalde artikelen in.
const newArticles = readJsonFile(newNewsPath);

// 2. Lees het bestaande archief in.
const oldNewsFile = readJsonFile(oldNewsPath);

// 3. Pak de data correct uit, ongeacht of het de [[...]] of [...] structuur is.
let oldArticles = [];
if (Array.isArray(oldNewsFile)) {
    if (oldNewsFile.length === 1 && Array.isArray(oldNewsFile[0])) {
        // Dit is de [[...]] structuur.
        oldArticles = oldNewsFile[0];
    } else {
        // Dit is de platte [...] structuur.
        oldArticles = oldNewsFile;
    }
}

// 4. Combineer de twee lijsten.
const allArticles = [...oldArticles, ...newArticles];

// 5. Ontdubbel de gecombineerde lijst op basis van de unieke 'title'.
const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.title, item])).values());

// 6. Sorteer de lijst op datum (nieuwste eerst).
uniqueArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

// 7. Pak de definitieve lijst weer in in de [[...]] structuur.
const finalData = [uniqueArticles];

// 8. Print het resultaat.
console.log(JSON.stringify(finalData, null, 2));

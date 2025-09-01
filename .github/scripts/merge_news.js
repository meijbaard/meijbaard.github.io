// .github/scripts/merge_news.js
const fs = require('fs');

const oldNewsPath = process.argv[2];
const newNewsPath = process.argv[3];

// 1. Lees de nieuw-opgehaalde artikelen in.
const newArticles = JSON.parse(fs.readFileSync(newNewsPath, 'utf-8'));

// 2. Lees de bestaande artikelen in (of begin met een lege lijst).
let oldArticles = [];
if (fs.existsSync(oldNewsPath)) {
    try {
        const oldNewsFile = JSON.parse(fs.readFileSync(oldNewsPath, 'utf-8'));
        // Pak de data uit de [[...]] structuur.
        if (Array.isArray(oldNewsFile) && Array.isArray(oldNewsFile[0])) {
            oldArticles = oldNewsFile[0];
        }
    } catch (e) {
        // Als het oude bestand corrupt of leeg is, negeer het.
    }
}

// 3. Combineer de twee lijsten.
const allArticles = [...oldArticles, ...newArticles];

// 4. Ontdubbel de gecombineerde lijst op basis van de unieke 'link'.
const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.link, item])).values());

// 5. Sorteer de lijst op datum (nieuwste eerst).
uniqueArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

// 6. Pak de definitieve lijst weer in in de [[...]] structuur.
const finalData = [uniqueArticles];

// 7. Print het resultaat als een JSON-string.
console.log(JSON.stringify(finalData, null, 2));

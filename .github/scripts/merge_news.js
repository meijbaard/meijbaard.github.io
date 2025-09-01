#!/usr/bin/env node

const fs = require("fs");

const [existingFile, newFile] = process.argv.slice(2);

if (!existingFile || !newFile) {
  console.error("Gebruik: merge_news.js <bestaand_archief.json> <nieuw_artikelen.json>");
  process.exit(1);
}

const existing = JSON.parse(fs.readFileSync(existingFile, "utf-8"));
const incoming = JSON.parse(fs.readFileSync(newFile, "utf-8"));

// Merge op basis van unieke link
const merged = [...existing];
const existingLinks = new Set(existing.map(a => a.link));

incoming.forEach(article => {
  if (!existingLinks.has(article.link)) {
    merged.push(article);
    console.log("Toegevoegd:", article.title);
  } else {
    console.log("Overgeslagen (bestaat al):", article.title);
  }
});

// Sorteer op publicatiedatum, nieuwste eerst
merged.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

fs.writeFileSync("temp_news.json", JSON.stringify(merged, null, 2));
console.log(`Merge compleet. Totaal artikelen: ${merged.length}`);

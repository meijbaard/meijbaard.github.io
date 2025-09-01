// .github/scripts/merge_news.js
const fs = require('fs');

const oldNewsPath = process.argv[2];
const newNewsPath = process.argv[3];

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1); // BOM
  try { return JSON.parse(content); } catch { return null; }
}

// Extract array with articles
function extractArticles(container) {
  if (!container) return [];
  if (Array.isArray(container)) {
    if (Array.isArray(container[0]) && container.length === 1) return container[0];
    return container;
  }
  if (typeof container === 'object') {
    for (const key of ['articles', 'items', 'news', 'data']) {
      if (Array.isArray(container[key])) return container[key];
    }
    const firstArrayKey = Object.keys(container).find(k => Array.isArray(container[k]));
    if (firstArrayKey) return container[firstArrayKey];
  }
  return [];
}

// Wrap result back in same shape as original
function wrapArticles(articles, originalContainer) {
  if (!originalContainer) return articles;
  if (Array.isArray(originalContainer)) {
    if (Array.isArray(originalContainer[0]) && originalContainer.length === 1) return [articles];
    return articles;
  }
  if (typeof originalContainer === 'object') {
    const targetKey =
      ['articles', 'items', 'news', 'data'].find(k => Array.isArray(originalContainer[k])) ||
      Object.keys(originalContainer).find(k => Array.isArray(originalContainer[k])) ||
      'articles';
    return { ...originalContainer, [targetKey]: articles };
  }
  return articles;
}

// Normalize pubDate to ISO-8601 if possible
function toIsoOrNull(s) {
  if (!s || typeof s !== 'string') return null;
  let d = new Date(s);
  if (!isNaN(d)) return d.toISOString();
  const m = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/.exec(s);
  if (m) {
    d = new Date(`${m[1]}T${m[2]}Z`);
    if (!isNaN(d)) return d.toISOString();
  }
  return null;
}

function ts(article) {
  const iso = toIsoOrNull(article.pubDate);
  return iso ? Date.parse(iso) : 0;
}

function identityKey(a) {
  return (a.link && a.link.trim()) || `${a.title || ''}|${a.pubDate || ''}`;
}

// === Start merging ===
console.log("Lees bestanden in...");
const newArticles = extractArticles(readJsonFile(newNewsPath));
const oldContainer = readJsonFile(oldNewsPath);
const oldArticles = extractArticles(oldContainer);

console.log(`Aantal bestaande artikelen: ${oldArticles.length}`);
console.log(`Aantal nieuwe artikelen: ${newArticles.length}`);

// Merge + dedupe
const map = new Map();
for (const it of [...oldArticles, ...newArticles]) {
  if (!it) continue;
  const key = identityKey(it);
  if (!key) continue;
  const pubDateIso = toIsoOrNull(it.pubDate);
  map.set(key, { ...it, pubDate: pubDateIso });
}

const merged = [...map.values()].sort((a, b) => ts(b) - ts(a));
console.log(`Totaal artikelen na samenvoegen: ${merged.length}`);

// Write back
const finalData = wrapArticles(merged, oldContainer);
process.stdout.write(JSON.stringify(finalData, null, 2) + '\n');

#!/usr/bin/env bash
set -euo pipefail

RSS_FEED_URL="https://example.com/feed"   # <-- vervang door jouw feed URL
TMP_JSON="new_articles.json"

echo ">>> Downloading feed from: $RSS_FEED_URL"

# Download RSS → JSON
curl -s "$RSS_FEED_URL" \
  | xq '.rss.channel.item' \
  | jq '[.[] | {
      title: (.title // ""),
      description: (.description // ""),
      link: (.link // ""),
      pubDate: (.pubDate // ""),
      # source_id = domein uit de link
      source_id: (
        (.link // "")
        | capture("https?://(?<domain>[^/]+)/?") 
        | .domain
      )
    }] ' > "$TMP_JSON"

echo ">>> Downloaded and transformed feed to $TMP_JSON"

# Debug: hoeveel artikelen totaal
COUNT=$(jq 'length' "$TMP_JSON")
echo ">>> Found $COUNT articles in feed"

# Debug: verdeling per source_id
echo ">>> Distribution by source_id:"
jq -r '.[] | .source_id' "$TMP_JSON" | sort | uniq -c

# Filter op zoekterm (voorbeeld: 'Eijbaard')
jq '[.[] 
      | select(
          ((.title // "") | test("Eijbaard"; "i")) or
          ((.description // "") | test("Eijbaard"; "i"))
        )
    ]' "$TMP_JSON" > filtered.json

FILTERED_COUNT=$(jq 'length' filtered.json)
echo ">>> Filtered articles matching 'Eijbaard': $FILTERED_COUNT"

# Overschrijf new_articles.json met gefilterde artikelen
mv filtered.json "$TMP_JSON"

echo ">>> Final new_articles.json ready"
jq '.[:2]' "$TMP_JSON"   # toon eerste 2 artikelen ter controle

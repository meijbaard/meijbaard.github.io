---
title: "In het nieuws"
description: "Een compleet overzicht van nieuwsartikelen en media-optredens. Volg mijn werk als wethouder via de lokale en regionale pers."
permalink: /inhetnieuws/
author_profile: false
layout: default
---

<div class="content-wrapper">

  <div class="news-page-header">
    <div>
      <h1>Mark Eijbaard in het nieuws</h1>
      <p>Een automatisch bijgehouden overzicht van nieuwsartikelen en media-optredens. Elke 4 uur vernieuwd met berichten van regionale en lokale media over mijn werk als bestuurder — eerst in Baarn, nu in Woudenberg.</p>
      {% assign news_sources = site.data.news | map: "source_id" | compact | uniq %}
      <div class="news-hero-stats">
        <span><strong>{{ site.data.news.size }}</strong> artikelen</span>
        <span><strong>{{ news_sources.size }}</strong> bronnen</span>
        <span>Ieder artikel geverifieerd op naamsvermelding</span>
      </div>
    </div>
  </div>

  <div class="news-controls">
    <div class="news-controls-row">
      <div class="news-search-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
        <input type="search" id="news-search" placeholder="Zoek in titel of tekst…" aria-label="Zoek in nieuwsartikelen" autocomplete="off">
      </div>
      <select id="year-filter" aria-label="Filter op jaar">
        <option value="all">Alle jaren</option>
      </select>
    </div>

    <div id="filter-container">
      <strong>Bron</strong>
      <button class="filter-btn active" data-source="all">Alles tonen</button>
      {% assign sources = site.data.news | map: "source_id" | compact | uniq | sort %}
      {% for source in sources %}
        {% if source != "" and source != "Onbekende bron" %}
          <button class="filter-btn" data-source="{{ source | escape }}">{{ source | escape }}</button>
        {% endif %}
      {% endfor %}
    </div>

    <p id="article-counter" role="status">Totaal {{ site.data.news.size }} artikelen.</p>
  </div>

  <div id="nieuws-dashboard">
    {%- if site.data.news and site.data.news.size > 0 -%}
      <ul id="news-list">
        {%- for item in site.data.news -%}
          <li class="news-item" data-pubdate="{{ item.pubDate | default: '' | escape }}" data-source="{{ item.source_id | default: 'Onbekende bron' | escape }}">

            {%- assign img = item.image_url | default: '' -%}
            {%- if img != "" -%}
              <div class="news-media">
                <img src="{{ img | escape }}" alt="" class="news-image" loading="lazy" onerror="this.closest('.news-media').classList.add('news-media--fallback');this.remove();">
                <span class="news-source-tag">{{ item.source_id | escape }}</span>
              </div>
            {%- else -%}
              <div class="news-media news-media--fallback">
                <span class="news-source-tag">{{ item.source_id | escape }}</span>
              </div>
            {%- endif -%}

            <div class="news-content">
              <h3>
                <a href="{{ item.link | default: '#' | escape }}" target="_blank" rel="noopener noreferrer">{{ item.title | default: 'Zonder titel' | escape }}</a>
              </h3>

              {%- assign desc = item.description | default: '' -%}
              {%- if desc != "" -%}
                <p class="news-desc">{{ desc | escape | truncate: 180 }}</p>
              {%- endif -%}

              <p class="news-meta">
                <time datetime="{{ item.pubDate | escape }}">
                  {%- if item.pubDate and item.pubDate != "" -%}
                    {{ item.pubDate | date: "%-d-%-m-%Y" }}
                  {%- else -%}
                    Datum onbekend
                  {%- endif -%}
                </time>
                {%- assign creator_size = item.creator | compact | size | default: 0 -%}
                {%- if creator_size > 0 -%}
                  <span class="news-meta-sep">·</span> {{ item.creator | join: ", " | escape }}
                {%- endif -%}
              </p>
            </div>
          </li>
        {%- endfor -%}
      </ul>

      <p id="news-empty" hidden>Geen artikelen gevonden voor deze combinatie van filters. <button type="button" id="reset-filters" class="link-btn">Wis alle filters</button></p>

      <div class="load-more-container">
        <button type="button" id="load-more" class="load-more-btn">Toon meer artikelen</button>
      </div>
    {%- else -%}
      <p>Er worden momenteel geen nieuwsberichten gevonden.</p>
    {%- endif -%}
  </div>

  <div class="rss-button-container">
    <a href="{{ site.baseurl }}/feed.xml" class="rss-button" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-rss-fill" viewBox="0 0 16 16">
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm1.5 2.5c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1-1-1zm0 4a6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1-1-1zm.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
      </svg>
      RSS Feed
    </a>
  </div>
</div>

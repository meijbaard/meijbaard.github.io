---
title: "In het Nieuws | Mark Eijbaard | Media-overzicht"
description: "Een compleet overzicht van nieuwsartikelen en media-optredens. Volg mijn werk als wethouder in Baarn via de lokale en regionale pers."
permalink: /inhetnieuws/
author_profile: false
layout: default
---

<div class="content-wrapper">

  <h1>:newspaper: Mark Eijbaard in het nieuws</h1>

  <div class="news-controls">
    <p id="article-counter">Artikelen aan het laden...</p>
    <div>
      <strong>Filter op bron:</strong><br>
      <button class="filter-btn active" data-source="all">Alles tonen</button>
      
      {% assign sources = "" | split: "," %}
      {% for item in site.data.news[0] %}
        {% unless sources contains item.source_id %}
          {% assign sources = sources | push: item.source_id %}
        {% endunless %}
      {% endfor %}
      
      {% for source in sources %}
        <button class="filter-btn" data-source="{{ source }}">{{ source }}</button>
      {% endfor %}
    </div>
  </div>

  <div id="nieuws-dashboard">
    {%- if site.data.news[0] and site.data.news[0].size > 0 -%}
      <ul id="news-list">
        {%- for item in site.data.news[0] -%}
          <li class="news-item" data-pubdate="{{ item.pubDate }}" data-source="{{ item.source_id }}">
            
            {% if item.image_url and item.image_url != "" %}
              <img src="{{ item.image_url }}" alt="Beeld bij artikel: {{ item.title }}" class="news-image" loading="lazy">
            {% endif %}

            <div class="news-content">
              <h3><a href="{{ item.link }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></h3>
              <p>
                <strong>Bron:</strong> {{ item.source_id }} 
                {% if item.creator and item.creator.size > 0 and item.creator[0] != "" %}
                  | <strong>Auteur:</strong> {{ item.creator | join: ", " }}
                {% endif %}
                <br>
                <strong>Publicatiedatum:</strong> {{ item.pubDate | date: "%d-%m-%Y %H:%M" }}
              </p>
              <p>{{ item.description }}</p>
            </div>
          </li>
        {%- endfor -%}
      </ul>
    {%- else -%}
      <p>Er worden momenteel geen nieuwsberichten gevonden. De data wordt elke ochtend bijgewerkt.</p>
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
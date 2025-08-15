---
title: "Mark Eijbaard in het nieuws"
permalink: /inhetnieuws/
author_profile: false
layout: default
---

<style>
  .content-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  .news-controls {
    margin-bottom: 2em;
    padding-bottom: 1em;
    border-bottom: 1px solid #eee;
  }
  .filter-btn {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 8px 15px;
    margin-right: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .filter-btn:hover {
    background-color: #ddd;
  }
  .filter-btn.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }
  .news-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2em;
    list-style-type: none;
    padding-left: 0;
  }
  .news-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    margin-right: 20px;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .news-content {
    flex: 1;
  }
  .news-content h3 {
    margin-top: 0;
  }
  ul#news-list {
    padding-left: 0;
  }
  .rss-button-container {
    text-align: center;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  .rss-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    background-color: #ff6600; /* Classic RSS orange */
    color: white;
    text-decoration: none;
    border-radius: 20px;
    font-weight: bold;
    transition: background-color 0.2s;
  }
  .rss-button:hover {
    background-color: #e65c00;
  }
  .rss-button svg {
    margin-right: 8px;
  }
</style>

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
              <img src="{{ item.image_url }}" alt="Beeld bij artikel: {{ item.title }}" class="news-image">
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

  <!-- RSS KNOP TOEGEVOEGD -->
  <div class="rss-button-container">
    <a href="{{ site.baseurl }}/feed.xml" class="rss-button" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-rss-fill" viewBox="0 0 16 16">
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm1.5 2.5c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1-1-1zm0 4a6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1-1-1zm.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
      </svg>
      RSS Feed
    </a>
  </div>

</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const newsItems = document.querySelectorAll('#news-list .news-item');
  const counter = document.getElementById('article-counter');

  function updateCounter() {
    const visibleItems = document.querySelectorAll('#news-list .news-item:not([style*="display: none"])').length;
    counter.textContent = `Totaal ${visibleItems} van de ${newsItems.length} artikelen getoond.`;
  }
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const sourceFilter = this.dataset.source;
      
      newsItems.forEach(item => {
        if (sourceFilter === 'all' || item.dataset.source === sourceFilter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
      
      updateCounter();
    });
  });

  function addNewBadges() {
    const twentyFiveHoursAgo = new Date();
    twentyFiveHoursAgo.setHours(twentyFiveHoursAgo.getHours() - 25);
    
    newsItems.forEach(item => {
      const pubDateString = item.dataset.pubdate;
      if (pubDateString) {
        const pubDate = new Date(pubDateString.replace(" ", "T") + "Z");
        if (pubDate > twentyFiveHoursAgo) {
          if (item.querySelector('.new-badge')) return;
          
          const newBadge = document.createElement('span');
          newBadge.textContent = '✨ Nieuw';
          newBadge.className = 'new-badge';
          newBadge.style.backgroundColor = '#28a745';
          newBadge.style.color = 'white';
          newBadge.style.padding = '3px 8px';
          newBadge.style.marginLeft = '10px';
          newBadge.style.borderRadius = '5px';
          newBadge.style.fontSize = '0.8em';
          newBadge.style.fontWeight = 'bold';
          item.querySelector('h3').appendChild(newBadge);
        }
      }
    });
  }

  updateCounter();
  addNewBadges();
});
</script>

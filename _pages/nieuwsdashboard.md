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
  .news-item {
    display: flex; /* Maakt het mogelijk om afbeelding en tekst naast elkaar te zetten */
    align-items: flex-start; /* Lijn de bovenkanten uit */
    margin-bottom: 2em; /* Ruimte tussen de nieuwsitems */
    list-style-type: none;
  }
  .news-image {
    width: 150px;
    height: 150px;
    object-fit: cover; /* Zorgt dat de afbeelding mooi wordt bijgesneden */
    margin-right: 20px;
    border-radius: 8px;
  }
  .news-content {
    flex: 1; /* Neemt de resterende ruimte in */
  }
  .news-content h3 {
    margin-top: 0; /* Verwijdert de standaard witruimte boven de titel */
  }
</style>

<div class="content-wrapper">

  <h1>Mark Eijbaard in het nieuws</h1>
  <div id="nieuws-dashboard">
    {%- if site.data.news and site.data.news.size > 0 -%}
      <ul>
        {%- for item in site.data.news -%}
          <li class="news-item" data-pubdate="{{ item.pubDate }}">
            
            {% if item.image_url %}
              <img src="{{ item.image_url }}" alt="Beeld bij artikel: {{ item.title }}" class="news-image">
            {% endif %}

            <div class="news-content">
              <h3><a href="{{ item.link }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></h3>
              <p>
                <strong>Bron:</strong> {{ item.source_id }} 
                {% if item.creator %}
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
      <p>Er is geen nieuws gevonden.</p>
    {%- endif -%}
  </div>

</div>

<script>
  // Het script om "Nieuw" labels toe te voegen blijft hetzelfde
  document.addEventListener('DOMContentLoaded', function() {
    const twentyFiveHoursAgo = new Date();
    twentyFiveHoursAgo.setHours(twentyFiveHoursAgo.getHours() - 25);
    const newsItems = document.querySelectorAll('#nieuws-dashboard li');
    
    newsItems.forEach(item => {
      const pubDateString = item.dataset.pubdate;
      if (pubDateString) {
        const pubDate = new Date(pubDateString.replace(" ", "T") + "Z");
        if (pubDate > twentyFiveHoursAgo) {
          const newBadge = document.createElement('span');
          newBadge.textContent = '✨ Nieuw';
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
  });
</script>

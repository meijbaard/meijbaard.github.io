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
  ul {
    padding-left: 0;
  }
</style>

<div class="content-wrapper">

  <h1>Mark Eijbaard in het nieuws</h1>

  <div id="nieuws-dashboard">
    {%- if site.data.news[0] and site.data.news[0].size > 0 -%}
      <ul>
        {%- for item in site.data.news[0] -%}
          <li class="news-item" data-pubdate="{{ item.pubDate }}">
            
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

</div>

<script>
  // Script om "Nieuw" labels toe te voegen
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

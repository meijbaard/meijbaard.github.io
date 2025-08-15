---
title: "Mark Eijbaard in het nieuws"
permalink: /nieuwsdashboard/
author_profile: false
layout: default
---

<h1>Mark Eijbaard in het nieuws</h1>
<div id="nieuws-dashboard">
  {%- if site.data.news and site.data.news.size > 0 -%}
    <ul>
      {%- for item in site.data.news -%}
        <li data-pubdate="{{ item.pubDate }}">
          <h3><a href="{{ item.link }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></h3>
          <p><strong>Bron:</strong> {{ item.source_id }} | <strong>Publicatiedatum:</strong> {{ item.pubDate | date: "%d-%m-%Y %H:%M" }}</p>
          <p>{{ item.description }}</p>
        </li>
      {%- endfor -%}
    </ul>
  {%- else -%}
    <p>Er is geen nieuws gevonden.</p>
  {%- endif -%}
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Stel de tijd in voor 25 uur geleden (iets ruimer voor de zekerheid)
    const twentyFiveHoursAgo = new Date();
    twentyFiveHoursAgo.setHours(twentyFiveHoursAgo.getHours() - 25);

    // Zoek alle nieuws-items op de pagina
    const newsItems = document.querySelectorAll('#nieuws-dashboard li');
    
    newsItems.forEach(item => {
      // Haal de publicatiedatum op die we in de HTML hebben gezet
      const pubDateString = item.dataset.pubdate;
      if (pubDateString) {
        const pubDate = new Date(pubDateString.replace(" ", "T") + "Z"); // Maak datum compatibel
        
        // Als het bericht recent is, voeg een "Nieuw" label toe
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

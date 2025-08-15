---
title: "Mark Eijbaard in het nieuws"
permalink: /nieuwsdashboard/
author_profile: false
layout: dashboard
---

<h1>Mark Eijbaard in het nieuws</h1>
<div id="nieuws-dashboard">
  {%- if site.data.news.size > 0 -%}
    <ul>
      {%- for item in site.data.news -%}
        <li>
          <h3><a href="{{ item.link }}" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></h3>
          <p><strong>Bron:</strong> {{ item.source_id }} | <strong>Publicatiedatum:</strong> {{ item.pubDate | date: "%d-%m-%Y" }}</p>
          <p>{{ item.description }}</p>
        </li>
      {%- endfor -%}
    </ul>
  {%- else -%}
    <p>Er is geen recent nieuws gevonden.</p>
  {%- endif -%}
</div>

---
title: "Projecten | Mark Eijbaard | Een overzicht van mijn werk"
pagetitle: "Mijn Projecten"
permalink: /projecten/
layout: single
author_profile: true
description: "Een overzicht van de projecten waar ik aan werk of heb gewerkt, variërend van open-source dashboards tot beleidsinitiatieven in Baarn."
---

Hieronder vind je een overzicht van de projecten waar ik aan werk of heb gewerkt. Klik op een project voor meer informatie.

{% for project in site.projects %}
  ## [{{ project.title }}]({{ project.url | relative_url }})
  {{ project.excerpt }}
{% endfor %}

---
# === FRONT MATTER ===
title: "Begrotingsblik | Grip op gemeentelijke financiën | Mark Eijbaard"
pagetitle: "Begrotingsblik"
excerpt: "Een bestuurlijk dashboard dat de cijfers uit begrotingen en jaarstukken van gemeenten doorzoekbaar, vergelijkbaar en bevraagbaar maakt — gebouwd met AI, zonder softwarehuis."
date: 2026-08-22
author_profile: true
layout: single
header:
  overlay_image: /assets/images/begrotingsblik.webp
  overlay_filter: 0.35
  caption: "Begrotingsblik — begrotingsblik.nl"
  actions:
    - label: "Naar begrotingsblik.nl"
      url: "https://begrotingsblik.nl"
tags:
  - Begrotingsblik
  - Financiën
  - Open data
  - AI
  - Woudenberg
---

## Waarom ik dit bouwde

Als wethouder wil je grip op de begroting en op de budgetten waar je verantwoordelijk voor bent. Die cijfers bestaan — maar ze staan verspreid over honderden pagina's begroting, jaarstukken en verantwoordingsbijlagen, in een ritme dat slecht past bij de vragen van alledag: *hoe staan we ervoor, waar loopt het uit de pas, en hoe doen de buurgemeenten het?*

Begrotingsblik haalt die cijfers uit de officiële documenten en maakt ze doorzoekbaar, vergelijkbaar en bevraagbaar. Wat eerst een middag lezen kostte, zie je nu in een paar minuten.

Het begon als een dashboard voor mijzelf, voor Woudenberg. Inmiddels is het een platform waarop tien gemeenten uit de regio elk een eigen, afgeschermde omgeving hebben.

[![Startpagina van Begrotingsblik](/assets/images/dashboard_begrotingsblik.webp)](https://begrotingsblik.nl){: target="_blank" rel="noopener"}

## Wat je ermee kunt

| Onderdeel | Waarvoor |
|---|---|
| **Dashboard** | De kerncijfers, het ravijnjaar-signaal en stoplichten per beleidsterrein |
| **Ochtendbrief** | Elke werkdag klaargezet: regionaal nieuws, vaknieuws, agenda, raadscyclus en actiepunten |
| **Mijn portefeuille** | Alle thema's van één portefeuille met budget, realisatie en gekoppelde doelen |
| **Begroting & jaarrekening** | Cijfers per programma, met een Iv3-benchmark tegen vergelijkbare gemeenten |
| **Meerjarenperspectief en gemeentefonds** | De meerjarenraming, het verloop van de reserves en de circulaires |
| **SPUK's** | Specifieke uitkeringen, gegroepeerd naar financieringslogica |
| **Colleges & gemeenschappelijke regelingen** | Wie zit waar in de regio — te filteren op bestuursorgaan, rol, partij en regeling |
| **Coalitiebouwer** | Per regeling of eigen groep bijhouden wie voor, tegen of twijfelend is op een onderwerp |
| **Wijken & buurten** | CBS-kerncijfers per buurt op de kaart |

Rechtsonder in het dashboard zit een AI-assistent die vragen beantwoordt over het gebruik én over de cijfers van je eigen gemeente.

## Waar de cijfers vandaan komen

Alle bedragen komen rechtstreeks uit de openbare begrotingen en jaarstukken van de deelnemende gemeenten: het BBV-overzicht van baten en lasten, de taakvelden, de SiSa-bijlagen en de BBV-kengetallen. Elke pagina vermeldt zijn bron, zodat elk getal terug te voeren is op het raadsstuk waar het uit komt. Aanvullend gebruik ik open data van CBS StatLine: wijk- en buurtcijfers, Iv3-rekeningencijfers en de arbeidsmarktregistraties van UWV en SZW.

## Gebouwd met AI

Deze applicatie is volledig gebouwd met [Claude Code](https://claude.com/claude-code), het AI-programmeergereedschap van Anthropic — van het datamodel en de beveiliging tot de productpagina. Er is geen ontwikkelteam. Ik beschrijf wat er moet gebeuren, beoordeel het resultaat en bepaal de koers; de AI schrijft de code.

Dat maakt Begrotingsblik voor mij ook een praktijkvoorbeeld van een vraag die ik vaak krijg: *wat kun je met de AI-gereedschappen van nu zelf bouwen, zonder softwarehuis?* Het antwoord blijkt: behoorlijk veel, als je weet wat je wilt en scherp blijft op wat er terugkomt.

Drie uitgangspunten sturen het ontwerp:

- **Data staat los van code.** Cijfers, definities en duiding staan in databestanden, niet in de applicatie. Een begrotingswijziging verwerken is een databestand aanpassen — niet programmeren.
- **Eén platte personenlijst, meerdere gezichten.** "Wie zit er in de AVU", "alle burgemeesters" en "het college van Baarn" zijn dezelfde zoekopdracht met een ander filter.
- **Werken zonder afhankelijkheden.** Geen bouwstap, geen framework. De database en de login zijn een laag eromheen; de kern blijft ook zonder werken.

## Zorgvuldigheid en privacy

Elke gemeente-omgeving is besloten en zit achter verplichte tweestapsverificatie. Toegang is gescheiden per gemeente en per rol. Alles draait op eigen infrastructuur binnen de EU.

## Meedoen?

Wil je een demo, of je gemeente aanmelden? Kijk op [begrotingsblik.nl](https://begrotingsblik.nl) of neem [contact](/contact/) met mij op.

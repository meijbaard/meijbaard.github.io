---
title: "Kennisbank met AI"
pagetitle: "3. Kennisbank met AI"
permalink: /training/kennisbank/
layout: single
toc: true
toc_label: "Op deze pagina"
toc_sticky: true
description: "Onderdeel 3 van Van Drukte naar Regie: een kennisbank in drie lagen, de basisworkflow van document naar antwoord, en waarom markdown betere AI-antwoorden geeft dan PDF."
header:
  overlay_image: /assets/images/begrotingsblik.webp
  overlay_filter: 0.6
  caption: "Van documenten naar inzicht"
---

> **De kern in één zin:** alles wat je nooit kunt lezen, werkt voortaan voor jou — de kennisbank leest het voor je.

Dit is de basis van het derde onderdeel. Ermee beginnen kan vanmiddag; [de verdieping zit in de cursus bij het sjabloon](#verder-in-de-cursus).

## Wat een kennisbank is

Een kennisbank is geen map met PDF's. Het is een systeem dat documenten vertaalt naar inzicht — gestructureerd, doorzoekbaar en actueel. Het bestaat uit drie lagen:

| Laag | Wat erin zit | Waarvoor |
|---|---|---|
| **Raw/** | Originele brondocumenten als tekst | Bewaard als bron, nooit gewijzigd |
| **Wiki/** | Samengestelde artikelen per dossier, geschreven met AI | Opzoeken, raadplegen, vergelijken |
| **Outputs/** | Rapporten, antwoorden, samenvattingen | Gebruik in vergadering, brief of advies |

Waarom die scheiding? Als je twijfelt aan een antwoord, ga je altijd terug naar het origineel in Raw. De wiki is werkgereedschap, geen archief.

## De basisworkflow: drie stappen

```
Stap 1 — Document opslaan
Nieuw vergaderverslag of beleidsnota? → Bewaar in _To_convert/

Stap 2 — Omzetten naar markdown
PDF → schone tekst → Bewaar in Raw/

Stap 3 — AI bevragen
Lever de tekst aan als context → Stel je vraag → Antwoord met bronverwijzing
```

Drie stappen. Altijd dezelfde volgorde. Altijd dezelfde plek.

## Vragen stellen aan je kennisbank

Zodra er wiki-artikelen zijn, is de kennisbank een gesprekspartner. Drie soorten vragen:

1. **Feitelijk** — *"Wanneer heeft de raad voor het laatst gesproken over het cultuurhuis?"* → datum, context, bron.
2. **Analyse** — *"Wat zijn de standpunten van de partijen over de woningbouwopgave?"* → overzicht per partij, met citaten.
3. **Vergelijking** — *"Hoe is het debat over de openbare ruimte veranderd tussen 2021 en 2024?"* → een lijn door de tijd.

De grens: AI weet alleen wat in de kennisbank staat. Kwaliteit erin is kwaliteit eruit.

## Waarom markdown

PDF's zijn lastig voor AI: opmaakruis, verborgen kolommen, inconsistente structuur. Markdown is gewone tekst — schoon, compact en direct leesbaar.

| PDF | Markdown |
|---|---|
| AI moet de opmaak ontwarren | AI leest directe tekst |
| Meer tokens, dus duurder | Minder tokens |
| Kolommen vervormen | Structuur blijft intact |
| Vaker fouten | Preciezere antwoorden |

Omzetten kan op drie manieren: kopiëren en plakken in een tekstbestand, een online converter, of AI zelf vragen *"zet dit om naar schone markdown zonder opmaak"*. Begin met kopiëren en plakken; dat werkt altijd.

## Verder in de cursus

Tot hier kun je het zelf. De cursus bij het sjabloon gaat verder:

- **De kennisbank-basis activeren** — mappenstructuur, een uitgewerkt voorbeelddossier en het promptsjabloon waarmee je nieuwe wiki-artikelen maakt. In de cursus richt je je eerste eigen dossier in met drie documenten.
- **De volledige cyclus ervaren** — van vraag tot antwoord met bronverwijzing, op jouw eigen stukken.
- **Wiki-artikelen die kloppen** — hoe je AI laat schrijven met bronvermelding per alinea, en hoe je een artikel bijwerkt als er een nieuw raadsstuk komt.
- **Vertrouwelijkheid** — wat wel en niet in de kennisbank hoort, en hoe je gevoelig materiaal apart houdt zonder het systeem te breken.
- **Doorgroeien** — van een map op je laptop naar een kennisbank die je hele fractie of afdeling gebruikt, en hoe [Begrotingsblik](/projects/begrotingsblik/) en [Jarvis](/projects/jarvis/) op dit principe zijn gebouwd.

{% include training-cta.html sjabloon="Kennisbank-basis" %}

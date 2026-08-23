---
title: "AI-werkwijze"
pagetitle: "Training 2 — AI-werkwijze"
permalink: /training/ai-werkwijze/
layout: single
toc: true
toc_label: "Op deze pagina"
toc_sticky: true
description: "De basis van training 2 uit Van Drukte naar Regie: hoe een taalmodel werkt, wat veilig is in de overheidscontext, de vier bouwstenen van een prompt en de masterprompt."
header:
  overlay_image: /assets/images/jarvis.webp
  overlay_filter: 0.6
  caption: "Verantwoord, vaardig en met een eigen aanpak"
---

> **De kern in één zin:** AI verandert niet wat je besluit — het verandert wat je kunt doen in een uur.

Dit is de basis van de tweede training. Genoeg om morgen verantwoord aan de slag te gaan; [de verdieping zit in de training](#verder-in-de-training).

## Wat AI is, zonder jargon

Een taalmodel heeft enorm veel tekst gelezen en voorspelt op basis van patronen wat een goed antwoord is. Het *genereert*; het citeert niet, het denkt niet en het weet niet wat er gisteren in jouw gemeente is besloten.

| Begrip | Wat het betekent |
|---|---|
| **LLM** | Systeem dat tekst genereert op basis van patronen — geen database |
| **Hallucinatie** | AI beweert iets dat niet klopt, maar klinkt overtuigend |
| **Context** | Alles wat jij in het gesprek aanlevert; meer context is beter resultaat |
| **Prompt** | De instructie die jij geeft — dit is jouw stuurmiddel |

AI kan wél: samenvatten, herschrijven, structureren, vergelijken, vertalen, schrijven op basis van jouw input. AI kan niet: feiten garanderen, jouw dossierkennis kennen zonder dat jij die aanlevert, politieke afwegingen maken.

> Vuistregel: gebruik AI voor het schrijven, niet voor het weten.

## Veiligheid in de overheidscontext

Niet alles mag in een publieke AI-tool. Gebruik dit als persoonlijk kader:

| Categorie | Mag in AI? | Voorbeelden |
|---|---|---|
| **Openbare informatie** | Ja | Gepubliceerde raadsstukken, wetgeving, eigen notities zonder persoonsgegevens |
| **Gevoelig, niet vertrouwelijk** | Met aanpassing | Interne analyses zonder namen, geanonimiseerde casuïstiek |
| **Vertrouwelijk of persoonsgebonden** | Nee | BSN, medische gegevens, stukken onder embargo |

> Zou je dit op het gemeenteplein hardop kunnen zeggen zonder dat het schade doet? Dan mag het erin.

Zakelijke tools (Copilot via Microsoft 365, Claude for Work, ChatGPT Enterprise) gebruiken je data niet om het model te trainen. Bij gratis consumentenversies: controleer de instellingen en het beleid van je organisatie.

## Prompting: de vier bouwstenen

Een goede prompt is een heldere instructie. Gebruik altijd deze vier onderdelen:

| Bouwsteen | Vraag | Voorbeeld |
|---|---|---|
| **Rol** | Wie is AI in dit gesprek? | "Jij bent een ervaren beleidsadviseur van een gemeente met 60.000 inwoners." |
| **Taak** | Wat moet AI precies doen? | "Schrijf een samenvatting van deze raadsbrief voor inwoners." |
| **Context** | Wat is de situatie? | "Het betreft het bestemmingsplan Centrum, besloten op 5 juni 2026." |
| **Formaat** | Hoe moet het eruitzien? | "Maximaal 150 woorden, geen jargon, één concrete volgende stap." |

Klopt het resultaat niet, zeg dat dan in hetzelfde gesprek: *"te lang, maak het de helft"*, *"de toon is te formeel"*, *"je mist het punt over de financiering"*. Elke iteratie is beter dan de eerste poging.

## Complexe vragen opknippen

Complexe vragen leveren matige resultaten op als je ze in één keer stelt. Splits ze op in deelvragen, los elk deel afzonderlijk op en combineer daarna.

*In één keer (matig):* "Schrijf een advies over gemeentelijke laadpalen."

*Opgeknipt (sterk):*
1. Wat zijn de vijf sterkste argumenten vóór gemeentelijke laadpalen?
2. Wat zijn de vijf sterkste argumenten tegen, of risico's?
3. Welke financieringsmodellen bestaan er voor gemeenten?
4. Schrijf nu een advies van 300 woorden op basis van bovenstaande punten.

Elk denkmodel dat je al kent — SWOT, voor/tegen/risico, stakeholderperspectief — werkt als frame: geef het mee en AI volgt het.

## Verder in de training

Tot hier kun je het zelf. In de training gaan we verder:

- **Je masterprompt schrijven** — een persoonlijk protocol dat AI vertelt wie je bent, wat je doet, hoe je schrijft en wat er nooit in mag. Je vult hem in tijdens de sessie en gebruikt hem de volgende dag in elke tool.
- **Atom of Thoughts op jouw dossier** — we pakken een echte casus uit jouw werk en knippen die samen op, zodat je het patroon in de vingers krijgt.
- **Strategische frameworks als gereedschap** — SWOT, Piramide-principe en SCQA voor raadsvoorstellen, moties en adviezen.
- **De veiligheidsafweging per tool** — wat Copilot, Claude, Gemini en ChatGPT wel en niet doen met je data, en hoe je dat uitlegt aan je organisatie.
- **Fouten herkennen** — hoe hallucinaties eruitzien in bestuurlijke teksten en hoe je ze systematisch opspoort.

{% include training-cta.html sjabloon="Masterprompt-sjabloon" %}

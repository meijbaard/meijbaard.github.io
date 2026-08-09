---
name: linkedin-naar-blog
description: Zet een LinkedIn-artikel (Pulse) om naar een blogpost op markeijbaard.nl en schrijft er een korte LinkedIn-teaserpost bij om het artikel onder de aandacht te brengen. Gebruik dit wanneer Mark een LinkedIn-artikel als PDF, tekst of bestand aanlevert en het op de site wil hebben, of vraagt om "dit artikel op mijn site", "linkedin naar blog", "artikel omzetten naar blogpost".
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

# LinkedIn-artikel → blogpost

Zet een LinkedIn Pulse-artikel om naar een post in `_posts/` van deze repo, en lever een korte LinkedIn-post op waarmee Mark het artikel op de site onder de aandacht brengt.

## Waarom dit een skill is en geen automatisering

LinkedIn biedt geen RSS-feed en geen API voor Pulse-artikelen, en blokkeert niet-ingelogde bezoekers met een 404. Ophalen kan dus niet automatisch. De aanlevering is handmatig, de rest niet.

---

## 1. Input ophalen

Mark levert het artikel op één van deze manieren aan:

- **PDF** — vanuit de LinkedIn-leesweergave geprint (Cmd-P). Dit is de gebruikelijke route. Lees hem met `Read` en het `pages`-argument.
- **Geplakte tekst** in de chat.
- **Bestand** (`.md`, `.txt`, `.docx`) ergens in de repo of op het bureaublad.

Krijg je alleen een LinkedIn-URL? Zeg dan dat die niet op te halen is en vraag om de PDF.

## 2. Opschonen

Weg uit de tekst:

- de regels `Artikel bewerken`, `linkedin.com`, `X-Y minuten`;
- paginakoppen en -voeten uit de PDF (`1 van 4`, de datum/tijd rechtsonder, de `about:reader?url=…`-regel);
- de hashtagregel onderaan — die wordt `tags` in de front matter;
- LinkedIn-profiellinks bij namen van personen. **De namen zelf blijven staan**, als platte tekst.

Herstel woordafbrekingen die door de PDF-kolombreedte zijn ontstaan (`kant-en-\nklare` → `kant-en-klare`) en voeg regels binnen één alinea weer samen.

## 3. Ontbrekende gegevens

Stel maximaal twee vragen, en alleen wat je niet kunt afleiden:

- **Publicatiedatum** — staat niet in de PDF. Leid hem af uit de inhoud als dat kan (genoemde data, "afgelopen weken"), en leg je aanname voor. De datum moet ná de vorige post liggen, anders klopt de volgorde op de homepage niet.
- **Afbeelding** — welke foto als header. Kijk eerst of er een voor de hand liggende bron is in `assets/images/` of op het bureaublad.

## 4. Beeld klaarzetten

```bash
python3 scripts/optimize-images.py --header <bronfoto> <naam>
```

Dit schrijft `assets/images/<naam>.webp` (1500x500) en `assets/images/teaser_<naam>.webp` (640x480) — de maten die de rest van de site gebruikt. Controleer de uitsnede door de header met `Read` te bekijken: bij een 3:1 center-crop kan het onderwerp uit beeld vallen.

Staat de foto al in `assets/images/` maar is hij groter dan ~1500px of zwaarder dan ~300 KB, draai het script dan alsnog.

## 5. De post schrijven

Bestandsnaam: `_posts/JJJJ-MM-DD-slug.md`. De slug is de titel, kleine letters, koppeltekens, zonder leestekens en zonder reeksprefix ("Met een Woudenbergse Blik: Samen kom je verder!" → `samen-kom-je-verder`).

Front matter exact volgens de conventie in deze repo:

```yaml
---
title: "De titel zoals op LinkedIn"
date: 2026-07-27 10:00:00 +0200
categories:
  - blog
tags:
  - woudenbergse blik
  - <onderwerp>
header:
  image: /assets/images/<naam>.webp
  teaser: /assets/images/teaser_<naam>.webp
---
```

Zet `layout`, `author_profile`, `read_time`, `comments`, `share` of `related` **niet** in de front matter — die komen uit `defaults` in `_config.yml`.

Body: de LinkedIn-tussenkopjes worden `##`. Staat er geen kopje boven de eerste alinea's, laat die dan als intro vóór het eerste `##` staan. Cursief van LinkedIn wordt `*cursief*`.

### Harde regel

**De tekst wordt nooit herschreven, ingekort, aangevuld of "verbeterd".** Alleen structurele bewerking. Mark heeft het artikel al geredigeerd; jouw taak is overzetten, niet redigeren. Zie je een echte fout (verkeerd jaartal, verkeerd bedrag), meld het en laat hem beslissen — corrigeer niet zelf.

## 6. De teaserpost

Lever daarna een korte LinkedIn-post op (max 150 woorden) waarmee Mark het artikel op de site onder de aandacht brengt. Deze post is wél nieuw geschreven, dus de stijl telt.

Volg hiervoor **sectie 4 (Schrijfstijl) en de kwaliteitsloop uit sectie 7 van de `linkedin`-skill**: nuchter in plaats van opgeblazen, concreet boven abstract, mensen bij hun voornaam, korte losse zinnen, en een slotzin die kort is en blijft hangen. Geen superlatieven, geen opgeklopte emotie.

De post bevat:

- een concrete openingsregel uit het artikel zelf (een waarneming, een getal, een naam) — geen "In mijn nieuwe blog schrijf ik over…";
- de link `https://markeijbaard.nl/blog/<slug>/`;
- 3-4 hashtags, standaard `#Woudenberg #WoudenbergseBlik` plus 1-2 die bij het onderwerp passen.

Presenteer de post als codeblok, zodat hij in één keer te kopiëren is.

## 7. Publiceren

Vraag om akkoord, en committeer en push daarna naar `main`. Dat triggert `build-jekyll.yml`; de post staat binnen enkele minuten live op `https://markeijbaard.nl/blog/<slug>/`.

Push nooit ongevraagd.

---

## Later: n8n voor de andere richting

Mark draait een eigen n8n. Van LinkedIn *naar* de site automatiseren kan niet betrouwbaar — dat vergt een betaalde scraper-dienst en levert een afgeknotte tekst. Andersom kan wél, volledig:

**RSS Feed Trigger** op `https://markeijbaard.nl/feed.xml` (jekyll-feed staat al aan in `_config.yml`) → **LinkedIn-node** → post met titel, samenvatting en link.

Publiceren op de site zet de LinkedIn-post er dan automatisch bij, en stap 6 van deze skill wordt overbodig. Vraagt Mark hierom, bouw dan die flow in plaats van de teaserpost handmatig te leveren.

---
# === FRONT MATTER ===
title: "Jarvis | Mijn persoonlijke commandoscherm | Mark Eijbaard"
pagetitle: "Jarvis"
excerpt: "Een persoonlijk commandoscherm dat elke ochtend laat zien wat er speelt: acties over datum, politiek gevoelige punten, de routines die draaien — en een assistent die vragen over mijn kennisbank beantwoordt."
date: 2026-08-22
author_profile: true
layout: single
header:
  overlay_image: /assets/images/jarvis.webp
  overlay_filter: 0.35
  caption: "Het commandoscherm van Jarvis (weergave met fictieve gegevens)"
tags:
  - Jarvis
  - AI-werksysteem
  - Homeserver
  - Kennisbank
---

## Het idee

Het werk van een wethouder bestaat uit veel losse draadjes: acties in de takenlijst, dossiers in de kennisbank, overleggen in de agenda, en op de achtergrond een rij automatische routines die nieuws verzamelen, de ochtendbrief klaarzetten en back-ups maken. Al die informatie bestaat, maar staat in vijf verschillende systemen.

Jarvis is het scherm waarop dat samenkomt. Eén pagina, elke ochtend ververst, met het antwoord op drie vragen: *wat loopt achter, wat is politiek gevoelig, en draait alles nog?*

![Het commandoscherm van Jarvis, met fictieve gegevens](/assets/images/dashboard_jarvis.webp)

*De weergave hierboven toont fictieve gegevens; het echte scherm is alleen voor mijzelf toegankelijk.*

## Wat er op het scherm staat

- **Kerncijfers** — open acties, acties over datum, wat deze week afloopt en het aantal politiek gevoelige punten.
- **Werkverdeling per portefeuille** — hoeveel werk er per beleidsterrein ligt, met de gevoelige punten apart gemarkeerd.
- **Systeemstatus** — de routines van mijn AI-werksysteem (ochtendbrief, nieuwsarchief, back-ups, inbox-verwerking) met een stoplicht per routine.
- **Lijsten** — wat over datum is, wat gevoelig is en wat deze week afloopt, met een sleutel naar het bijbehorende dossier in de kennisbank.
- **Snelkoppelingen** — de tegels naar de systemen waar ik dagelijks in werk.

Bovenin zit een commandobalk. Vragen als "wat staat er over datum?" worden rechtstreeks uit de data beantwoord. Vragen die de kennisbank nodig hebben ("wat weten we over dossier X?") gaan naar een kleine assistent die de wiki-artikelen van mijn Obsidian-vault leest en een antwoord formuleert.

## Hoe het in elkaar zit

Jarvis draait op mijn eigen homeserver, naast de rest van mijn [AI-werksysteem](/over/). Een script haalt een paar keer per dag de acties uit Notion, de gevoelige punten uit de kennisbank en de routinestatus uit de monitoring, en schrijft dat naar één databestand. Het scherm zelf is één zelfstandig HTML-bestand zonder bouwstap of framework — een dashboard dat je niet kunt openen door erop te dubbelklikken, is een dashboard dat je op een storingsavond niet kunt lezen.

Een paar ontwerpkeuzes waar ik achter sta:

- **Grijs is geen rood.** Als de monitoring niet bereikbaar is, worden de routines grijs — "ik kan het niet zien" — en niet rood — "de routine is gevallen". Wie die twee door elkaar haalt, zoekt op een dinsdagochtend een storing die alleen bestaat uit een VPN die uitstond.
- **Geen wachtwoord.** Inloggen gaat uitsluitend met passkeys op hardwaresleutels. Een wachtwoord is het enige onderdeel dat vanaf de andere kant van de wereld te raden valt, dus dat zit er niet in.
- **De assistent mag lezen, niet handelen.** Hij leest de data en de kennisbank, allebei alleen-lezen. Hij schrijft niets, voert geen commando's uit en heeft geen shell. Een dienst die documenten van buiten leest én mag handelen, doet op enig moment wat er in zo'n document staat in plaats van wat jij vraagt.

## Gebouwd met AI

Net als [Begrotingsblik](/projects/begrotingsblik/) is Jarvis gebouwd met Claude Code. Het verschil: Begrotingsblik is een product voor anderen, Jarvis is gereedschap voor mijzelf. Het is de plek waar ik uitprobeer hoe een werksysteem eruitziet waarin AI niet alleen tekst schrijft, maar ook de stand van zaken bewaakt — zonder dat ik de controle uit handen geef.

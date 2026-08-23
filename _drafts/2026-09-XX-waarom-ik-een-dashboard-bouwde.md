---
title: "Waarom ik als wethouder een dashboard bouwde"
excerpt: "Ik wilde één vraag beantwoord krijgen: hoe staan we ervoor? Het antwoord stond verspreid over honderden pagina's. Dus bouwde ik het zelf — met AI als programmeur."
date: 2026-09-XX 10:00:00 +0200
categories:
  - blog
tags:
  - werken met ai
  - begrotingsblik
  - financiën
  - woudenberg
header:
  image: /assets/images/begrotingsblik.webp
  teaser: /assets/images/teaser_begrotingsblik.webp
---

Er is één vraag die elke wethouder zichzelf bij het ontbijt stelt en die bijna nooit in één zin te beantwoorden is: *hoe staan we ervoor?* Niet in de zin van "gaat het goed met het dorp", maar concreet: wat staat er financieel op het spel, waar loopt de realisatie uit de pas met het budget, en hoe doen de buurgemeenten het met dezelfde opgave?

Het antwoord bestaat. Het staat alleen verspreid over de begroting, de jaarstukken, de SiSa-bijlage, de circulaires van het gemeentefonds en een handvol raadsinformatiebrieven. Bij elkaar honderden pagina's, geschreven in een ritme dat zich slecht verhoudt tot de vragen van alledag. Wie in de raadsvergadering gevraagd wordt naar de stand van de reserves, heeft weinig aan een document van mei.

Ik heb daar in Baarn vier jaar mee geleefd en in Woudenberg, mijn nieuwe gemeente, liep ik er meteen weer tegenaan. Dus ben ik het anders gaan doen.

## Wat er nu staat

Begrotingsblik begon als een dashboard voor mijzelf. Eén pagina met de vier kerncijfers, een signaal voor het ravijnjaar en stoplichten per beleidsterrein. Daarna kwam de rest, omdat de volgende vraag zich altijd aandient zodra de eerste beantwoord is: mijn portefeuille met budget en realisatie per thema, het meerjarenperspectief, de specifieke uitkeringen, wie er in welke gemeenschappelijke regeling zit en hoe de collega's in de regio tegen een besluit aankijken.

Alle bedragen komen rechtstreeks uit de openbare stukken: het BBV-overzicht van baten en lasten, de taakvelden, de kengetallen. Elke pagina vermeldt zijn bron, zodat elk getal terug te voeren is op het raadsstuk waar het uit komt. Dat is geen detail. Een dashboard dat je niet kunt controleren, is een mening met een grafiek erbij.

Inmiddels hebben tien gemeenten in de regio een eigen, afgeschermde omgeving. Wat voor mij begon als gereedschap, bleek voor raadsleden en collega-bestuurders dezelfde vraag te beantwoorden.

## Gebouwd zonder softwarehuis

Het eerlijke verhaal: ik heb geen regel code zelf geschreven. De applicatie is volledig gebouwd met Claude Code, een AI-programmeergereedschap. Ik beschrijf wat er moet gebeuren, beoordeel wat terugkomt en bepaal de koers. De AI schrijft de code.

Dat klinkt makkelijker dan het is. De eerste versie van de benchmark telde de reserves van alle gemeenten bij elkaar op alsof het één gemeente was. De eerste versie van de participatiepagina liet een rijksbijdrage op nul staan omdat het beleidsstuk die wel noemde maar niet becijferde. Beide fouten zag de AI niet; ik wel, omdat ik wist wat er ongeveer uit hoorde te komen. Dat is de kern van wat ik geleerd heb: **AI maakt het bouwen goedkoop, maar het beoordelen niet.** Wie niet weet hoe een gemeentebegroting in elkaar zit, krijgt een overtuigend dashboard met verkeerde cijfers.

Drie keuzes hebben het overeind gehouden. De data staat los van de code, zodat een begrotingswijziging verwerken een databestand aanpassen is en geen programmeerwerk. Er is één platte lijst met personen, zodat "wie zit er in de AVU" en "het college van Leusden" dezelfde zoekopdracht zijn met een ander filter. En de kern werkt zonder database of inlog; die zijn een laag eromheen. Als die laag ooit uitvalt, staat het dashboard er nog.

## Waarom ik dit opschrijf

Niet omdat elke wethouder een dashboard moet bouwen. Wel omdat ik vaak de vraag krijg wat je met de AI-gereedschappen van nu eigenlijk zelf kunt, zonder ontwikkelteam en zonder aanbesteding. Het antwoord is: meer dan ik een jaar geleden had gedacht — op voorwaarde dat je precies weet wat je wilt en scherp blijft op wat er terugkomt.

Transparantie over gemeentefinanciën was voor mij altijd een principe. Nu is het ook een product, en dat voelt soms ongemakkelijk voor een bestuurder. Maar de cijfers waren al openbaar. Ik heb ze alleen op één plek gezet waar je ze kunt lezen.

*Begrotingsblik staat op [begrotingsblik.nl](https://begrotingsblik.nl). Meer over hoe het in elkaar zit lees je op de [projectpagina](/projects/begrotingsblik/).*

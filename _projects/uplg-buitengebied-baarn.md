---
# === FRONT MATTER ===
# Titel voor Google en browser-tab
title: "Project UPLG | De Toekomst van het Buitengebied van Baarn"
# Nette, korte titel die op de pagina zelf wordt getoond
pagetitle: "De Toekomst van ons Buitengebied"
# Korte samenvatting voor de projectenlijst en Google
excerpt: "Een diepgaande blik op het Utrechts Programma Landelijk Gebied (UPLG) en wat dit betekent voor de natuur, het water en de landbouw in Baarn."
# Datum van aanmaak
date: 2025-08-21
# Toon je profiel in de sidebar
author_profile: true
# Gebruikte layout
layout: single
# mermaid
mermaid: true
# Instellingen voor de grote afbeelding bovenaan
header:
  overlay_image: /assets/images/landelijkgebied-header.png
  caption: "Het buitengebied van Baarn"
# Tags voor het vinden van gerelateerde posts
tags:
  - UPLG
  - Buitengebied
  - Beleid
  - Baarn
  - Provincie Utrecht
---

## Samenvatting: Een Toekomst voor het Baarnse Buitengebied

Het landschap rond Baarn staat onder druk. Opgaven als klimaatverandering, natuurherstel en de toekomst van de landbouw vragen om moeilijke keuzes. Het **Utrechts Programma Landelijk Gebied (UPLG)** is het antwoord van de provincie Utrecht op deze uitdagingen. Het is een omvangrijk plan dat de lijnen uitzet voor de toekomst van onze leefomgeving.

Als wethouder van Baarn volg ik dit proces op de voet. Want wat betekenen deze provinciale plannen concreet voor onze boeren in Eemland en de natuur op de Utrechtse Heuvelrug? Op deze pagina geef ik een overzicht van dit complexe project, vertaal ik de beleidstaal naar de Baarnse praktijk en licht ik de rol en de inbreng van onze gemeente toe.

---

## De Uitdaging: Een Druk Buitengebied

Ons buitengebied is meer dan alleen een mooi landschap; het is een complex systeem dat onder druk staat. We worden geconfronteerd met:
* **Afname van natuurwaarden** en biodiversiteit.
* **Klimaatverandering**, wat leidt tot wateroverlast en langdurige droogte.
* **Conflicterende belangen** tussen natuur, recreatie, landbouw en energieopwekking.

De nationale en provinciale overheden hebben de taak om hierop te sturen. Het Rijk heeft hiervoor diverse programma's, zoals het Nationaal Programma Landelijk Gebied (NPLG). Het UPLG is de Utrechtse uitwerking hiervan.

---

## Visuele Context: De Bestuurlijke Puzzel

Om te begrijpen hoe het UPLG zich verhoudt tot andere programma's en overlegstructuren, heb ik onderstaand overzicht gemaakt. Dit diagram toont de complexe samenhang tussen nationaal, regionaal en lokaal beleid. Het laat zien waar de besluiten worden genomen en welke overleggen input leveren.

flowchart TB

    %% grafiek nationale programma's
    subgraph NPG["🏛️ Nationale Programma's"]
        direction TB
        subgraph WTR["💧 Water & Bodem"]
            direction TB
            BWS[["<b>Bodem en Water Sturend</b><br><br><i>Kamerbrief</i><br>&nbsp;"]]
            KRW[["<b>KRW</b><br><br><i>Kaderrichtlijn<br>Water</i><br>&nbsp;"]]
        end
        
        subgraph LBA1["🌱 Landbouw"]
            direction LR
                TLB[["<b>Toekomstvisie Landbouw</b><br><br><i>Kamerbrief</i><br>&nbsp;"]]
        end

        subgraph NPLG1["🏞️ Landelijk Gebied"]
            direction TB
                UPLG[("<b>UPLG</b><br><br><i>Utrechts<br>Programma<br>Landelijk Gebied</i>")] --"|Onderdeel van|"--> NPLG[["<b>NPLG</b><br><br><i>Nationaal Programma<br>Landelijk Gebied</i><br><br><i><u>Wordt vervangen door een gebiedsgerichte aanpak</u></i>"]]
        end

        BOL[["<b>BOL</b><br><br><i>Bestuurlijk overleg<br>Leefomgeving</i>"]] --"|Bestuurlijke Besluitvorming Rijk|"--> NOVEX[("<b>NOVEX</b><br><br>Utrecht<br>-<br>Amersfoort")]
        MIRT[["<b>BO MIRT</b><br><br><i>Meerjaren Infrastructuur<br>Ruimte & Transport</i>"]] --"|Bestuurlijke Besluitvorming Rijk|"--> NOVEX
        NPLG --"|Onderdeel van|"--> LP[["<pre><b>Nationale Programma's</b><pre>"]]
        
        LBA1 --"|Leidend voor|"--> NPLG1
        WTR --"|Leidend voor|"--> NPLG
        WTR  --"|Leidend voor|" --> UPLG
        RES[("<b>RES</b><br><br><i>Regionale<br>Energie<br>Strategie</i>")] --"|Onderdeel van|"--> LP
        NOVEX --"|Onderdeel van|"--> LP
    
    end
    
    %%grafiek Regionale Samenhang
    subgraph ROV["🤝 Samenhang Bestuurlijke Overlegstructuur Regio Amersfoort"]
        direction RL

        %%Uitwerking grafiek vervoersoverleggen --> Toevoegen UVVB
        subgraph Vervoer["🚗 Vervoersoverleggen"]
            direction TB
                BOVV(["<b>BOVV</b><br><br><i>Bestuurlijk Overleg<br>Verkeer & Vervoer</i>"])
                UNED[("<b>Programmaraad UNED</b><br><br><i>Tyas Bijholt<br>Rob Metz</i>")]
                MIRT1[["<b>BO MIRT</b><br><br><i>Meerjaren Infrastructuur<br>Ruimte & Transport</i>"]]
            
                BOVV --"|Inputgevend|"--> UNED --"|Besluitvormend|"--> MIRT1               
        end

        %% Ontwikkelbeeld ---> BOLG/BOR hier nu aan toegevoegd
        subgraph Ontwikkelbeeld["🏙️ Amersfoort 2040"]
            direction TB
            AMF2040((("Ontwikkelbeeld<br>Amersfoort<br>2040"))) --"|Input voor ontwikkelingen|"--> BOLG1(["<b>BOLG</b><br><br><i>Bestuurlijk Overleg<br>Landelijk Gebied</i>"])
            AMF2040 --"|Input voor ontwikkelingen|"--> BOR(["<b>BOR</b><br><br><i>Bestuurlijk Overleg<br>Ruimte</i>"])
        end
    
        %% Regionale ruimtelijke programma's ---> Deze nog checken op juistheid
        subgraph RO["🗺️ Regionale Ruimtelijke Opgaven"]
            direction TB
            
            %% Deze ruimtelijke ontwikkelingen moeten nog beoordeeld worden
            NOVEX1[("<b>NOVEX</b><br><br>Utrecht<br>-<br>Amersfoort")] --"|Uitwerking van|"-->  Spoor(["<b>Gebiedsonderzoek</b><br><br><i>Spoorzone Amersfoort - Utrecht<br>Heuvelrugzone</i>"])
            NOVEX1 --"|Uitwerking van|"--> A-Z(["Van Amersfoort tot Zeist (A-Z)"])
            NOVEX1 --"|Uitwerking van|"--> Defensie(["Defensie"])
        end
        
        %% Verbinden van diverse regionale opgaven
        RO <--"|Ruimtelijke Opgaven|"--> Ontwikkelbeeld <--"|Mobiliteits Opgaven|"--> Vervoer
        Ontwikkelbeeld --"|Richtinggevend kader|"--> RO
        
    end

    %% Ontwikkelingen landelijkgebied
    subgraph LB["🌳 Ontwikkelingen Landelijk Gebied"]
        direction LR
        
        %% Uitwerking proces UPLG
        subgraph UPLG1["Provincie"]
            direction TB
            subgraph UPLG2[" "]
                direction TB
                    UPLG3[("<b>UPLG</b><br><br><i>Utrechts<br>Programma<br>Landelijk Gebied</i>")]   --"|Knelpuntenoverleg|"--> RSG(["<b>RSG Oost</b><br><br><i>Regionale<br>Stuurgroep<br>Oost</i>"])                    
            end
            
            %% Uitwerking GGA met relevantie voor Baarn
            subgraph GGA1["Deelgebieden"]
                direction BT
                EV(["Eemvallei"]) --"|Relevant voor Baarn|"--> GGA["<b>GGA</b><br><br><i>Gebiedsgerichte<br>Aanpak<br>Utrecht</i>"] 
                UH(["Utrechtse<br>Heuvelrug"]) --"|Relevant voor Baarn|"--> GGA
                GV(["Gelderse<br>Vallei"]) --"|Niet relevant voor Baarn|"--x GGA
            end
            UPLG2 --"|Uitwerkingsoverleg deelgebieden|"--> GGA1
        end

        %% Uitwerking proces handelingsperspectief
        subgraph HPB1["Regio"]
            direction TB
            BOLG(["<b>BOLG</b><br><br><i>Bestuurlijk Overleg<br>Landelijk Gebied</i>"]) <--"|Bestuurlijke Besluitvorming Regio|"--> HPB(("Handelingsperspectief<br>Buitengebied"))
        end

        %% Uitwerking proces GGM met relevante projecten
        subgraph GGM1["Gemeente"]
            direction TB
            GGM[("Groen Groeit Mee")] --"|Project Uitwerking|"--> ZEV(["Zuidelijke<br>Eemvallei"])
        end

        %% Verbinden van opgaven in het landelijk gebied
        UPLG1 <--"|Inputgevend|"--> HPB1
        HPB1 --"|Uitwerking van|"--> GGM1
        UPLG2 --"|Maatregelpakket 6M|"--> ZEV
    end

    %% Verhouding van processen tot elkaar
    NPG ----> ROV ----> LB

    %%Stijlen

    %% Classes voor subgraphs ffffde
    classDef subgraph1 fill:#f6f6f7,font-weight:bold,font-size:18pt,stroke:#231b1b,line-height:24pt,stroke-width:4px
    classDef subgraph2 fill:#f6f6f7,font-weight:bold,font-size:12pt,stroke:#231b1b,line-height:24pt,stroke-width:2px
    classDef subgraph3 fill:#f6f6f7,font-weight:bold,font-size:12pt,stroke:#231b1b,line-height:24pt,stroke-width:0px
    
    %% Toekennen classes aan subgraphs
    class NPG,ROV,LB subgraph1;
    class Vervoer,Ontwikkelbeeld,UPLG1,HPB1,GGM1,RO,NPLG1,WTR,LBA1 subgraph2;
    class GGA1,UPLG2 subgraph3;
    
    %% Classes voor blokken
    classDef classNP fill:#efb618,color:#231b1b,font-size:24pt,margin-bottom:10px,stroke-width:2px,stroke:#231b1b,line-height:18px
    classDef classRijk fill:#01689b,color:#fff,stroke-width:2px,stroke:#fff,line-height:18px
    classDef classProv fill:#dd2a21,color:#fff,stroke-width:2px,stroke:#231b1b,line-height:18px
    classDef classRegio fill:#85b227,color:#fff,stroke-width:2px,stroke:#007937,line-height:18px
    classDef classMRU fill:#007878,color:#fff,stroke-width:2px,stroke:#231b1b,line-height:18px
    classDef classRel fill:#04aa6d,color:#fff,stroke-width:2px,stroke:#231b1b,line-height:18px
    classDef classNoRel fill:#fe3570,color:#fff,stroke-width:2px,stroke:#231b1b,line-height:18px
    
    %% Toekennen classes aan blokken
    
    class LP classNP;
    class BOL,MIRT,MIRT1,NOVEX,NOVEX1,NPLG,KRW,TLB,BWS classRijk;
    class UPLG,UPLG3,RSG,GGA,GGM classProv;
    class RES,BOVV,BOR,BOLG,BOLG1,AMF2040,HPB classRegio;
    class UNED classMRU;
    class UH,EV,ZEV classRel;
    class Spoor,A-Z,Defensie,GV classNoRel;


    %% classes voor lijnen
    linkStyle default color:#231b1b,stroke:#231b1b,stroke-width:4px;
    %% Bestuurlijke besluitvorming [rood]
    linkStyle 1,2,10,24 background-color:#,color:red,stroke:#231b1b,stroke-width:4px;
    %% Regionale onderlinge verbinding [oranje]
    linkStyle 16,17,18,26,27 color:#e25829,stroke:#231b1b,stroke-width:4px;
    %% Relevant voor Baarn [groen]
    linkStyle 20,21 color:#04aa6d,stroke:#231b1b,stroke-width:4px;
    %% Verbinding tussen overzichtsblokken [rood]
    linkStyle 29,30 color:#231b1b,stroke:#dd2a21,stroke-width:6px;

    %% Links voor blokken
    click NPLG "[https://www.rijksoverheid.nl/onderwerpen/aanpak-stikstof-natuur-water-en-klimaat/gebiedsgerichte-en-samenhangende-aanpak-landelijk-gebied](https://www.rijksoverheid.nl/onderwerpen/aanpak-stikstof-natuur-water-en-klimaat/gebiedsgerichte-en-samenhangende-aanpak-landelijk-gebied)" "Nationaal Programma Landelijk Gebied" _blank
    click UPLG,UPLG3 href "[https://www.provincie-utrecht.nl/onderwerpen/toekomst-landelijk-gebied/utrechts-programma-landelijk-gebied](https://www.provincie-utrecht.nl/onderwerpen/toekomst-landelijk-gebied/utrechts-programma-landelijk-gebied)" "Utrechts Programma Landelijk Gebied" _blank
    click GGM "[https://www.provincie-utrecht.nl/onderwerpen/ruimtelijke-ontwikkeling/groen-groeit-mee](https://www.provincie-utrecht.nl/onderwerpen/ruimtelijke-ontwikkeling/groen-groeit-mee)" "Groen Groeit Mee

---

## De Rol van Baarn: Tussen Heuvelrug en Eemland

Het UPLG werkt met een gebiedsgerichte aanpak. Voor Baarn zijn twee van deze deelgebieden cruciaal: de **Utrechtse Heuvelrug** en **Eemland**. Elk gebied heeft zijn eigen unieke opgaven:

* **Eemland:** De focus ligt hier op het versterken van de weidevogelgebieden en de 'groenblauwe dooradering'. Tegelijkertijd zijn er grote uitdagingen rond het verhogen van de grondwaterstand in dit veenweidegebied om de uitstoot van broeikasgassen te verminderen.
* **Utrechtse Heuvelrug:** Hier is het herstel van de natuurkwaliteit de belangrijkste opgave, maar wordt dit bemoeilijkt door de hoge recreatiedruk en de noodzaak voor natuurbrandbeheersing.

Als gemeente hebben we de verantwoordelijkheid om deze provinciale doelen te vertalen naar ons lokale Omgevingsplan. Een belangrijke basis hiervoor is het **Handelingsperspectief Buitengebied**, dat we samen met de andere gemeenten in de Regio Amersfoort hebben opgesteld.

### Onze Inbreng: De Baarnse Zienswijze

Als college van Baarn onderschrijven we de noodzaak van de plannen, maar we zijn ook kritisch. In onze officiële reactie (de 'zienswijze') op de plannen van de provincie hebben we de volgende punten benadrukt:

1.  **Een Eerlijk Perspectief voor Boeren:** We staan in nauw contact met onze agrariërs en delen hun zorgen over de onduidelijkheid. We dringen er bij de provincie op aan om een concreet en rendabel toekomstperspectief te bieden voor de landbouw, waarbij de inzet en reeds behaalde resultaten van onze boeren worden meegewogen.
2.  **Samenhang in Beleid:** We maken ons zorgen dat verschillende provinciale regels, zoals de Omgevingsverordening, met elkaar kunnen conflicteren. Dit kan de ruimte voor maatwerk in ons gebied beperken. De regels moeten elkaar versterken, niet tegenwerken.
3.  **Duidelijkheid in Overleg:** We vragen de provincie om het aantal overlegtafels te verminderen. Dit is nodig om helderheid te scheppen over waar en wanneer belangrijke besluiten worden genomen, zowel voor ons als bestuur als voor de betrokkenen in het gebied.

---

## Volgende Stappen

Het proces is nog niet afgerond. Na deze consultatieronde zal de provincie in het najaar van 2025 een definitief ontwerp ter inzage leggen. Dan volgt een formele zienswijzeprocedure waar ook de gemeenteraad bij betrokken wordt. De uiteindelijke vaststelling van het UPLG wordt verwacht in het voorjaar van 2026.

Als wethouder blijf ik dit proces nauwlettend volgen. Mijn doel is om de brug te slaan tussen de abstracte beleidsdoelen van de provincie en de dagelijkse praktijk van de mensen die in ons prachtige buitengebied wonen en werken.

---

## Gerelateerde Inzichten

{% assign related_posts = "" | split: "" %}
{% for tag in page.tags %}
  {% for post in site.tags[tag] %}
    {% unless related_posts contains post %}
      {% assign related_posts = related_posts | push: post %}
    {% endunless %}
  {% endfor %}
{% endfor %}

{% if related_posts.size > 0 %}
  <ul>
  {% for post in related_posts limit:5 %}
    {% if post.url != page.url %}
      <li><a href="{{ post.url | relative_url }}" rel="permalink">{{ post.title }}</a></li>
    {% endif %}
  {% endfor %}
  </ul>
{% else %}
  <p>Er zijn op dit moment geen gerelateerde blogberichten.</p>
{% endif %}

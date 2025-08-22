# Overzicht van Aanpassingen aan het Minimal Mistakes Thema

Dit document beschrijft de aanpassingen die zijn gedaan aan de standaard-installatie van het Jekyll-thema "Minimal Mistakes". Het doel is om bij een toekomstige update van het thema snel inzicht te hebben in welke bestanden zijn aangepast en welke stappen nodig zijn om de aanpassingen opnieuw te integreren.

---

## 1. Aangepast Archief-sjabloon (`_includes/archive-single.html`)

Dit is de meest ingrijpende aanpassing. Dit bestand is aangepast om twee verschillende weergaven voor blog- en projectlijsten te ondersteunen.

* **Doel van de aanpassing:**
    * De **homepage** gebruikt de `grid`-weergave, die de afbeelding boven de titel en tekst toont. Dit is de standaard-functionaliteit die we wilden behouden.
    * De **/posts/ pagina** gebruikt de `list`-weergave. Deze is aangepast om een kleine afbeelding links te tonen, met rechts daarvan een tekstblok met de titel en samenvatting.

* **Conflict bij een update:**
    Dit is een kernbestand van het thema. Een thema-update zal dit bestand waarschijnlijk overschrijven met een nieuwe versie. Als je simpelweg de nieuwe versie overneemt, verlies je de custom layout op je `/posts/` pagina. Als je jouw aangepaste versie behoudt, mis je mogelijk belangrijke bugfixes of nieuwe features van het thema.

* **Stappen voor Re-integratie:**
    1.  **Maak een back-up** van je aangepaste `_includes/archive-single.html`.
    2.  Voer de thema-update uit en accepteer de nieuwe versie van het bestand.
    3.  Open zowel je back-up als de nieuwe versie in een code-editor met een "vergelijk"-functie (zoals VS Code).
    4.  Kopieer de `else`-tak (het blok onder `{% else %}`) van **jouw back-up** en plak deze in de nieuwe versie van het bestand. Zorg ervoor dat de `if type == "grid"` en `else` structuur behouden blijft.
    5.  Controleer of de nieuwe versie geen fundamentele wijzigingen bevat die conflicteren met jouw `else`-blok.

---

## 2. Aangepaste Stijlen (`assets/css/main.scss`)

Dit bestand is aangepast om de layout van de `/posts/` pagina correct op te maken.

* **Doel van de aanpassing:**
    * De layout forceren naar een "afbeelding links, tekst rechts"-model.
    * De breedte van de afbeelding beperken tot 200px.
    * De lettergrootte van de titels op de overzichtspagina verkleinen.

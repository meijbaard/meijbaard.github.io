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

* **Conflict bij een update:**
    De methode die we hebben gebruikt (`@import "minimal-mistakes";` gevolgd door eigen code) is de juiste manier en minimaliseert conflicten. Het risico is klein, maar een thema-update zou de HTML-structuur of de `class`-namen (`.archive__item--list`, `.archive__item-body`) kunnen wijzigen, waardoor de custom CSS niet meer werkt.

* **Stappen voor Re-integratie:**
    1.  Voer de thema-update uit.
    2.  Controleer de opmaak van de `/posts/` pagina.
    3.  Als de opmaak incorrect is, inspecteer de HTML-broncode van de pagina om te zien of de `class`-namen zijn veranderd.
    4.  Pas de selectors in het `/* --- BEGIN AANGEPASTE STIJLEN --- */` blok in `assets/css/main.scss` aan zodat ze overeenkomen met de nieuwe structuur.

---

## 3. Projecten Collectie (`_config.yml`)

Er is een `collections` blok toegevoegd om projectpagina's te scheiden van blogberichten.

* **Doel van de aanpassing:**
    Het creëren van een apart type content voor "Projecten", met een eigen map (`_projects`) en URL-structuur.

* **Conflict bij een update:**
    Zeer laag risico. Een thema-update zal je persoonlijke instellingen in `_config.yml` niet overschrijven. Het is wel aan te raden om de `_config.yml` van de nieuwe themaversie te vergelijken met die van jou om te zien of er nieuwe, belangrijke thema-instellingen zijn die je moet overnemen.

* **Stappen voor Re-integratie:**
    1.  Gebruik na een update een "vergelijk"-tool om jouw `_config.yml` naast de nieuwe standaard `_config.yml` te leggen.
    2.  Kopieer eventuele nieuwe, relevante instellingen van de standaard-configuratie naar die van jou, maar zorg ervoor dat je jouw eigen `collections` blok en andere persoonlijke instellingen (titel, url, etc.) behoudt.

---

## 4. Overige Aangepaste Bestanden (Minimaal risico)

De volgende bestanden zijn aangepast of toegevoegd, maar hebben een zeer laag risico op conflicten bij een update omdat ze specifiek zijn voor jouw content en structuur.

* **`_layouts/posts.html`**: Een eigen layout om berichten per jaar te groeperen. Zal niet worden overschreven. Controleer na een update of het nog correct werkt met de (mogelijk vernieuwde) `include`-bestanden van het thema.
* **`_pages/year-archive.md`**: De content-pagina die de `/posts/` URL genereert. Zal niet worden overschreven.
* **`_data/navigation.yml`**: Jouw persoonlijke menustructuur. Wordt nooit overschreven door een thema-update.

Door deze documentatie te bewaren, kun je met vertrouwen toekomstige updates van het Minimal Mistakes thema doorvoeren.

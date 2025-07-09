---
permalink: /spotconverter/
layout: spotconverter
title: SpotConverter
author_profile: false
---

<!-- De HTML-structuur voor de converter -->
<div class="container mx-auto p-4" type="center">
<div class="max-w-4xl mx-auto space-y-8">

        <!-- Header met Logo -->
        <header class="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center">
            <div class="flex justify-center items-center mb-4">
                <!-- Aangepast SVG-logo -->
                <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="var(--accent-color)">
                    <path d="M 20 80 C 10 80 10 70 20 70 L 80 70 C 90 70 90 80 80 80 Z" fill="#475569"/>
                    <rect x="25" y="30" width="50" height="40" rx="5" fill="var(--accent-color)"/>
                    <rect x="35" y="20" width="30" height="10" rx="3" fill="#64748b"/>
                    <circle cx="37" cy="70" r="10" fill="white" stroke="#475569" stroke-width="4"/>
                    <circle cx="63" cy="70" r="10" fill="white" stroke="#475569" stroke-width="4"/>
                    <rect x="60" y="40" width="10" height="15" fill="white" rx="2"/>
                </svg>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-slate-800">SpotConverter Pro</h1>
            <p class="mt-3 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                Analyseer WhatsApp-berichten van treinspotters. Plak een bericht en zie direct de volledige stationsnamen, jargon en een geschatte passage-tijd.
            </p>
        </header>

        <!-- Converter Tool -->
        <main class="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <div class="grid md:grid-cols-2 gap-8">
                <!-- Input -->
                <div>
                    <label for="whatsappMessage" class="block text-base font-semibold text-slate-700 mb-2">Plak je WhatsApp bericht hier:</label>
                    <textarea id="whatsappMessage" class="form-input w-full h-36 border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="Bijv. 14:00 Hgl ri Amf" oninput="debounceProcessMessage()"></textarea>
                </div>
                <!-- Instellingen -->
                <div>
                    <label for="targetStationSelect" class="block text-base font-semibold text-slate-700 mb-2">Bereken passage voor:</label>
                    <select id="targetStationSelect" class="form-input w-full border rounded-lg p-3 shadow-sm bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" onchange="processMessage()"></select>
                </div>
            </div>
            
            <!-- Output secties -->
            <div class="mt-8 space-y-6">
                <div>
                    <h2 class="text-xl font-bold text-slate-800 mb-2">Verwerkt Bericht:</h2>
                    <div id="output" class="p-4 bg-slate-50 rounded-lg min-h-[60px] border border-slate-200 leading-relaxed"></div>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-slate-800 mb-2">Analyse:</h2>
                    <div id="estimation-output" class="p-4 bg-cyan-50 border-l-4 border-cyan-400 rounded-r-lg min-h-[60px] space-y-2"></div>
                </div>
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h2 class="text-xl font-bold text-slate-800">Geparsede Data (voor analyse)</h2>
                        <button id="toggle-data-btn" onclick="toggleParsedData()" class="text-sm font-semibold text-slate-500 hover:text-slate-800 transition">(Toon)</button>
                    </div>
                    <pre id="parsed-data-output" class="p-4 bg-slate-800 text-white text-xs rounded-lg overflow-x-auto" style="display: none;"></pre>
                </div>
            </div>
        </main>
        
        <!-- Informatie sectie -->
        <footer class="bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <h2 class="text-2xl font-bold text-slate-800 mb-4">Terugkerende Treinpatronen</h2>
            <div class="space-y-6 text-slate-600">
                <div class="p-4 border border-slate-200 rounded-lg">
                    <h4 class="font-semibold text-lg text-slate-800">1. De "Katy Shuttle" (RFO)</h4>
                    <p class="mt-1">Deze shuttle verbindt Knooppunt Kijfhoek met Polen en is een frequente verschijning op de Bentheimroute.</p>
                </div>
                <div class="p-4 border border-slate-200 rounded-lg">
                    <h4 class="font-semibold text-lg text-slate-800">2. De "PCC Shuttle" (RTB Cargo)</h4>
                    <p class="mt-1">Deze shuttle verbindt de Rotterdamse haven met Polen en is een vaste gast op het spoor.</p>
                </div>
                <div class="p-4 border border-slate-200 rounded-lg">
                    <h4 class="font-semibold text-lg text-slate-800">3. De "Volvo Trein" (Lineas)</h4>
                    <p class="mt-1">Een vaste shuttle tussen Gent (België) en Zweden, die vaak via Deventer en Zutphen rijdt.</p>
                </div>
            </div>
        </footer>

    </div>
</div>

<!--
BELANGRIJK:
De volgende code geeft de correcte paden naar de CSV-bestanden door aan het JavaScript-bestand.
Jekyll zal de `relative_url` filter omzetten naar de juiste URL's.
-->
<script>
  const stationsCsvPath = "{{ '/stations.csv' | relative_url }}";
  const afstandenCsvPath = "{{ '/afstanden.csv' | relative_url }}";
</script>

<!-- Laad de JavaScript logica -->
<script src="{{ '/assets/js/sportconverter.js' | relative_url }}"></script>

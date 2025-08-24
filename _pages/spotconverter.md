---
author_profile: false
permalink: /spotconverter/
show_navigation: false
layout: dashboard
title: SpotConverter
classes:
  - py-8
  - md:py-12
---


  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SpotConverter Pro</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <div id="loader-overlay">
    <div class="spinner"></div>
    <p class="text-lg font-semibold text-slate-600">Data laden vanaf GitHub...</p>
  </div>
  <div class="max-w-5xl mx-auto px-4 space-y-8 md:space-y-10">
    <header class="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center">
      <div class="flex justify-center items-center mb-4">
        <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="var(--accent-color)">
          <path d="M 20 80 C 10 80 10 70 20 70 L 80 70 C 90 70 90 80 80 80 Z" fill="#475569" />
          <rect x="25" y="30" width="50" height="40" rx="5" fill="var(--accent-color)" />
          <rect x="35" y="20" width="30" height="10" rx="3" fill="#64748b" />
          <circle cx="37" cy="70" r="10" fill="white" stroke="#475569" stroke-width="4" />
          <circle cx="63" cy="70" r="10" fill="white" stroke="#475569" stroke-width="4" />
          <rect x="60" y="40" width="10" height="15" fill="white" rx="2" />
        </svg>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold text-slate-800">SpotConverter Pro</h1>
      <p class="mt-3 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
        Analyseer WhatsApp-berichten van treinspotters. Plak een bericht en zie direct de volledige
        stationsnamen, jargon en een geschatte passage-tijd.
      </p>
    </header>

    <!-- Tabs -->
    <div id="tab-container" class="flex justify-center -mb-px">
      <button class="tab-btn px-6 py-3 rounded-t-lg font-semibold text-slate-600 bg-white border border-b-0 border-slate-200 active" data-tab="spot">Spot Analyse</button>
      <button class="tab-btn px-6 py-3 rounded-t-lg font-semibold text-slate-600 bg-white border border-b-0 border-slate-200" data-tab="zoeker">Station Zoeker</button>
      <button class="tab-btn px-6 py-3 rounded-t-lg font-semibold text-slate-600 bg-white border border-b-0 border-slate-200" data-tab="heatmap">Heatmap</button>
      <button class="tab-btn px-6 py-3 rounded-t-lg font-semibold text-slate-600 bg-white border border-b-0 border-slate-200" data-tab="patronen">Patronen</button>
    </div>

    <!-- Tab Content: Spot Analyse -->
    <main class="bg-white p-6 md:p-8 rounded-xl rounded-tl-none shadow-lg" id="tab-spot">
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <label for="whatsappMessage" class="block text-base font-semibold text-slate-700 mb-2">Plak je WhatsApp bericht hier:</label>
          <textarea id="whatsappMessage" class="form-input w-full h-36 border rounded-lg p-3 shadow-sm" placeholder="Bijv. 14:00 Hgl ri Amf" oninput="debounceProcessMessage()"></textarea>
        </div>
        <div>
          <label for="targetStationSelect" class="block text-base font-semibold text-slate-700 mb-2">Bereken passage voor:</label>
          <select id="targetStationSelect" class="form-input w-full border rounded-lg p-3 shadow-sm bg-white" onchange="processMessage()"></select>
        </div>
      </div>
      <div class="mt-8 space-y-6">
        <div>
          <h2 class="text-xl font-bold text-slate-800 mb-2">Verwerkt Bericht:</h2>
          <div id="output" class="p-4 bg-slate-50 rounded-lg min-h-[60px] border border-slate-200 leading-relaxed"></div>
        </div>
        <div>
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-bold text-slate-800">Analyse:</h2>
            <button id="copy-analysis-btn" onclick="copyAnalysisToClipboard()" class="px-3 py-1 text-sm font-semibold text-cyan-700 bg-cyan-100 rounded-md hover:bg-cyan-200 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>Kopieer Analyse</button>
          </div>
          <div id="estimation-output" class="p-4 bg-cyan-50 border-l-4 border-cyan-400 rounded-r-lg min-h-[60px] space-y-2"></div>
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800 mb-2">Patroonherkenning:</h2>
          <div id="pattern-output" class="p-4 bg-white border border-sky-200 rounded-lg"></div>
        </div>
        <div>
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-bold text-slate-800">Geparsede Data (voor analyse)</h2>
            <button id="toggle-data-btn" onclick="toggleParsedData()" class="text-sm font-semibold text-slate-500 hover:text-slate-800 transition">(Toon)</button>
          </div>
          <pre id="parsed-data-output" class="p-4 bg-slate-800 text-white text-xs rounded-lg overflow-x-auto" style="display: none"></pre>
        </div>
      </div>
    </main>

    <!-- Tab Content: Station Zoeker -->
    <main class="bg-white p-6 md:p-8 rounded-xl rounded-tl-none shadow-lg hidden" id="tab-zoeker">
      <h2 class="text-2xl font-bold text-slate-800 mb-4">Zoek Station</h2>
      <div class="mb-6">
        <input type="text" id="stationSearchInput" class="form-input w-full max-w-lg mx-auto block border rounded-lg p-3 shadow-sm" placeholder="Zoek op afkorting of naam..." oninput="debounceSearch()">
      </div>
      <div id="noResultsMessage" class="hidden text-center py-10 text-slate-500">
        <p class="text-lg font-semibold">Geen stations gevonden</p>
        <p>Probeer een andere zoekterm.</p>
      </div>
      <div id="stationSearchResults" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Resultaten worden hier dynamisch ingevoegd -->
      </div>
    </main>

    <!-- Tab Content: Heatmap -->
    <main class="bg-white p-6 md:p-8 rounded-xl rounded-tl-none shadow-lg hidden" id="tab-heatmap">
      <div class="max-w-lg mx-auto">
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
                <label for="heatmapstation" class="block text-base font-semibold text-slate-700 mb-2">Selecteer station:</label>
                <select id="heatmapstation" class="form-input w-full border rounded-lg p-3 shadow-sm bg-white"></select>
            </div>
            <div>
                <label for="heatmapday" class="block text-base font-semibold text-slate-700 mb-2">Selecteer dag:</label>
                <select id="heatmapday" class="form-input w-full border rounded-lg p-3 shadow-sm bg-white"></select>
            </div>
        </div>
        <div id="heatmap-output"></div>
      </div>
    </main>

    <!-- Tab Content: Patronen -->
    <main class="bg-white p-6 md:p-8 rounded-xl rounded-tl-none shadow-lg hidden" id="tab-patronen">
      <h2 class="text-2xl font-bold text-slate-800 mb-4">Terugkerende Treinpatronen</h2>
      <div id="patronen-output"></div>
    </main>

    <footer class="text-center text-sm text-slate-500 mt-12 space-y-1">
        <p>Versie 2.5.1</p>
        <p>Copyright &copy; 2025 Mark Eijbaard. MIT licentie.</p>
        <p><a href="https://github.com/meijbaard/SpotConverter/issues" target="_blank" class="text-cyan-600 hover:underline">Meld een probleem of wens</a></p>
    </footer>
  </div>
  <link rel="stylesheet" href="/assets/css/spotconverter.css">
  <script src="/assets/js/spotconverter.js" defer></script>

<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SpotConverter Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #334155; }
        :root { --accent-color: #06b6d4; }
        .highlight-station { background-color: #cffafe; color: #0e7490; padding: 0.1rem 0.4rem; border-radius: 0.25rem; font-weight: 600; }
        .highlight-abbr { background-color: #f1f5f9; color: #475569; padding: 0.1rem 0.4rem; border-radius: 0.25rem; font-weight: 500; cursor: help; border-bottom: 2px dotted #94a3b8; }
        .highlight-estimation { background-color: var(--accent-color); color: white; padding: 0.2rem 0.5rem; border-radius: 0.375rem; font-weight: 700; }
        #loader-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(248, 250, 252, 0.8); display: flex; justify-content: center; align-items: center; z-index: 9999; flex-direction: column; gap: 1rem; backdrop-filter: blur(4px); }
        .spinner { border: 5px solid #e2e8f0; border-top: 5px solid var(--accent-color); border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body class="py-8 md:py-12">
    <div id="loader-overlay">
        <div class="spinner"></div>
        <p class="text-lg font-semibold text-slate-600">Data laden vanaf GitHub...</p>
    </div>
    <div class="max-w-5xl mx-auto px-4 space-y-8 md:space-y-10">
        <header class="bg-white p-6 md:p-8 rounded-xl shadow-lg text-center">
            <div class="flex justify-center items-center mb-4">
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

        <!-- Tabs -->
        <div class="flex justify-center mt-10">
          <button class="tab-btn px-6 py-3 rounded-t-lg font-semibold text-slate-700 bg-white border border-b-0 border-slate-200 active" data-tab="spot">Spot</button>
          <button class="tab-btn px-6 py-3 rounded-t-lg font-semibold text-slate-700 bg-white border border-b-0 border-slate-200" data-tab="heatmap">Heatmap</button>
          <button class="tab-btn px-6 py-3 rounded-t-lg font-semibold text-slate-700 bg-white border border-b-0 border-slate-200" data-tab="patronen">Patronen</button>
        </div>

        <!-- Tabbladen -->
        <main class="bg-white p-6 md:p-8 rounded-b-xl shadow-lg" id="tab-spot">
            <!-- Converter Tool Spot Analyse -->
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
                    <h2 class="text-xl font-bold text-slate-800 mb-2">Analyse:</h2>
                    <div id="estimation-output" class="p-4 bg-cyan-50 border-l-4 border-cyan-400 rounded-r-lg min-h-[60px] space-y-2"></div>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-slate-800 mb-2">Patroonherkenning:</h2>
                  <div id="pattern-output" class="p-4 bg-white border border-cyan-200 rounded-lg"></div>
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

        <!-- Tab: Heatmap -->
        <main class="bg-white p-6 md:p-8 rounded-b-xl shadow-lg hidden" id="tab-heatmap">
          <div class="max-w-lg mx-auto">
            <label for="heatmapstation" class="block text-base font-semibold text-slate-700 mb-2">Selecteer station:</label>
            <select id="heatmapstation" class="form-input w-full border rounded-lg p-3 shadow-sm bg-white mb-6"></select>
            <div id="heatmap-output"></div>
          </div>
        </main>

        <!-- Tab: Patronen -->
        <main class="bg-white p-6 md:p-8 rounded-b-xl shadow-lg hidden" id="tab-patronen">
            <h2 class="text-2xl font-bold text-slate-800 mb-4">Terugkerende Treinpatronen</h2>
            <div id="patronen-output"></div>
        </main>

        <!-- Footer kan hier nog -->
    </div>
    <script src="https://raw.githubusercontent.com/meijbaard/SpotConverter/main/station_converter.js"></script>
    <script>
    // TABSWITCHING
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('main[id^="tab-"]').forEach(tab => tab.classList.add('hidden'));
        document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
      });
    });

    // --- DATA LADEN ---
    let trainPatterns = {}, heatmapData = {};
    async function loadPatterns() {
      const res = await fetch('https://raw.githubusercontent.com/meijbaard/SpotConverter/main/treinpatronen.json');
      trainPatterns = await res.json();
      window.trainPatterns = trainPatterns;
    }
    async function loadHeatmap() {
      const res = await fetch('https://raw.githubusercontent.com/meijbaard/SpotConverter/main/heatmap_treinpassages.json');
      heatmapData = await res.json();
      window.heatmapData = heatmapData;
    }

    // Alleen relevante stations in heatmap dropdown
    function populateHeatmapDropdown() {
      const select = document.getElementById('heatmapstation');
      select.innerHTML = '';
      Object.keys(heatmapData).forEach(code => {
        const naam = window.stationDataByCode?.[code] || code;
        const option = document.createElement('option');
        option.value = code;
        option.textContent = naam;
        select.appendChild(option);
      });
    }
    // Heatmap render
    function renderHeatmap(stationCode) {
      const data = heatmapData[stationCode];
      if (!data) return '<em>Geen data voor dit station.</em>';
      let max = Math.max(...Object.values(data));
      let rows = Object.entries(data).sort(([a], [b]) => Number(a)-Number(b)).map(([uur, count]) => {
        let level = 0;
        if (count >= Math.max(1, Math.ceil(max*0.66))) level = 3;
        else if (count >= Math.max(1, Math.ceil(max*0.33))) level = 2;
        else if (count > 0) level = 1;
        return `<tr><td>${uur}:00</td><td class="heatmap-cell" data-level="${level}">${count}</td></tr>`;
      }).join('');
      return `<table class="heatmap-table"><tr><th>Uur</th><th>Aantal passages</th></tr>${rows}</table>`;
    }
    document.getElementById('heatmapstation').addEventListener('change', e => {
      document.getElementById('heatmap-output').innerHTML = renderHeatmap(e.target.value);
    });

    // Patronen tonen
    function renderPatronen() {
      // stationDataByCode wordt extern gezet na laden van stations.csv in main JS
      return Object.values(trainPatterns).map(pattern =>
        `<div class="pattern-block">
          <div class="pattern-name">${pattern.name}</div>
          <div class="mt-1">${pattern.description}</div>
          <div class="pattern-route">Route: ${pattern.commonRoute.map(code => window.stationDataByCode?.[code]||code).join(' → ')}</div>
          ${pattern.avgWaitTimes && Object.keys(pattern.avgWaitTimes).length ?
            `<div class="mt-1">Gem. wachttijd: ${Object.entries(pattern.avgWaitTimes).map(([k,v]) => `${window.stationDataByCode?.[k]||k}: ${v} min`).join(', ')}</div>` : ''}
          <div class="pattern-notes mt-2">${pattern.notes||''}</div>
        </div>`
      ).join('');
    }
    function showPatternInSpotTab(parsed) {
      // Herken patroon (vergelijk met bestaande pattern-herkenning uit hoofdscript)
      if (!window.trainPatterns || !parsed || !parsed.routeCodes) return '';
      let found = null;
      for (const pattern of Object.values(window.trainPatterns)) {
        if (parsed.routeCodes && pattern.commonRoute.some(code => parsed.routeCodes.includes(code))) {
          found = pattern;
          break;
        }
      }
      if (found) {
        return `<strong>Herkenning patroon:</strong><br>
          <span class="pattern-name">${found.name}</span><br>
          ${found.description}<br>
          <div class="pattern-route">Route: ${found.commonRoute.map(code => window.stationDataByCode?.[code]||code).join(' → ')}</div>
          ${found.avgWaitTimes && Object.keys(found.avgWaitTimes).length ?
            `<div>Gem. wachttijd: ${Object.entries(found.avgWaitTimes).map(([k,v]) => `${window.stationDataByCode?.[k]||k}: ${v} min`).join(', ')}</div>` : ''}
          <div class="pattern-notes">${found.notes||''}</div>`;
      } else {
        return `<strong>Geen vast patroon herkend.</strong><br>Dit lijkt een losse of onbekende spot.`;
      }
    }

    // Na alle externe data (uit hoofdscript geladen):
    window.addEventListener('DOMContentLoaded', async () => {
      await loadPatterns();
      await loadHeatmap();
      // stationDataByCode wordt in hoofdscript gezet!
      if (window.stationDataByCode) populateHeatmapDropdown();
      // Patronen renderen
      if (window.trainPatterns) document.getElementById('patronen-output').innerHTML = renderPatronen();
      // Koppel patroonherkenning aan spot-output (onder analyse)
      const oldProcessMessage = window.processMessage;
      window.processMessage = function() {
        if (oldProcessMessage) oldProcessMessage();
        // Parsed data uit hoofdscript (parsedMessage global!)
        const patternDiv = document.getElementById('pattern-output');
        if (window.parsedMessage) patternDiv.innerHTML = showPatternInSpotTab(window.parsedMessage);
      };
      // Init heatmap met eerste relevante station
      if (window.heatmapData && Object.keys(window.heatmapData).length > 0) {
        const eerste = Object.keys(window.heatmapData)[0];
        document.getElementById('heatmap-output').innerHTML = renderHeatmap(eerste);
        document.getElementById('heatmapstation').value = eerste;
      }
      // Loader overlay uit
      document.getElementById('loader-overlay').style.display = 'none';
    });
    </script>
</body>
</html>

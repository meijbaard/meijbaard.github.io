---
title: Verkiezingsdashboard Baarn
author_profile: false
layout: dashboard
permalink: /electiondashboard/
classes:
  - text-slate-800
---

<div class="container mx-auto p-4 md:p-8">
    <header class="mb-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900">Verkiezingsdashboard Baarn</h1>
        <p class="text-slate-600 mt-2 max-w-2xl mx-auto">Een interactieve analyse van de verkiezingsuitslagen in de gemeente Baarn. Verken de data per buurt, bekijk zetelverdelingen en ontdek politieke trends.</p>
    </header>

    <div class="mb-6">
        <div class="border-b border-slate-200">
            <nav class="-mb-px flex space-x-4 sm:space-x-8 justify-center" aria-label="Tabs">
                <button class="tab-button whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm" data-tab="kaart">🗺️ Interactieve Kaart</button>
                <button class="tab-button whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm" data-tab="overzicht">📊 Uitslag Overzicht</button>
                <button class="tab-button whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm" data-tab="zetels">🪑 Zetelverdeling</button>
                <button class="tab-button whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm" data-tab="analyse">🔬 Analyse GL/PvdA</button>
            </nav>
        </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div id="main-filter-container">
                <label for="election-select" class="block text-sm font-medium text-slate-700 mb-1">Kies een verkiezing:</label>
                <select id="election-select" class="w-full p-2 border border-slate-300 rounded-md shadow-sm"></select>
            </div>
            <div id="analysis-filter-container" class="hidden">
                <label for="analysis-election-select" class="block text-sm font-medium text-slate-700 mb-1">Kies een scenario:</label>
                <select id="analysis-election-select" class="w-full p-2 border border-slate-300 rounded-md shadow-sm"></select>
            </div>
            <div id="party-filter-container">
                <label for="party-select" class="block text-sm font-medium text-slate-700 mb-1">Kies een partij (optioneel):</label>
                <select id="party-select" class="w-full p-2 border border-slate-300 rounded-md shadow-sm"></select>
            </div>
        </div>
    </div>

    <div id="kaart" class="tab-content active"></div>
    <div id="overzicht" class="tab-content"></div>
    <div id="zetels" class="tab-content"></div>
    <div id="analyse" class="tab-content"></div>
</div>
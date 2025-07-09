---
permalink: /spotconverter/
layout: spotconverter
title: SpotConverter
author_profile: false
---

<!-- De HTML-structuur voor de converter -->
<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Omrekenen Roeien / Fietsen / Hardlopen</h1>

    <!-- Input velden voor de gebruiker -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-white p-6 rounded-lg shadow-md">
        <div>
            <label for="hours" class="block text-sm font-medium text-gray-700">Uren</label>
            <input type="number" id="hours" min="0" value="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
            <label for="minutes" class="block text-sm font-medium text-gray-700">Minuten</label>
            <input type="number" id="minutes" min="0" max="59" value="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
            <label for="seconds" class="block text-sm font-medium text-gray-700">Seconden</label>
            <input type="number" id="seconds" min="0" max="59" value="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div>
            <label for="distance" class="block text-sm font-medium text-gray-700">Afstand (meters)</label>
            <input type="number" id="distance" min="0" value="2000" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
        <div class="md:col-span-2">
            <label for="sport" class="block text-sm font-medium text-gray-700">Sport</label>
            <select id="sport" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="rowing">Roeien</option>
                <option value="cycling">Fietsen</option>
                <option value="running">Hardlopen</option>
            </select>
        </div>
    </div>

    <!-- Knop om de berekening te starten -->
    <button id="calculate" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300">
        Bereken
    </button>

    <!-- Tabel om de resultaten te tonen -->
    <div class="mt-8 overflow-x-auto">
        <h2 class="text-2xl font-bold mb-4">Resultaten</h2>
        <table id="results-table" class="min-w-full bg-white rounded-lg shadow-md">
            <thead class="bg-gray-200">
                <tr>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Sport</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tijd</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Afstand</th>
                    <th class="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Snelheid</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                <!-- Resultaat rijen worden hier dynamisch ingevoegd -->
            </tbody>
        </table>
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

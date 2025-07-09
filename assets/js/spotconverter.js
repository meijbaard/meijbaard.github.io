<script>
        // --- Globale variabelen en Constanten ---
        let stationData = [], distanceData = {}, trajectories = {}, debounceTimer;
        
        const spotterAbbr = {
            'A': 'Aankomst', 'V': 'Vertrek', 'D': 'Doorrijden',
            'LSP': 'Linkerspoor', 'LLSP': 'Linker-linkerspoor', 'MSP': 'Middenspoor',
            'RSP': 'Rechterspoor', 'RRSP': 'Rechter-rechterspoor',
            'NVR': 'Niet voor reizigers', 'LM': 'Leeg materieel', 'LLT': 'Losse loc trein',
            'SMS': 'Samenstelling', 'GE': 'Goederenemplacement', 
            'Badl': 'Beladen aan de loc',
            'Ladl': 'Leeg aan de loc'
        };
        const conflictingAbbrs = ['EN', 'DE', 'D', 'A', 'V', 'OP', 'ALS'];

        // --- Data Laden ---
        async function loadExternalData() {
            const loader = document.getElementById('loader-overlay');
            loader.style.display = 'flex';

            try {
                const [stationResponse, distanceResponse] = await Promise.all([
                    fetch('https://raw.githubusercontent.com/meijbaard/SpotConverter/main/stations.csv'),
                    fetch('https://raw.githubusercontent.com/meijbaard/SpotConverter/main/afstanden.csv')
                ]);

                if (!stationResponse.ok) throw new Error(`Fout bij laden stations.csv: ${stationResponse.statusText}`);
                if (!distanceResponse.ok) throw new Error(`Fout bij laden afstanden.csv: ${distanceResponse.statusText}`);

                const stationCsvText = await stationResponse.text();
                const distanceCsvText = await distanceResponse.text();
                
                // Parse stations
                const stationLines = stationCsvText.trim().split('\n');
                const stationHeaders = stationLines.shift().split(',').map(h => h.trim());
                const codeIndex = stationHeaders.indexOf('code');
                const nameLongIndex = stationHeaders.indexOf('name_long');
                if (codeIndex === -1 || nameLongIndex === -1) throw new Error("Kolommen 'code' en 'name_long' niet gevonden in stations.csv");
                
                stationData = stationLines.map(line => {
                    const values = line.split(',');
                    return { afkorting: values[codeIndex].trim().toUpperCase(), naam: values[nameLongIndex].trim().replace(/"/g, '') };
                });
                stationData.sort((a, b) => b.afkorting.length - a.afkorting.length);
                populateStationDropdown();

                // Parse afstanden
                const distanceLines = distanceCsvText.trim().split('\n');
                const distanceHeaders = distanceLines.shift().split(',').map(h => h.trim().toUpperCase());
                distanceData = {};
                distanceLines.forEach(line => {
                    const values = line.split(',');
                    const rowStationCode = values.shift().trim().toUpperCase();
                    distanceData[rowStationCode] = {};
                    values.forEach((dist, index) => {
                        const colStationCode = distanceHeaders[index + 1];
                        if (colStationCode) {
                            distanceData[rowStationCode][colStationCode] = parseFloat(dist);
                        }
                    });
                });
                
                // Definieer trajecten
                trajectories = {
                    "Duitsland-Amersfoort": ["RHEINE", "SALZBERGEN", "BH", "ODZ", "HGLO", "HGL", "BN", "AMRI", "AML", "WDN", "RSN", "HON", "DVC", "DV", "TWL", "APDO", "APD", "STO", "BNVA", "BNV", "AMF"],
                    "Amersfoort-Amsterdam": ["AMF", "AMA", "BRNA", "BRN", "HVS", "HVSM", "BSMZ", "NDB", "WP", "DMN", "ASSP", "ASDM", "ASD", "AWH"],
                    "Amersfoort-Rotterdam": ["AMF", "AMA", "BRNA", "BRN", "HVS", "HVSM", "BSMZ", "NDB", "WP", "DMNZ", "DVA", "ASB", "BKL", "WD", "GD", "RTN", "RTD"]
                };

            } catch (error) {
                console.error("Kon externe data niet laden:", error);
                document.getElementById('output').innerHTML = `<p class="text-red-600 font-bold">Kon de data van GitHub niet laden: ${error.message}. Probeer de pagina te vernieuwen.</p>`;
            } finally {
                loader.style.display = 'none';
            }
        }
        
        // --- UI Functies ---
        function populateStationDropdown() {
            const select = document.getElementById('targetStationSelect');
            select.innerHTML = '';
            [...stationData].sort((a,b) => a.naam.localeCompare(b.naam)).forEach(station => {
                const option = document.createElement('option');
                option.value = station.naam;
                option.textContent = station.naam;
                if (station.naam === "Baarn") option.selected = true;
                select.appendChild(option);
            });
        }

        function toggleParsedData() {
            const dataOutput = document.getElementById('parsed-data-output');
            const toggleBtn = document.getElementById('toggle-data-btn');
            const isHidden = dataOutput.style.display === 'none';
            dataOutput.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? '(Verberg)' : '(Toon)';
        }

        function clearOutputFields() {
            document.getElementById('output').innerHTML = '';
            document.getElementById('estimation-output').innerHTML = '';
            document.getElementById('parsed-data-output').textContent = '';
        }

        // --- Hoofdfunctie ---
        function processMessage() {
            const messageInput = document.getElementById('whatsappMessage').value;
            const targetStationName = document.getElementById('targetStationSelect').value;

            if (!messageInput.trim()) {
                clearOutputFields();
                return;
            }

            const parsedData = parseMessage(messageInput);
            const analysis = analyzeTrajectory(parsedData, targetStationName);
            const outputHtml = createHighlightedMessage(parsedData.originalMessage, parsedData.foundMatches);
            displayResults(outputHtml, analysis, parsedData);
        }

        // --- Opgesplitste Functies ---

        function parseMessage(message) {
            const parsed = {
                originalMessage: message,
                timestamp: null,
                route: [],
                routeCodes: [],
                foundMatches: [],
                spotLocation: null,
                destination: null
            };

            const timeMatch = message.match(/(\d{1,2}[:.]\d{2})/g);
            if (timeMatch) parsed.timestamp = timeMatch[0].replace('.', ':');
            
            stationData.forEach(station => {
                if (spotterAbbr.hasOwnProperty(station.afkorting)) return;
                
                const isConflicting = conflictingAbbrs.includes(station.afkorting.toUpperCase());
                const regexFlags = isConflicting ? 'g' : 'gi';
                const regex = new RegExp(`\\b(${station.afkorting})\\b(?!-)`, regexFlags);
                
                let match;
                while ((match = regex.exec(message)) !== null) {
                    if (!parsed.foundMatches.some(m => m.index === match.index)) {
                        parsed.foundMatches.push({ station: station, index: match.index, text: match[1] });
                    }
                }
            });
            parsed.foundMatches.sort((a, b) => a.index - b.index);

            if (parsed.foundMatches.length === 0) return parsed;

            parsed.spotLocation = parsed.foundMatches[0].station.afkorting;

            const directionMatch = message.match(/\sri\s+([a-zA-Z]+)/i);
            if (directionMatch) {
                const destAbbr = directionMatch[1].toUpperCase();
                const destinationStation = stationData.find(s => s.afkorting === destAbbr);
                if (destinationStation) {
                    parsed.destination = destinationStation.afkorting;
                }
            }

            if (parsed.spotLocation && parsed.destination) {
                parsed.routeCodes = [parsed.spotLocation, parsed.destination];
                const spotStation = stationData.find(s => s.afkorting === parsed.spotLocation);
                const destStation = stationData.find(s => s.afkorting === parsed.destination);
                if (spotStation && destStation) {
                    parsed.route = [spotStation.naam, destStation.naam];
                }
            } else {
                parsed.route = parsed.foundMatches.map(m => m.station.naam);
                parsed.routeCodes = parsed.foundMatches.map(m => m.station.afkorting);
            }

            return parsed;
        }

        function createHighlightedMessage(originalMessage, foundMatches) {
            let processedMessage = originalMessage;

            foundMatches.forEach(match => {
                processedMessage = processedMessage.replace(new RegExp(`\\b${match.text}\\b(?![-<])`, 'g'), `<span class="highlight-station">${match.station.naam}</span>`);
            });

            for (const abbr in spotterAbbr) {
                const regex = new RegExp(`\\b${abbr}\\b(?![-<])`, 'gi');
                processedMessage = processedMessage.replace(regex, (foundText) => {
                    return `<span class="highlight-abbr" title="${spotterAbbr[abbr]}">${foundText}</span>`;
                });
            }
            return processedMessage;
        }

        function analyzeTrajectory(parsedData, targetStationName) {
            const targetStationCode = stationData.find(s => s.naam === targetStationName)?.afkorting;
            let passageHtml = "Geen route herkend in het bericht.";
            let timeHtml = "Geen station of tijdstip gevonden om een berekening te maken.";

            const trajectoryAnalysis = findTrajectoryForRoute(parsedData.routeCodes);
            parsedData.trajectoryAnalysis = trajectoryAnalysis;
            
            if (trajectoryAnalysis) {
                const passesTarget = doesTrajectoryPassStation(trajectoryAnalysis, parsedData.routeCodes[0], parsedData.routeCodes[1], targetStationCode);
                
                let generalDirection = "Onbekend";
                if (trajectoryAnalysis.direction === 'forward') {
                    if (trajectoryAnalysis.name.includes('Duitsland-Amersfoort')) generalDirection = 'Nederland in';
                    else generalDirection = 'Westwaarts';
                } else {
                    if (trajectoryAnalysis.name.includes('Duitsland-Amersfoort')) generalDirection = 'Nederland uit';
                    else generalDirection = 'Oostwaarts';
                }
                passageHtml = `Rijrichting: 🚂 <strong>${generalDirection}</strong> | Passage ${targetStationName}: <strong>${passesTarget ? '✅ Ja' : '❌ Nee'}</strong>`;
                
                // --- AANGEPASTE LOGICA ---
                // Bereken de tijd alleen als de trein daadwerkelijk het doelstation passeert.
                if (passesTarget) {
                    if (parsedData.spotLocation && parsedData.timestamp && targetStationCode) {
                        const firstSpottedStationCode = parsedData.spotLocation;
                        const firstSpottedStationName = stationData.find(s => s.afkorting === firstSpottedStationCode)?.naam || firstSpottedStationCode;
                        
                        const distance = distanceData[firstSpottedStationCode]?.[targetStationCode];
                        if (distance !== undefined) {
                            const averageSpeedKmH = 80;
                            const travelMinutes = Math.round((distance / averageSpeedKmH) * 60);
                            const [hours, minutes] = parsedData.timestamp.split(':').map(Number);
                            const spotDate = new Date();
                            spotDate.setHours(hours, minutes, 0, 0);
                            spotDate.setMinutes(spotDate.getMinutes() + travelMinutes);
                            const arrivalTime = spotDate.toTimeString().substring(0, 5);
                            timeHtml = `⏰ Geschatte doorkomsttijd in <span class="font-bold">${targetStationName}</span>: <strong class="highlight-estimation">${arrivalTime}</strong> <br> <span class="text-sm text-slate-500">(vanaf ${firstSpottedStationName})</span>`;
                        } else {
                            timeHtml = `<p>Geen afstandsdata gevonden tussen <span class="font-bold">${firstSpottedStationName}</span> en <span class="font-bold">${targetStationName}</span>.</p>`;
                        }
                    }
                } else {
                    // Als de trein niet passeert, is de tijd niet van toepassing.
                    timeHtml = `<p>Tijdsberekening niet van toepassing.</p>`;
                }
            } else if (parsedData.route.length > 1) {
                passageHtml = "Kan geen bekend traject matchen met de gespotte route.";
            }
            
            return { passageHtml, timeHtml };
        }

        function displayResults(outputHtml, analysis, parsedData) {
            document.getElementById('output').innerHTML = outputHtml;
            document.getElementById('estimation-output').innerHTML = `<div>${analysis.passageHtml}</div><div>${analysis.timeHtml}</div>`;
            document.getElementById('parsed-data-output').textContent = JSON.stringify(parsedData, null, 2);
        }

        // --- Hulpfuncties ---

        function findTrajectoryForRoute(routeCodes) {
            if (routeCodes.length < 2) return null;
            const startCode = routeCodes[0];
            const endCode = routeCodes[1];

            const isSubsequence = (sub, main) => {
                let i = 0, j = 0;
                while (i < main.length && j < sub.length) {
                    if (main[i] === sub[j]) j++;
                    i++;
                }
                return j === sub.length;
            };

            for (const name in trajectories) {
                const traject = trajectories[name];
                if (isSubsequence(routeCodes, traject)) return { name: name, direction: 'forward' };
                if (isSubsequence(routeCodes, [...traject].reverse())) return { name: name, direction: 'backward' };
            }

            const hub = "AMF";
            let startTrajectName = null;
            let endTrajectName = null;

            for (const name in trajectories) {
                if (trajectories[name].includes(startCode)) startTrajectName = name;
                if (trajectories[name].includes(endCode)) endTrajectName = name;
            }

            if (startTrajectName && endTrajectName && startTrajectName !== endTrajectName) {
                const startTraj = trajectories[startTrajectName];
                const endTraj = trajectories[endTrajectName];

                if (startTraj.includes(hub) && endTraj.includes(hub)) {
                    const validStartToHub = isSubsequence([startCode, hub], startTraj) || isSubsequence([startCode, hub], [...startTraj].reverse());
                    const validHubToEnd = isSubsequence([hub, endCode], endTraj) || isSubsequence([hub, endCode], [...endTraj].reverse());

                    if (validStartToHub && validHubToEnd) {
                        const finalLegDirection = isSubsequence([hub, endCode], endTraj) ? 'forward' : 'backward';
                        return {
                            name: `${startTrajectName} -> ${endTrajectName}`,
                            direction: finalLegDirection
                        };
                    }
                }
            }

            return null;
        }

        function doesTrajectoryPassStation(trajectoryAnalysis, startCode, endCode, targetStationCode) {
            if (!trajectoryAnalysis || !targetStationCode) return false;

            const hub = "AMF";
            const trajectNames = trajectoryAnalysis.name.split(' -> ');

            const isBetween = (line, p1, p2, target) => {
                const idx1 = line.indexOf(p1);
                const idx2 = line.indexOf(p2);
                const idxTarget = line.indexOf(target);
                if (idx1 === -1 || idx2 === -1 || idxTarget === -1) return false;
                return (idxTarget >= Math.min(idx1, idx2) && idxTarget <= Math.max(idx1, idx2));
            };

            if (trajectNames.length === 1) {
                const line = trajectories[trajectNames[0]];
                return isBetween(line, startCode, endCode, targetStationCode);
            }

            if (trajectNames.length === 2) {
                const firstLegLine = trajectories[trajectNames[0]];
                if (isBetween(firstLegLine, startCode, hub, targetStationCode)) {
                    return true;
                }
                
                const secondLegLine = trajectories[trajectNames[1]];
                if (isBetween(secondLegLine, hub, endCode, targetStationCode)) {
                    return true;
                }
            }

            return false;
        }


        function debounceProcessMessage() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(processMessage, 300);
        }

        // --- Initialisatie ---
        window.onload = loadExternalData;
    </script>

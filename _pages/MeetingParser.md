---
permalink: /meetingparser/
layout: dashboard
title: MeetingParser
author_profile: false
---

<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raadsverslag Analyse Tool</title>
    <!-- Tailwind CSS for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- React libraries -->
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <!-- Babel to transpile JSX in the browser -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- pdf.js library for PDF processing -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"></script>
</head>
<body class="bg-gray-50">

    <div id="root"></div>

    <script type="text/babel">
        // The React component code goes here
        const { useState, useCallback, useMemo } = React;

        function App() {
          const [meetingData, setMeetingData] = useState([]);
          const [processedFiles, setProcessedFiles] = useState([]);
          const [loading, setLoading] = useState(false);
          const [error, setError] = useState('');
          const [isDraggingOver, setIsDraggingOver] = useState(false);
          const [filterOnderwerp, setFilterOnderwerp] = useState('');
          const [filterSpreker, setFilterSpreker] = useState('');


          // Helper function to format the date string to m-d-yyyy for Notion
          const formatDate = (day, monthName, year) => {
              const months = {
                  'januari': '1', 'februari': '2', 'maart': '3', 'april': '4', 'mei': '5', 'juni': '6',
                  'juli': '7', 'augustus': '8', 'september': '9', 'oktober': '10', 'november': '11', 'december': '12'
              };
              const month = months[monthName.toLowerCase()] || monthName;
              return `${month}-${day}-${year}`;
          };
          
          const learnBoldFont = (structuredText) => {
              for (const line of structuredText) {
                  const lineText = line.map(chunk => chunk.text).join(' ').trim();
                  if (lineText.match(/^\s*1\.\s+Opening/i) || lineText.match(/^\s*2\.\s+Mededelingen/i)) {
                      const textChunk = line.find(chunk => chunk.text.trim().match(/^(Opening|Mededelingen)/i));
                      if (textChunk) {
                          return textChunk.fontName;
                      }
                  }
              }
              return null; 
          };

          // Main function to parse a single document's text
          const parseMeeting = (structuredText, fileName, boldFontName) => {
            const data = [];
            const flatText = structuredText.map(line => line.map(chunk => chunk.text).join(' ')).join('\n').replace(/(\d)\s(\d)/g, '$1$2');
            
            const meetingNameMatch = flatText.match(/Bijeenkomst "([^"]+)"/i);
            const meetingName = meetingNameMatch ? meetingNameMatch[1] : `Raadsvergadering (${fileName})`;
            
            // CRITICAL FIX: Get date ONLY from filename, as requested.
            let meetingDate = "Onbekend";
            const fileNameDateMatch = fileName.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/i);
            if (fileNameDateMatch) {
                const day = fileNameDateMatch[1];
                const monthName = fileNameDateMatch[2];
                const year = fileNameDateMatch[3];
                meetingDate = formatDate(day, monthName, year);
            }

            let currentTopic = "Niet gedefinieerd";
            let currentStatement = { speaker: null, text: '' };

            const saveCurrentStatement = () => {
                if (currentStatement.speaker && currentStatement.text.trim()) {
                    data.push({
                        bron: fileName,
                        vergadering: meetingName,
                        datum: meetingDate,
                        onderwerp: currentTopic,
                        spreker: currentStatement.speaker,
                        tekst: currentStatement.text.trim(),
                    });
                }
                currentStatement = { speaker: null, text: ''};
            };
            
            for (const line of structuredText) {
                const lineText = line.map(chunk => chunk.text).join(' ').trim();
                if (!lineText) continue;

                const isPotentiallyTopic = lineText.match(/^\s*\d{1,2}\.\s+/);
                const textChunks = line.filter(chunk => !chunk.text.match(/^\s*\d{1,2}\.\s*$/));
                const isBold = boldFontName && textChunks.length > 0 && textChunks.every(chunk => chunk.fontName === boldFontName);

                if (isPotentiallyTopic && isBold) {
                    saveCurrentStatement();
                    currentTopic = lineText.replace(/^\d{1,2}\.\s*/, '').trim();
                    continue;
                }
                
                const speakerMatch = lineText.match(/^(De VOORZITTER|Wethouder [A-ZÀ-ÿ\s.-]+|De heer [A-ZÀ-ÿ\s.-]+|Mevrouw [A-ZÀ-ÿ\s.-]+):/i);
                if (speakerMatch) {
                    saveCurrentStatement();
                    const speakerNameRaw = speakerMatch[0].replace(':', '').trim();
                    currentStatement.speaker = speakerNameRaw;
                    currentStatement.text = lineText.substring(speakerMatch[0].length).trim();
                } else if (currentStatement.speaker) {
                    currentStatement.text += ' ' + lineText;
                }
            }
            saveCurrentStatement();
            
            return data;
          };

          const waitForPdfLib = () => {
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const interval = setInterval(() => {
                    if (typeof window.pdfjsLib !== 'undefined') {
                        clearInterval(interval);
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${window.pdfjsLib.version}/pdf.worker.min.js`;
                        resolve();
                    } else if (attempts > 50) {
                        clearInterval(interval);
                        reject(new Error('PDF library kon niet worden geladen. Controleer uw internetverbinding en probeer de pagina te vernieuwen.'));
                    }
                    attempts++;
                }, 100);
            });
          };

          const processFiles = useCallback(async (files) => {
            if (!files || files.length === 0) return;

            setLoading(true);
            setError('');
            setMeetingData([]);
            setProcessedFiles([]);

            try {
                await waitForPdfLib();
            } catch (err) {
                setError(err.message);
                setLoading(false);
                return;
            }

            const allData = [];
            const processedFileNames = [];
            let hadParseableFiles = false;

            for (const file of files) {
                if (file.type !== 'application/pdf') {
                    setError(`Bestandstype niet ondersteund voor ${file.name}. Alleen PDF's a.u.b.`);
                    continue;
                }
                hadParseableFiles = true;

                try {
                    const reader = new FileReader();
                    const structuredText = await new Promise((resolve, reject) => {
                        reader.onload = async (e) => {
                            try {
                                const data = new Uint8Array(e.target.result);
                                const pdf = await window.pdfjsLib.getDocument({ data }).promise;
                                const structuredLines = [];

                                for (let p = 1; p <= pdf.numPages; p++) {
                                    const page = await pdf.getPage(p);
                                    const textContent = await page.getTextContent();
                                    
                                    let lastY = -1;
                                    let line = [];
                                    for (const item of textContent.items) {
                                        if (lastY !== -1 && item.transform[5] !== lastY) {
                                            structuredLines.push(line);
                                            line = [];
                                        }
                                        line.push({ text: item.str, fontName: item.fontName });
                                        lastY = item.transform[5];
                                    }
                                    if (line.length > 0) {
                                        structuredLines.push(line);
                                    }
                                }
                                resolve(structuredLines);
                            } catch (pdfError) {
                                reject(new Error(`Fout bij het verwerken van PDF ${file.name}: ${pdfError.message}`));
                            }
                        };
                        reader.onerror = (e) => reject(new Error(`Fout bij het lezen van bestand ${file.name}`));
                        reader.readAsArrayBuffer(file);
                    });
                    
                    const boldFontName = learnBoldFont(structuredText);
                    const parsedData = parseMeeting(structuredText, file.name, boldFontName);
                    allData.push(...parsedData);
                    processedFileNames.push(file.name);

                } catch (e) {
                    setError(e.message);
                    console.error(e);
                }
            }
            
            if (allData.length === 0 && hadParseableFiles && !error) {
                setError('De bestanden zijn gelezen, maar de tool kon de structuur niet herkennen om data te extraheren. Controleer of de PDF\'s een vergelijkbare opmaak hebben als het voorbeeldverslag (genummerde agendapunten, sprekers met "Naam:").');
            }

            setMeetingData(allData);
            setProcessedFiles(processedFileNames);
            setLoading(false);
          }, []);

          const handleFileChange = (event) => {
            processFiles(event.target.files);
          };

          const handleDrop = useCallback((event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDraggingOver(false);
              const files = event.dataTransfer.files;
              processFiles(files);
          }, [processFiles]);

          const handleDragOver = useCallback((event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDraggingOver(true);
          }, []);

          const handleDragLeave = useCallback((event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDraggingOver(false);
          }, []);

          const filteredData = useMemo(() => {
            return meetingData.filter(item => {
                const onderwerpMatch = item.onderwerp.toLowerCase().includes(filterOnderwerp.toLowerCase());
                const sprekerMatch = item.spreker.toLowerCase().includes(filterSpreker.toLowerCase());
                return onderwerpMatch && sprekerMatch;
            });
          }, [meetingData, filterOnderwerp, filterSpreker]);


          const downloadFile = (fileName, mimeType, content) => {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          };

          const exportToCSV = () => {
            if (filteredData.length === 0) return;
            const headers = ["Bron", "Vergadering", "Datum", "Onderwerp", "Spreker", "Tekst"];
            const csvRows = [
              headers.join(';'), // Use semicolon as separator
              ...filteredData.map(row => {
                const values = headers.map(header => {
                  const key = header.toLowerCase();
                  const escaped = ('' + (row[key] || '')).replace(/"/g, '""');
                  return `"${escaped}"`;
                });
                return values.join(';'); // Use semicolon as separator
              })
            ];
            downloadFile('raadsverslagen.csv', 'text/csv;charset=utf-8;', csvRows.join('\n'));
          };

          const exportToSQL = () => {
            if (filteredData.length === 0) return;
            const tableName = 'raadsverslagen';
            
            const createTableStatement = `
DROP TABLE IF EXISTS ${tableName};
CREATE TABLE ${tableName} (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bron VARCHAR(255),
  vergadering VARCHAR(255),
  datum VARCHAR(255),
  onderwerp TEXT,
  spreker VARCHAR(255),
  tekst LONGTEXT
);
`;

            const insertStatements = filteredData.map(row => {
              const columns = ['bron', 'vergadering', 'datum', 'onderwerp', 'spreker', 'tekst'];
              const values = columns.map(col => {
                return "'" + (row[col] || '').replace(/'/g, "''") + "'";
              }).join(', ');
              return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});`;
            }).join('\n');

            downloadFile('raadsverslagen.sql', 'application/sql', createTableStatement + '\n' + insertStatements);
          };

          return (
              <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Analyse Raadsverslagen</h1>
                  <p className="text-lg text-gray-600 mt-2">Upload een of meerdere PDF-verslagen om de data te extraheren.</p>
                </header>

                <div 
                    className={`bg-white p-6 rounded-xl shadow-md mb-8 border-2 border-dashed transition-colors ${isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                  <h2 className="text-xl font-semibold mb-3">1. Upload bestanden</h2>
                  <div className="flex justify-center items-center flex-col text-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="text-sm text-gray-600 mb-4">Sleep bestanden hierheen of <label htmlFor="file-upload" className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">klik om te selecteren</label>.</p>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  {processedFiles.length > 0 && (
                    <div className="mt-4 text-center">
                      <h3 className="font-semibold text-sm">Verwerkte bestanden:</h3>
                      <ul className="list-none text-sm text-gray-600">
                        {processedFiles.map(name => <li key={name}>{name}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md" role="alert">
                      <p className="font-bold">Fout</p>
                      <p>{error}</p>
                  </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-3">2. Filter Resultaten</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="filter-onderwerp" className="block text-sm font-medium text-gray-700">Filter op Onderwerp</label>
                            <input
                                type="text"
                                id="filter-onderwerp"
                                value={filterOnderwerp}
                                onChange={(e) => setFilterOnderwerp(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Typ om te filteren..."
                            />
                        </div>
                        <div>
                            <label htmlFor="filter-spreker" className="block text-sm font-medium text-gray-700">Filter op Spreker</label>
                            <input
                                type="text"
                                id="filter-spreker"
                                value={filterSpreker}
                                onChange={(e) => setFilterSpreker(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Typ om te filteren..."
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-3">3. Exporteer Data</h2>
                    <p className="text-sm text-gray-600 mb-4">Download de gefilterde data als CSV (voor Notion, Excel, etc.) of als SQL-bestand (voor MySQL-databases).</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={exportToCSV}
                            disabled={filteredData.length === 0 || loading}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Exporteer naar CSV
                        </button>
                        <button
                            onClick={exportToSQL}
                            disabled={filteredData.length === 0 || loading}
                            className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            Exporteer naar SQL
                        </button>
                    </div>
                </div>


                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-500">Verslagen worden geanalyseerd...</p>
                  </div>
                ) : (
                  <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                          <tr>
                            <th scope="col" className="px-6 py-3">Bron</th>
                            <th scope="col" className="px-6 py-3">Datum</th>
                            <th scope="col" className="px-6 py-3">Onderwerp</th>
                            <th scope="col" className="px-6 py-3">Spreker</th>
                            <th scope="col" className="px-6 py-3">Wat is er gezegd?</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.map((item, index) => (
                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-6 py-4 text-xs text-gray-500">{item.bron}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.datum}</td>
                              <td className="px-6 py-4 font-medium text-gray-900">
                                {item.onderwerp}
                                <div className="text-xs text-gray-500 font-normal">{item.vergadering}</div>
                              </td>
                              <td className="px-6 py-4">{item.spreker}</td>
                              <td className="px-6 py-4 text-gray-700">{item.tekst}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                     {filteredData.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-500">Upload een of meerdere PDF-bestanden om te beginnen of pas uw filters aan.</p>
                        </div>
                     )}
                  </div>
                )}
              </div>
          );
        }

        // Mount the React app to the DOM
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>

</body>
</html>

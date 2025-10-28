// import React, { useState, useEffect } from 'react';
// import { searchIPC } from '../services/ipcService';
// import '../styles/PromptBar.css';

// const PromptBar = () => {
//     const [userInput, setUserInput] = useState('');
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Disable right-click
//         document.addEventListener("contextmenu", (e) => e.preventDefault());

//         // Disable Copy-Paste & Inspect Element
//         document.addEventListener("keydown", (e) => {
//             if (e.ctrlKey && (e.key === "c" || e.key === "x" || e.key === "u" || e.key === "v")) {
//                 e.preventDefault();
//             }
//         });

//         return () => {
//             document.removeEventListener("contextmenu", (e) => e.preventDefault());
//             document.removeEventListener("keydown", (e) => e.preventDefault());
//         };
//     }, []);

//     // Function to handle the search
//     const handleSearch = async () => {
//         if (!userInput.trim()) {
//             setError('Please enter a search term');
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             const response = await searchIPC(userInput);
//             console.log("Search result: ", response);
//             if (response.data && Array.isArray(response.data)) {
//                 setResults(response.data);
//             }
//         } catch (err) {
//             setError('No results found');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle Enter key press
//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             handleSearch();
//         }
//     };

//     return (
//         <div className="container">
//             {/* Search Section */}
//             <div className="search-section">
//                 <h1>IPC Section Dictionary</h1>
//                 <p>Search for an IPC Section or description below:</p>

//                 <div className="search-box">
//                     <input
//                         type="text"
//                         value={userInput}
//                         onChange={(e) => setUserInput(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                         placeholder="Enter IPC Section or description"
//                     />
//                     <button onClick={handleSearch} disabled={loading}>
//                         {loading ? 'Searching...' : 'Search'}
//                     </button>
//                 </div>
//                 {error && <div className="error-message">{error}</div>}
//             </div>

//             {/* Results Section */}
//             {results.length > 0 && (
//                 <div className="results-container">
//                     {results.map((result, index) => (
//                         <div key={index} className="result-box">
//                             {results.length > 1 && (
//                                 <h3 className="result-heading">Result {index + 1}</h3>
//                             )}
//                             <table className="results-table">
//                                 <tbody>
//                                     <tr>
//                                         <th>IPC Section</th>
//                                         <td>{result["IPC Section"]}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Description</th>
//                                         <td>{result.Description}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Offence</th>
//                                         <td>{result.Offence}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Nature of Offence</th>
//                                         <td>{result["Nature of Offence"]}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Punishment</th>
//                                         <td>{result.Punishment}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Bailable or Not</th>
//                                         <td>{result["Bailable or Not"]}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Consequences</th>
//                                         <td>{result.Consequences}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Solutions</th>
//                                         <td>{result.Solutions}</td>
//                                     </tr>
//                                     <tr>
//                                         <th>Suggestions</th>
//                                         <td>{result.Suggestions}</td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                             <br />
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* <div className="promptbar-container">
//                 {error ? (
//                     <div className="error-message">
//                         <p>{error}</p>
//                         <button onClick={() => window.location.reload()}>Try Again</button>
//                     </div>
//                 ) : (
//                     <div id="thinkstack-container"></div>
//                 )}
//             </div> */}
//         </div>
//     );
// };
// export default PromptBar;

import React, { useState, useEffect } from 'react';
import { searchIPC } from '../services/ipcService';
import '../styles/PromptBar.css';

const PromptBar = () => {
    const [userInput, setUserInput] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const disableContextMenu = (e) => e.preventDefault();
        const disableShortcuts = (e) => {
            if (e.ctrlKey && ['c', 'x', 'u', 'v'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        };
        document.addEventListener('contextmenu', disableContextMenu);
        document.addEventListener('keydown', disableShortcuts);

        return () => {
            document.removeEventListener('contextmenu', disableContextMenu);
            document.removeEventListener('keydown', disableShortcuts);
        };
    }, []);

    const handleSearch = async () => {
        if (!userInput.trim()) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await searchIPC(userInput);
            if (response.data && Array.isArray(response.data)) {
                setResults(response.data);
                setCurrentSlide(0);
            } else {
                setError('No results found');
            }
        } catch (err) {
            setError('Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % results.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + results.length) % results.length);
    };

    return (
        <div className="promptbar-container">
            <section className="search-wrapper">
                <h1>🔍 IPC Section Finder</h1>
                <p>Enter section number or description:</p>
                <div className="input-group">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="e.g. 302 or 'murder'"
                    />
                    <button onClick={handleSearch} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {error && <div className="error">{error}</div>}
            </section>

            {results.length > 0 && (
                <section className="results slider-horizontal">
                    
                    <div className="result-card">
                        <div className="slider-header">
                            <h3>Result {currentSlide + 1} of {results.length}</h3>
                        <div className="slider-combo">
                            <button onClick={prevSlide} className="slider-icon-btn" title="Previous">⟸</button>
                            <button onClick={nextSlide} className="slider-icon-btn" title="Next">⟹</button>
                        </div>
                    </div>

                    <table className="ipc-result-table">
                        <thead>
                            <tr>
                            <th>Field</th>
                            <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(results[currentSlide]).map(([key, value]) => (
                            <tr key={key}>
                                <td className="ipc-field">{key}</td>
                                <td className="ipc-value">{value}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    
                </section>
                )}
        </div>
    );
};

export default PromptBar;


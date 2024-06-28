import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Weather from './components/Weather';
import Pollution from './components/Pollution';
import UniversityRanking from './components/UniversityRanking';
import CSGORanking from './components/CSGORanking'; 


function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Rankingi światowe</h1>
                    <nav>
                        <ul>
                            <li><Link to="/weather">Ranking Pogody</Link></li>
                            <li><Link to="/pollution">Ranking Zanieczyszczeń</Link></li>
                            <li><Link to="/university_ranking">Ranking Uniwersytetów</Link></li>
                            <li><Link to="/csgo_ranking">Ranking Graczy CS:GO</Link></li>
                        </ul>
                    </nav>
                </header>
                <Routes>
                    <Route path="/weather" element={<Weather />} />
                    <Route path="/pollution" element={<Pollution />} />
                    <Route path="/university_ranking" element={<UniversityRanking />} />
                    <Route path="/csgo_ranking" element={<CSGORanking />} />
                    <Route path="/" element={<h2>Wybierz ranking z menu powyżej</h2>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
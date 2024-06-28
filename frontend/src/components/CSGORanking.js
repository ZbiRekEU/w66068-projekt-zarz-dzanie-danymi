import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CSGORanking = () => {
    const [rankingData, setRankingData] = useState([]);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await axios.get('http://localhost:5000/csgo');
                setRankingData(response.data.reverse()); 
            } catch (error) {
                console.error("Error fetching CS:GO ranking data:", error);
            }
        };
        fetchRanking();

        
    }, []);

    return (
        <div className="ranking-container">
            {rankingData.map((player, index) => (
                <div key={index} className="ranking-card">
                    <h2>{player.rank}. {player.name}</h2>
                    <p>MVPs: {player.mvps}</p>
                </div>
            ))}
        </div>
    );
};

export default CSGORanking;
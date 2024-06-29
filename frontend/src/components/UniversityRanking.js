import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UniversityRanking = () => {
    const [rankingData, setRankingData] = useState([]);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await axios.get('http://localhost:5000/university_ranking');
                setRankingData(response.data);
            } catch (error) {
                console.error("Error fetching university ranking data:", error);
            }
        };

        fetchRanking();
    }, []);

    return (
        <div className="ranking-container">
            {rankingData.map((data, index) => (
                <div key={index} className="ranking-card">
                    <h2>{data.rank}. {data.name}</h2>
                    <p>Score: {data.score}</p>
                </div>
            ))}
        </div>
    );
};

export default UniversityRanking;

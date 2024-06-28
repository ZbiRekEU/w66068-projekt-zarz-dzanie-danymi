import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pollution = () => {
    const [airQualityData, setAirQualityData] = useState([]);

    useEffect(() => {
        const fetchAirQuality = async () => {
            try {
                const response = await axios.get('http://localhost:5000/air_quality');
                const sortedData = response.data.sort((a, b) => b.aqi - a.aqi); 
                setAirQualityData(sortedData);
            } catch (error) {
                console.error("Error fetching air quality data:", error);
            }
        };
        fetchAirQuality();
    }, []);

    const getCardClass = (aqi) => {
        if (aqi === 5) return 'very-poor';
        if (aqi === 4) return 'poor';
        if (aqi === 3) return 'moderate';
        if (aqi === 2) return 'fair';
        return 'good';
    };

    return (
        <div className="air-quality-container">
            {airQualityData.map((data, index) => (
                <div key={index} className={`air-quality-card ${getCardClass(data.aqi)}`}>
                    <h2>{index + 1}. {data.name}</h2>
                    <p>Air Quality Index (AQI): {data.aqi}</p>
                    <p>Components:</p>
                    <ul>
                        {Object.entries(data.components).map(([component, value]) => (
                            <li key={component}>{component}: {value}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Pollution;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const europeanCapitals = [
    "Tirana", "Andorra la Vella", "Vienna", "Minsk", "Brussels", "Sarajevo", "Sofia", "Zagreb", "Nicosia", "Prague",
    "Copenhagen", "Tallinn", "Helsinki", "Paris", "Berlin", "Athens", "Budapest", "Reykjavik", "Dublin", "Rome",
    "Pristina", "Riga", "Vaduz", "Vilnius", "Luxembourg", "Valletta", "Chisinau", "Monaco", "Podgorica", "Amsterdam",
    "Skopje", "Oslo", "Warsaw", "Lisbon", "Bucharest", "Moscow", "San Marino", "Belgrade", "Bratislava", "Ljubljana",
    "Madrid", "Stockholm", "Bern", "London", "Kyiv", "Vatican City"
];

const Weather = () => {
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const responses = await Promise.all(
                    europeanCapitals.map(city => axios.get(`http://localhost:5000/weather/current?city=${city}`))
                );
                const sortedData = responses.map(response => response.data).sort((a, b) => b.temperature - a.temperature);
                setWeatherData(sortedData);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };
        fetchWeather();
    }, []);
    const getCardClass = (temperature) => {
        if (temperature > 30) return 'hot';
        if (temperature > 25) return 'warm';
        if (temperature > 15) return 'mild';
        if (temperature > 5) return 'cool';
        return 'cold';
    };

    return (
        <div className="weather-container">
            {weatherData.map((data, index) => (
                <div key={index} className={`weather-card ${getCardClass(data.temperature)}`}>
                    <h2>{index + 1}. {data.city}</h2>
                    <p>Temperatura: {data.temperature}°C</p>
                    <p>Niebo: {data.description}</p>
                    <p>Wilgotność: {data.humidity}%</p>
                    <p>Prędkość wiatru: {data.wind_speed} m/s</p>
                </div>
            ))}
        </div>
    );
};

export default Weather;
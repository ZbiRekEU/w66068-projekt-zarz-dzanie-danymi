from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
CORS(app)  

API_KEY = ''
WEATHER_URL = 'http://api.openweathermap.org/data/2.5/'
POLLUTION_URL = 'http://api.openweathermap.org/data/2.5/air_pollution'

cities = [
    {"name": "Warszawa", "lat": 52.2298, "lon": 21.0118},
    {"name": "Kraków", "lat": 50.0647, "lon": 19.9450},
    {"name": "Łódź", "lat": 51.7592, "lon": 19.4560},
    {"name": "Wrocław", "lat": 51.1079, "lon": 17.0385},
    {"name": "Poznań", "lat": 52.4064, "lon": 16.9252},
    {"name": "Gdańsk", "lat": 54.3520, "lon": 18.6466},
    {"name": "Szczecin", "lat": 53.4285, "lon": 14.5528},
    {"name": "Bydgoszcz", "lat": 53.1235, "lon": 18.0084},
    {"name": "Lublin", "lat": 51.2465, "lon": 22.5684},
    {"name": "Białystok", "lat": 53.1325, "lon": 23.1688},
    {"name": "Katowice", "lat": 50.2649, "lon": 19.0238},
    {"name": "Gorzów Wielkopolski", "lat": 52.7368, "lon": 15.2288},
    {"name": "Opole", "lat": 50.6751, "lon": 17.9213},
    {"name": "Rzeszów", "lat": 50.0413, "lon": 21.9990},
    {"name": "Kielce", "lat": 50.8661, "lon": 20.6286},
    {"name": "Olsztyn", "lat": 53.7784, "lon": 20.4801},
    {"name": "Zielona Góra", "lat": 51.9355, "lon": 15.5062}
]

@app.route('/weather/current', methods=['GET'])
def get_current_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City name is required'}), 400

    response = requests.get(f'{WEATHER_URL}weather?q={city}&appid={API_KEY}&units=metric')
    if response.status_code != 200:
        return jsonify({'error': 'Could not fetch weather data'}), response.status_code

    data = response.json()
    return jsonify({
        'city': data['name'],
        'temperature': data['main']['temp'],
        'description': data['weather'][0]['description'],
        'humidity': data['main']['humidity'],
        'wind_speed': data['wind']['speed']
    })

@app.route('/weather/forecast', methods=['GET'])
def get_weather_forecast():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City name is required'}), 400

    response = requests.get(f'{WEATHER_URL}forecast/daily?q={city}&cnt=7&appid={API_KEY}&units=metric')
    if response.status_code != 200:
        return jsonify({'error': 'Could not fetch forecast data'}), response.status_code

    data = response.json()
    forecast = []
    for day in data['list']:
        forecast.append({
            'date': day['dt'],
            'temperature': day['temp']['day'],
            'description': day['weather'][0]['description']
        })
    
    return jsonify({
        'city': data['city']['name'],
        'forecast': forecast
    })

@app.route('/air_quality', methods=['GET'])
def get_air_quality():
    city_data = []
    for city in cities:
        response = requests.get(f'{POLLUTION_URL}?lat={city["lat"]}&lon={city["lon"]}&appid={API_KEY}')
        data = response.json()
        if response.status_code == 200:
            city_info = {
                "name": city["name"],
                "aqi": data['list'][0]['main']['aqi'],
                "components": data['list'][0]['components']
            }
            city_data.append(city_info)
        else:
            return jsonify({"error": "Failed to fetch data"}), response.status_code
    
    # city_data.sort(key=lambda x: x['aqi'])
    return jsonify(city_data)

@app.route('/university_ranking', methods=['GET'])
def get_university_ranking():
    url = 'https://www.shanghairanking.com/rankings/arwu/2023'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    rankings = []
    table = soup.find('tbody')

    if table:
        for row in table.find_all('tr')[0:20]:  # Get top 20 universities
            cells = row.find_all('td')
            print(cells)
            if len(cells) >= 4:
                rank = cells[0].text.strip()
                name = cells[1].text.strip()
                score = cells[4].text.strip()

                university = {
                    "rank": rank,
                    "name": name,
                    "score": score
                }
                rankings.append(university)
    else:
        return jsonify({"error": "Failed to find the ranking table"}), 500

    return jsonify(rankings)

@app.route('/csgo', methods=['GET'])
def get_csgo_ranking():
    url = 'https://respawn.pl/ktorzy-gracze-csgo-zdobyli-najwiecej-mvp-ranking-lista/'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    rankings = []

    ul = soup.find('ul', style="text-align: justify;")
    if ul:
        for li in ul.find_all('li'):
            text = li.get_text(separator=" ").strip()
            parts = text.split(" – ")
            if len(parts) == 2:
                rank_name, mvps = parts
                rank_name_parts = rank_name.split(". ", 1)
                if len(rank_name_parts) == 2:
                    rank = rank_name_parts[0]
                    name = rank_name_parts[1]
                    mvps = mvps.replace(" MVP", "").strip()

                    player = {
                        "rank": rank,
                        "name": name,
                        "mvps": mvps
                    }
                    rankings.append(player)
    else:
        return jsonify({"error": "Failed to find the ranking list"}), 500

    return jsonify(rankings)

if __name__ == '__main__':
    app.run(debug=True)

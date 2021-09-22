import React, { useState } from "react";

const api: { base: string; key: string } = {
    base: "https://api.openweathermap.org/data/2.5/",
    key: "9b3bf173eda8aab31d076563a89a6f05",
};

interface weather {
    main: {
        temp: number;
    };
    cod: string | number;
    weather: { description: string }[];
    sys: {
        country: string;
    };
    name: string;
    message: string;
}

function App() {
    const [query, setQuery] = useState("");
    const [weather, setWeather] = useState<weather | undefined>();

    const search = async (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            await fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
                .then(res => res.json())
                .then(result => {
                    setWeather(result);
                    setQuery("");
                    console.log(result);
                });
        }
    };

    const dateBuilder = (currentDate: Date) => {
        let months = [
            "January",
            "February",
            "March",
            "April",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[currentDate.getDay()];
        let date = currentDate.getDate();
        let month = months[currentDate.getMonth()];
        let year = currentDate.getFullYear();

        return `${day} ${date} ${month} ${year}`;
    };

    const weatherImageClass = ["app", "mild"];
    if (typeof weather !== "undefined" && typeof weather.main !== "undefined") {
        if (weather.main.temp < 15) {
            weatherImageClass.pop();
            weatherImageClass.push("cold");
        } else if (weather.main.temp > 30) {
            weatherImageClass.pop();
            weatherImageClass.push("warm");
        }
    }

    return (
        <div className={weatherImageClass.join(" ")}>
            <main>
                <div className="search-box">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search City ..."
                        onChange={event => setQuery(event.target.value)}
                        value={query}
                        onKeyPress={search}
                    />
                </div>
                {typeof weather !== "undefined" && weather.cod === 200 ? (
                    <div>
                        <div className="location-box">
                            <div className="location">
                                {weather.name} , {weather.sys.country}
                            </div>
                            <div className="date">{dateBuilder(new Date())}</div>
                        </div>
                        <div className="weather-box">
                            <div className="temp">{Math.round(weather.main.temp)}°c</div>
                            <div className="weather">{weather.weather[0].description}</div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {typeof weather !== "undefined" && weather.cod === "404" ? (
                    <div>
                        <div className="error-box">
                            <div className="error">{weather.message}</div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </main>
        </div>
    );
}

export default App;

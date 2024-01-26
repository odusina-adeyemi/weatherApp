import React, { useState, useEffect } from "react";
import "./App.css";
import TopButton from "./Components/TopButton";
import Input from "./Components/Input";
import TimeAndLocation from "./Components/TimeAndLocation";
import TemperatureAndDetails from "./Components/TemperatureAndDetails";
import Forecast from "./Components/Forecast";
import getFormattedWeatherData from "./services/weatherServices";

function App() {
  const [query, setQuery] = useState({ q: "berlin" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      await getFormattedWeatherData({ ...query, units }).then((data) =>
        setWeather(data)
      );
    };

    fetchWeather();
  }, [query, units]);

  return (
    <div
      className="mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 
    h-fit shadow-xl shadow-gray-400"
    >
      <TopButton />
      <Input />

      {weather && (
        <div>
         <TimeAndLocation weather={weather}/>
         <TemperatureAndDetails weather={weather}/>
   
         <Forecast title={"hourly forecast"} items={weather.hourly} />
         <Forecast title={"daily forecast"} items={weather.daily}/>
         </div>)
      }


     
    </div>
  );
}

export default App;

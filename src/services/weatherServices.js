import { DateTime } from "luxon";
// import Forecast from "../Components/Forecast";

const API_KEY = "090a1bb8a2e01aa0e903e9599bb1afd9";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";



const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather =  (data) => {
  let { timezone, daily, hourly } = data;
  if (!data || !data.timezone || !data.daily || !data.hourly) {
    return null; // Handle missing data gracefully, throw an error, or return a default value
  }
  daily =  daily.slice(1, 6).map(d => {
    return {
        title: formatToLocalTime(d.dt, timezone, 'ccc'),
        temp: d.temp.day,
        icon: d.weather[0].icon 
    }
  });

  hourly =   hourly.slice(1, 6).map(d => {
    return {
        title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
        temp: d.temp,
        icon: d.weather[0].icon 
    }
  });
  
  return { timezone, daily, hourly}
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;
  
  const formattedForecastWeather = await getWeatherData('onecall', {
    lat,
    lon, 
    exclude: "current, minutely, alerts",
     units: searchParams.units ||  "metric"
  }).then(formatForecastWeather);

return {...formattedCurrentWeather, ...formattedForecastWeather};

};


const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy'  |  Local Time: ' hh:mm: a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);


const iconUrlFromCode = (code) => `https://openweathermap.org/img/wn/${code}.png`;

export default getFormattedWeatherData;

export {formatToLocalTime, iconUrlFromCode}


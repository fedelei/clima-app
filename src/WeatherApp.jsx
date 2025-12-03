import React, { useEffect, useState } from 'react'
import './WeatherApp.css'

export const WeatherApp = () => {
  const [weatherData, setweatherData] = useState(null)
  const [city, setCity] = useState('')
  const [bgClass, setBgClass] = useState('default-bg')

  const url = 'https://api.openweathermap.org/data/2.5/weather'
 const API_KEY = import.meta.env.VITE_API_KEY

  const diffKelv = 273.15

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(`${url}?q=${city}&appid=${API_KEY}&lang=es`)
      const data = await response.json()
      setweatherData(data)
    } catch (error) {
      console.error('Se ha producido un error', error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim() !== '') fetchWeather(city)
  }

  const handleInput = (e) => {
    setCity(e.target.value)
  }

  // 🎨 Cambia el fondo dinámicamente según el clima
  useEffect(() => {
    if (!weatherData || !weatherData.weather) return

    const mainWeather = weatherData.weather[0].main.toLowerCase()

    switch (true) {
      case mainWeather.includes('cloud'):
        setBgClass('cloudy-bg')
        break
      case mainWeather.includes('rain'):
        setBgClass('rainy-bg')
        break
      case mainWeather.includes('clear'):
        setBgClass('sunny-bg')
        break
      case mainWeather.includes('snow'):
        setBgClass('snowy-bg')
        break
      case mainWeather.includes('storm') || mainWeather.includes('thunder'):
        setBgClass('storm-bg')
        break
      default:
        setBgClass('default-bg')
    }
  }, [weatherData])

  return (
    <div className={`container ${bgClass}`}>
      <h1>Clima</h1>
      <hr />
      <h3>Ingrese la ciudad que desea consultar</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ejemplo: Buenos Aires"
          onChange={handleInput}
          value={city}
        />
        <button type="submit">Buscar</button>
      </form>

      {weatherData && weatherData.main && (
        <div className="weather-info">
          <h2>{weatherData.name}, {weatherData.sys.country}.</h2>
          <p>Temperatura: {Math.floor(weatherData.main.temp - diffKelv)}°C</p>
          <p>Condición: {weatherData.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
        </div>
      )}
    </div>
  )
}
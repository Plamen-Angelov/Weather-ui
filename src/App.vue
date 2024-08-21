<template>
  <div id="app">
    <h1>Weather App</h1>
    <input v-model="city" placeholder="Enter city name" @keyup.enter="fetchWeatherAndSetCity" />
    <button @click="fetchWeatherAndSetCity">Get Weather</button>

    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>

    <div v-if="weather">
      <h2>Weather in {{ fetchedCity }}</h2>
      <p>Celsius: {{ weather.temperatureCelsius }} °C</p>
      <p>Fahrenheit: {{ weather.temperatureFahrenheit }} °F</p>
      <p>Kelvin: {{ weather.temperatureKelvin }} K</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useWeather } from './composables/useWeather';

export default {
  setup() {
    const {
      city,
      weather,
      loading,
      error,
      fetchWeather,
      loadLastCity,
    } = useWeather();

    const fetchedCity = ref('');

    const fetchWeatherAndSetCity = async () => {
      await fetchWeather();
      if (!error.value) {
        fetchedCity.value = city.value;
      }
    };

    onMounted(() => {
      loadLastCity();
      fetchedCity.value = city.value;
    });

    return {
      city,
      fetchedCity,
      weather,
      loading,
      error,
      fetchWeatherAndSetCity,
    };
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}

input {
  padding: 10px;
  margin-right: 10px;
}

button {
  padding: 10px;
}

div {
  margin-top: 20px;
}

h2 {
  color: #42b983;
}
</style>

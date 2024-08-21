import { ref } from 'vue';
import axios from 'axios';

export function useWeather() {
  const city = ref('');
  const weather = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchWeather = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get(`https://localhost:44379/api/weather/getweather/${city.value}`);
      weather.value = response.data;
      localStorage.setItem('lastCity', city.value);
    } catch (err) {
      error.value = 'Could not retrieve weather data. Please check the city name or try again later.';
    } finally {
      loading.value = false;
    }
  };

  const loadLastCity = () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      city.value = lastCity;
      fetchWeather();
    }
  };

  return {
    city,
    weather,
    loading,
    error,
    fetchWeather,
    loadLastCity,
  };
}

import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import { useWeather } from '@/composables/useWeather';

// Mock the useWeather composable
jest.mock('@/composables/useWeather', () => ({
  useWeather: jest.fn(),
}));

describe('App.vue', () => {
  let cityMock, weatherMock, loadingMock, errorMock, fetchWeatherMock, loadLastCityMock;

  beforeEach(() => {
    cityMock = ref('');
    weatherMock = ref(null);
    loadingMock = ref(false);
    errorMock = ref(null);
    fetchWeatherMock = jest.fn();
    loadLastCityMock = jest.fn();

    useWeather.mockReturnValue({
      city: cityMock,
      weather: weatherMock,
      loading: loadingMock,
      error: errorMock,
      fetchWeather: fetchWeatherMock,
      loadLastCity: loadLastCityMock,
    });
  });

  it('loads last city on mount', () => {
    cityMock.value = 'Varna';
    const wrapper = mount(App);
    expect(loadLastCityMock).toHaveBeenCalled();
    expect(wrapper.vm.fetchedCity).toBe('Varna');
  });

  it('fetches weather and updates city on button click', async () => {
    cityMock.value = 'Varna';
    weatherMock.value = { temperatureCelsius: 20 };
    const wrapper = mount(App);

    await wrapper.find('button').trigger('click');

    expect(fetchWeatherMock).toHaveBeenCalled();
    expect(wrapper.vm.fetchedCity).toBe('Varna');
    expect(wrapper.find('h2').text()).toContain('Weather in Varna');
    expect(wrapper.find('p').text()).toContain('Celsius: 20 °C');
  });

  it('handles error correctly', async () => {
    cityMock.value = 'InvalidCity';
    errorMock.value = 'Could not retrieve weather data';
    const wrapper = mount(App);

    await wrapper.find('button').trigger('click');

    expect(fetchWeatherMock).toHaveBeenCalled();
    expect(wrapper.find('div').text()).toContain('Could not retrieve weather data');
    expect(wrapper.vm.fetchedCity).toBe('InvalidCity');
  });

  it('shows loading state during fetch', async () => {
    loadingMock.value = true;
    const wrapper = mount(App);

    await wrapper.find('button').trigger('click');

    expect(wrapper.find('div').text()).toContain('Loading...');
  });
});

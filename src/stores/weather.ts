import { ref } from 'vue';
import router from '../router/index';
import { defineStore } from 'pinia';
import { useUrlStore } from './url';
import { useWindowStore } from '../stores/window';
import type { Forecast } from '../assets/types/types';

export const useWeatherStore = defineStore('weather', () => {
    const long = ref<number>();
    const lat = ref<number>();
    const location = ref('');
    const forecast = ref<Forecast[]>([{ "date": "", "date_epoch": 0, "day": { "maxtemp_c": 0, "maxtemp_f": 0, "mintemp_c": 0, "mintemp_f": 0, "avgtemp_c": 0, "avgtemp_f": 0, "maxwind_mph": 0, "maxwind_kph": 0, "totalprecip_mm": 0, "totalprecip_in": 0, "totalsnow_cm": 0, "avgvis_km": 0, "avgvis_miles": 0, "avghumidity": 0, "daily_will_it_rain": 0, "daily_chance_of_rain": 0, "daily_will_it_snow": 0, "daily_chance_of_snow": 0, "condition": { "text": "", "icon": "", "code": 0 }, "uv": 0 }, "astro": { "sunrise": "", "sunset": "", "moonrise": "", "moonset": "", "moon_phase": "", "moon_illumination": 0, "is_moon_up": 0, "is_sun_up": 0 }, "hour": [ { "time_epoch": 0, "time": "", "temp_c": 0, "temp_f": 0, "is_day": 0, "condition": { "text": "", "icon": "", "code": 0 }, "wind_mph": 0, "wind_kph": 0, "wind_degree": 0, "wind_dir": "", "pressure_mb": 0, "pressure_in": 0, "precip_mm": 0, "precip_in": 0, "snow_cm": 0, "humidity": 0, "cloud": 0, "feelslike_c": 0, "feelslike_f": 0, "windchill_c": 0, "windchill_f": 0, "heatindex_c": 0, "heatindex_f": 0, "dewpoint_c": 0, "dewpoint_f": 0, "will_it_rain": 0, "chance_of_rain": 0, "will_it_snow": 0, "chance_of_snow": 0, "vis_km": 0, "vis_miles": 0, "gust_mph": 0, "gust_kph": 0, "uv": 0 }]}]);
    const postcode = ref('');
    const city = ref('');
    const showForecast = ref(false);
    const weatherHover = ref(false);
    const urlStore = useUrlStore();
    const windowStore = useWindowStore();

    const handleSearch = () => {
        if (postcode.value !== '') {
            handlePostcode();
        } else if (city.value !== '') {
            handleCity();
        } else {
            alert('Please enter a valid postcode or city.');
        }
    }

    function getLocation() {
        if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(showPosition, declineLocation);
        } else {
            showForecast.value = false;       
        }
    }

    function showPosition(position: GeolocationPosition) {
        long.value = position.coords.longitude;
        lat.value = position.coords.latitude;
        const longLat = `${lat.value},${long.value}`;
        fetchForecast(longLat);
    }

    function declineLocation() {
        showForecast.value = false;
    }

    function handlePostcode() {
        postcode.value = postcode.value.trim();
        const regex = /^([A-Z]{1,2}[0-9][A-Z0-9]?)\s?[0-9][A-Z]{2}$/i;
        if (regex.test(postcode.value)) {
            postcode.value = postcode.value.split(' ').join('').toUpperCase();
            fetchForecast(postcode.value);
        } else {
            alert('Please enter a valid uk postcode e.g. KT4 8UT');
            postcode.value = '';
        }

    }

    function handleCity() {
        city.value = city.value.trim();
        const regex = /^[A-Za-z]+(\s[A-Za-z]+)?(\s[A-Za-z]+)?$/;
        if (regex.test(city.value)) {        
            fetchForecast(city.value);
        } else {
            alert('Please enter a valid city');
            city.value = '';
        }

    }

    async function fetchForecast(userLocation: string) {
        showForecast.value = false;
        try {
            const response = await fetch(`${urlStore.url}/weather/${userLocation}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const json = await response.json();

            if (json.error) {
                return alert(json.error.message);
            }

            if (json.errorMessage) {
                if (location.value) {
                    showForecast.value = true;
                }
                postcode.value = '';
                city.value = '';
                return alert(json.errorMessage);
            }

            location.value = json.location.name;
            forecast.value = json.forecast.forecastday;
            showForecast.value = true;
            postcode.value = '';
            city.value = '';

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.name);
                console.error(error.message);
                console.error(error.stack);
            } else {
                console.log('error');
            } 
            console.log('unable to get weather');
        }
    }

    const onClickForecast = () => {
        weatherHover.value = false;
        router.push({ path: '/forecast' });
        if (windowStore.windowWidth < 687) {
            window.scrollTo(0, 1640);
        }
    }

    function updateForecast() {
        const currentTimeStamp = new Date().setHours(0, 0, 0, 0);
        const lastUpdate = new Date(forecast.value[0].date_epoch * 1000).setHours(0, 0, 0, 0);
        if (currentTimeStamp === lastUpdate) {
            return;
        }
        showForecast.value = false;
        if (lat.value && long.value) {
            const longLat = `${lat.value},${long.value}`;
            fetchForecast(longLat);
        } else if (postcode.value) {
            fetchForecast(postcode.value);
        } else {
            getLocation();
        }
    }

    return { location, postcode, showForecast, weatherHover, long, lat, forecast, city, handleSearch, onClickForecast, getLocation, fetchForecast, updateForecast }
});
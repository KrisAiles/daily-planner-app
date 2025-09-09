<script setup lang="ts">
import { useWeatherStore } from '../stores/weather';
import { useWindowStore } from '../stores/window';

const windowStore = useWindowStore();
const store = useWeatherStore();

function getDay(timeEpoch: number) {
    const timeStamp = timeEpoch * 1000;
    const day = new Date(timeStamp).getDay();
    switch (day) {
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
        case 0:
            return 'Sunday';
        default:
            break;
    }
}

function getTime(timeEpoch: number) {
    const timeStamp = timeEpoch * 1000;
    const hour = new Date(timeStamp).getHours();
    let adjustedHour: string;
    if (hour < 10) {
        adjustedHour = `0${hour}`;
    } else {
        adjustedHour = String(hour);
    }
    return `${adjustedHour}:00`;
}

</script>

<template>
    <div>
        <div id="forecast-display-container"   :style="{minHeight: windowStore.windowWidth < 687 ? '1640px' : 'auto'}">
            <h2>Weather Forecast <span v-if="store.location">for {{ store.location }}</span></h2>   
            <div id="forecast-search">
                <form @submit.prevent="store.handleSearch">
                    <label class="forecast-label" for="postcode">Postcode: </label>
                    <input class="forecast-input-style" id="postcode" name="postcode" type="text" v-model="store.postcode"><br>
                    <label class="forecast-label" for="city">City: </label>
                    <input class="forecast-input-style" id="city" name="city" type="text" v-model="store.city"><br>
                    <p class="forecast-label current-location" @click="store.getLocation">Use current location</p>
                    <input class="button-style" id="forecast-submit" name="submit" type="submit" value="search">
                </form>
            </div>   
            <Transition name="fade-bottom" mode="out-in" appear>
                <div id="forecast-item-container" v-if="store.showForecast">
                    <div class="forecast-item" v-for="day in store.forecast" :key="day.date_epoch">
                        <div class="forecast-day">
                            <h3>{{ getDay(day.date_epoch) }}</h3>
                        </div>
                        <div class="icon">
                            <img :src="day.day.condition.icon" :alt="day.day.condition.text" />
                        </div>              
                        <div class="forecast-details">
                            <p>Max temperature: {{ day.day.maxtemp_c }}&deg;</p>
                            <p>Min temperature: {{ day.day.mintemp_c }}&deg;</p>
                            <p>Total rainfall: {{ day.day.totalprecip_mm }}mm</p>
                            <p>Conditions: {{ day.day.condition.text }}</p>
                            <p>Average temperature: {{ day.day.avgtemp_c }}&deg;</p>
                            <p>Humidity: {{ day.day.avghumidity }}%</p>
                            <p>Chance of rain: {{ day.day.daily_chance_of_rain }}%</p>
                            <p>Wind speed: {{ day.day.maxwind_mph }}mph</p>
                            <p>Sunrise: {{ day.astro.sunrise }}</p>
                            <p>Sunset: {{ day.astro.sunset }}</p>
                        </div>
                        <div class="hourly-details" v-for="hour in day.hour" :key="hour.time_epoch">
                            <div class="hourly-time">
                                {{ getTime(hour.time_epoch) }}
                            </div>
                            <div class="hourly-icon">
                                <img :src="hour.condition.icon" :alt="hour.condition.text" />
                            </div>
                            <div class="hourly-temp">
                                <img src="../assets/images/temp.png" alt="temperature" />{{ hour.temp_c }}&deg;
                            </div>
                            <div class="hourly-rain">
                                <img src="../assets/images/rain.png" alt="rain drop" />{{ hour.chance_of_rain }}%
                            </div>
                            <div class="hourly-wind">
                                <img src="../assets/images/wind.png" alt="wind" />{{ hour.wind_mph }}mph {{ hour.wind_dir }}
                            </div>
                        </div>
                    </div> 
                </div>
            </Transition>
        </div>
        <div id="forecast-footer">
            <div id="credit">
                <a href="https://www.weatherapi.com/" title="Free Weather API" target="_blank"><img src='https://cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com"></a>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/mixins.scss';
@use '../assets/css/variables.scss';

.fade-bottom-enter-active,
.fade-bottom-leave-active {
    @include mixins.enter-leave;
}

.fade-bottom-enter-from,
.fade-bottom-leave-to {
    @include mixins.from-to-bottom;
}

#forecast-display-container {
    width: 100%;
    height: 100%;
    border-bottom: variables.$borders;
    background-color: variables.$white-color;
    padding: 1rem;
    text-align: center;

    h2 {
        font-size: 2rem;
        font-weight: 600;
        padding-bottom: 1rem;
        color: variables.$olive-color;
    }

    span {
        font-size: 2rem;
        font-weight: 600;
        padding-bottom: 1rem;
        color: variables.$olive-color;
    }
}

#forecast-search {
    color: variables.$olive-color;
    padding: 1rem;
}

.current-location {
    text-decoration: underline;
    cursor: pointer;
}

.forecast-input-style {
    @include mixins.forecast-input-style;
    margin-bottom: 0.125rem;
}

.button-style {
    @include mixins.button-style;
    margin-top: 0.5rem;
}

#forecast-item-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    color: variables.$white-color;

    @media only screen and (max-width: 980px) {
        flex-direction: column;
    }
}

.forecast-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 17.625rem;
    padding: 0.5rem;
    margin: 1rem;
    background-color: variables.$olive-color;
    box-shadow: variables.$box-shadow;
    border-radius: 0.3125rem;

    @media only screen and (max-width: 980px) {
        flex-direction: column;
        margin: 0 0 1rem 0;
    }
}

.forecast-day {
    text-align: center;
    width: 100%;

    h3 {
        font-size: 1.125rem;
        font-weight: 600;
    }
}

.icon {
    @include mixins.flex-center;
    width: 100%;
    padding-bottom: 0.5rem;

    img {
        width: 3.125rem;
    }
}

.forecast-details {
    width: 100%;
    text-align: left;
    padding-bottom: 0.5rem;
    border-bottom: 0.0625rem solid variables.$white-color;

    p {
        font-size: 1rem;
    }
}

.hourly-details {
    @include mixins.flex-center;
    text-align: left;
    width: 100%;
    border-bottom: 0.0625rem solid variables.$white-color;
    font-size: 0.875rem;
}

.hourly-time {
    width: 2.5rem;
}

.hourly-icon {
    img {
        width: 1.5625rem;
    }
}

.hourly-temp {
    width: 2.8125rem;

    img {
        height: 0.75rem;
    }
}

.hourly-rain {
    width: 3.125rem;

    img {
        width: 0.75rem;
    }
}

.hourly-wind {
    width: 6.875rem;

    img {
        width: 0.75rem;
    }
}

#forecast-footer {
    width: 100%;
    height: 100%;
    background-color: variables.$white-color;
    padding: 1rem;
    text-align: center;
}

#credit {
    width: 100%;
    text-align: center;
    padding: 0.5rem;
}
</style>
<script setup lang="ts">
import { useWeatherStore } from '../stores/weather';

const store = useWeatherStore();

store.getLocation();
setInterval(store.updateForecast, 60000);

</script>

<template>
    <div id="weather-container">
        <Transition name="fade-out" mode="out-in" appear>
            <div id="forecast-container" v-if="store.showForecast" @mouseover="store.weatherHover = true" @click="store.weatherHover = true">
                <div class="location">
                    <h3>{{ store.location }}</h3>
                </div>
                <div class="forecast">                
                    <div class="forecast-details">
                        <p>Max temperature: {{ store.forecast[0].day.maxtemp_c }}&deg;</p>
                        <p>Min temperature: {{ store.forecast[0].day.mintemp_c }}&deg;</p>
                        <p>Total rainfall: {{ store.forecast[0].day.totalprecip_mm }}mm</p>
                        <p>Conditions: {{ store.forecast[0].day.condition.text }}</p>
                    </div>  
                    <div class="icon">
                        <img :src="`https:${store.forecast[0].day.condition.icon}`" :alt="store.forecast[0].day.condition.text" />
                    </div>
                </div>  
            </div>
            <div id="search" v-else>
                    <h3>Weather</h3>
                <form @submit.prevent="store.handleSearch">
                    <label class="weather-label" for="postcode">Postcode: </label>
                    <input class="input-style" id="postcode" name="postcode" type="text" v-model="store.postcode"><br>
                    <label class="weather-label" for="city">City: </label>
                    <input class="input-style" id="city" name="city" type="text" v-model="store.city"><br>
                    <p class="weather-label current-location" @click="store.getLocation">Use current location</p>
                    <input class="button-style" id="weather-search-submit" name="submit" type="submit" value="search">
                </form>
            </div>
        </Transition>
        <div id="weather-hover" v-if="store.weatherHover"></div>
        <div id="hover-text" v-if="store.weatherHover" @mouseleave="store.weatherHover = false" @click="store.onClickForecast">
            <h2>View full forecast</h2>
        </div> 
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/mixins.scss';
@use '../assets/css/variables.scss';

.fade-out-enter-active,
.fade-out-leave-active {
    @include mixins.enter-leave;
}

.fade-out-enter-from,
.fade-out-leave-to {
    @include mixins.from-to-fade;
}

#weather-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 17.625rem;
    height: 8.8125rem;
    border-radius: 0.3125rem;
    box-shadow: variables.$box-shadow;
    background-color: variables.$olive-color;
    color: variables.$white-color;
}

#forecast-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 17.625rem;
    height: 8.8125rem;
    padding: 0.5rem 0 0.5rem 0.5rem;
}

.location {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    margin-bottom: 0.5rem;

    h3 {
        font-size: 1.125rem;
        font-weight: 600;
    }
}

.forecast {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
}

.icon {
    width: 4rem;
}

.forecast-details {
    width: 100%;
    text-align: left;

    p {
        font-size: 1rem;
    }
}

.button-style {
    @include mixins.button-style;
    margin-top: 0.5rem;
}

.input-style {
    @include mixins.input-style;
    margin-bottom: 0.125rem;
}

#search {
    h3 {
        margin: 0;
    }
}

#postcode {
    margin-top: 0.5rem;
}

.weather-label {
    font-size: 0.875rem;
    font-weight: 600;
}

.current-location {
    text-decoration: underline;
    cursor: pointer;
}

#weather-hover {
    position: absolute;
    @include mixins.flex-center;
    width: 17.625rem;
    height: 8.8125rem;
    border-radius: 0.3125rem;
    background-color: variables.$white-color;
    color: variables.$white-color;
    opacity: 0.75;
    z-index: 500;
}

#hover-text {
    position: absolute;
    @include mixins.flex-center;
    width: 17.625rem;
    height: 8.8125rem;
    border-radius: 0.3125rem;
    color: variables.$white-color;
    opacity: 1;
    z-index: 600;
    cursor: pointer;

    h2 {
        font-size: 1.5rem;
        color: variables.$olive-color;
        text-shadow: 0.0625rem 0.0625rem 0.125rem variables.$black-color;
    }
}
</style>
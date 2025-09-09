<script setup lang="ts">
import TimeDisplay from './TimeDisplay.vue';
import WeatherDisplay from './WeatherDisplay.vue';

</script>

<template>
    <div id="time-weather-container">
        <TimeDisplay></TimeDisplay>
        <WeatherDisplay></WeatherDisplay>
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/mixins.scss';

#time-weather-container {
    @include mixins.subhead-display-container;
    
}

</style>
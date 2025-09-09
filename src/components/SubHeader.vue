<script setup lang="ts">
import CalenderDisplay from './CalenderDisplay.vue';
import TimeWeatherDisplay from './TimeWeatherDisplay.vue';
import QuoteDisplay from './QuoteDisplay.vue';

</script>

<template>
    <div id="date-quote-container">
        <CalenderDisplay />
        <TimeWeatherDisplay />
        <QuoteDisplay />        
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';

#date-quote-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    text-align: center;
    border-bottom: variables.$borders;
    background-color: variables.$white-color;
}

</style>
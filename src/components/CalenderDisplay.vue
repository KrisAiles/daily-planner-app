<script setup lang="ts">
import { ref } from 'vue';
import DateSlot from '../slots/DateSlot.vue';

const todayTimeStamp  = ref<number>();
const currentDate = ref<number>();
const currentYear = ref<number>();
const currentMonth = ref<number>();
const isLeapYear = ref(false);
const daysInMonth = ref<string[]>([]);
const daysInWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const month = ref('');

function getDaysInMonth() {
    daysInMonth.value = [];
    const dateNow = new Date();
    todayTimeStamp.value = dateNow.setHours(0, 0, 0, 0);
    currentDate.value = dateNow.getDate();
    currentYear.value = dateNow.getFullYear();
    currentMonth.value = dateNow.getMonth();
    if (currentYear.value % 4 === 0) {
        isLeapYear.value = true;
    } else {
        isLeapYear.value = false;
    };

    let getMonthStartDay: string;
    const zeroIndexMonth = currentMonth.value + 1;
    if (zeroIndexMonth < 10) {
        getMonthStartDay = String(currentYear.value) + '-0' + String(zeroIndexMonth) + '-01'; 
    } else {
        getMonthStartDay = String(currentYear.value) + '-' + String(zeroIndexMonth) + '-01';
    }
    const monthStartDay = new Date(getMonthStartDay).getDay();

    switch (monthStartDay) {
        case 0:
            daysInMonth.value.push('', '', '', '', '', '');
            break;
        case 1:
            break;
        case 2:
            daysInMonth.value.push('');
            break;
        case 3:
            daysInMonth.value.push('', '');
            break;
        case 4:
            daysInMonth.value.push('', '', '');
            break;
        case 5:
            daysInMonth.value.push('', '', '', '');
            break;
        case 6:
            daysInMonth.value.push('', '', '', '', '');
            break;
    }

    if (currentMonth.value === 0 || currentMonth.value === 2 || currentMonth.value === 4 || currentMonth.value === 6 || currentMonth.value === 7 || currentMonth.value === 9 || currentMonth.value === 11) {
        daysInMonth.value.push('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31');
    } else if (currentMonth.value === 3 || currentMonth.value === 5 || currentMonth.value === 8 || currentMonth.value === 10) {
        daysInMonth.value.push('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30');
    } else {
        if (isLeapYear.value) {
            daysInMonth.value.push('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29');
        } else {
            daysInMonth.value.push('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28');
        }
    }
}

function getCurrentMonth() {
    switch (currentMonth.value) {
        case 0:
            month.value = 'JANUARY';      
            break;
        case 1:
            month.value = 'FEBRUARY';      
            break;
        case 2:
            month.value = 'MARCH';      
            break;
        case 3:
            month.value = 'APRIL';      
            break;
        case 4:
            month.value = 'MAY';      
            break;
        case 5:
            month.value = 'JUNE';      
            break;
        case 6:
            month.value = 'JULY';      
            break;
        case 7:
            month.value = 'AUGUST';
            break;
        case 8:
            month.value = 'SEPTEMBER';      
            break;
        case 9:
            month.value = 'OCTOBER';      
            break;
        case 10:
            month.value = 'NOVEMBER';      
            break;
        case 11:
            month.value = 'DECEMBER';      
            break;
        default:
            break;
    }
}

function setDate() {
    const currentTimeStamp = new Date().setHours(0, 0, 0, 0);
    if (currentTimeStamp === todayTimeStamp.value) {
        return;
    }
    getDaysInMonth();
    getCurrentMonth();
}

getDaysInMonth();
getCurrentMonth();
setInterval(setDate, 60000);

</script>

<template>
    <div id="date-container">
        <div id="date-month">
            <h2>{{ month }}</h2>
            <div id="date">
                <div v-for="(day, index) in daysInWeek" :key="index">
                    <DateSlot>
                        <span>{{ day }}</span>
                    </DateSlot>
                </div>
                <div class="month-dates" v-for="num in daysInMonth" :key="num" :style="[num === String(currentDate) ? {backgroundColor: '#000080'} : {backgroundColor: '#808000'}]">
                    <DateSlot>
                        <span>{{ num }}</span>
                    </DateSlot>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

#date-container {
    @include mixins.subhead-display-container;
}

#date-month {
    width: 17.625rem;
    height: 17.625rem;
    border-radius: 0.3125rem;
    background-color: variables.$olive-color;
    box-shadow: variables.$box-shadow;
    
    h2 {
        padding: 0.3125rem 0;
        color: white;
    }
}

#date {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 17.625rem;
    height: 15.125rem;

    span {
        font-size: 1.375rem;
        color: white;
    }
}

.month-dates {
    border-radius: 100%;
}
</style>
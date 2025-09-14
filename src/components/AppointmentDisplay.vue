<script setup lang="ts">
import { useAppointmentStore } from '../stores/appointment';

const store = useAppointmentStore();

store.setCurrentDate();

if (store.appointmentItems.length === 0) {
    store.getAllAppointments();
}

setInterval(store.checkAppointmentStatus, 60000);

</script>

<template>
    <div id="appointment-container">
        <h2>Appointments</h2>
        <TransitionGroup name="fade-left" appear>
            <div class="appointment-item" v-for="(item, index) in store.appointmentItems" :key="item.appointment_id" :style="{border: store.currentAppointmentIndex.includes(index) ? '0.3125rem solid #008080' : 'none'}">
                <div class="time">
                    <div class="start-time">
                        {{ store.setTime(item.start_time) }}
                    </div>
                    <div class="end-time">
                        {{ store.setTime(item.end_time) }}
                    </div>
                </div>
                <div class="appointment" :style="{color: store.pastAppointmentIndex.includes(index) ? 'lightgray' : 'white', textDecorationLine: store.pastAppointmentIndex.includes(index) ? 'line-through' : 'none', fontSize: store.currentAppointmentIndex.includes(index) ? '1.5rem' : '1.25rem'}">
                    {{ item.appointment_description }}
                </div>
                <div class="edit-delete">
                    <div class="appointment-edit">
                        <img src="../assets/images/edit.png" alt="edit pen" @click="store.toggleAppointmentEdit(item.start_time, item.end_time, item.appointment_description, index)" @mouseover="store.showToolTip(index, 'edit')" @mouseleave="store.hideToolTip()" />
                        <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'edit'">edit</div>
                    </div>
                    <div class="appointment-delete">
                        <img src="../assets/images/delete.png" alt="delete bin" @click="store.deleteAppointment(index, item.appointment_id)" @mouseover="store.showToolTip(index, 'delete')" @mouseleave="store.hideToolTip()" />
                        <div class="tooltip" v-if="store.tooltipStatus === index && store.tooltipType === 'delete'">delete</div>
                    </div>
                </div>            
                <div class="edit-appointment-container" v-if="store.editOpen === index">
                    <form class="appointment-form" @submit.prevent="store.updateAppointment(index, item.appointment_id)">
                        <label for="appointment">Description: </label>
                        <input class="appointment-description-input input-style" id="appointment" name="appointment" v-model="store.inputDescription" type="text" required><br>
                        <label for="start">Start time: </label>
                        <input class="input-style" id="start" name="start" type="time" v-model="store.inputStartTime" required />
                        <label for="end"> End time: </label>
                        <input class="input-style" id="end" name="end" type="time" v-model="store.inputEndTime" required /><br>
                        <input class="submit button-style" name="submit" type="submit" value="Submit"> <button class="cancel button-style" @click="store.cancelAppointment">Cancel</button>
                    </form>
                </div>          
            </div>
        </TransitionGroup>
        <div id="appointment-add">
            <button class="button-style" @click="store.toggleAddOpen" :disabled="store.editOpen !== undefined">Add</button>  
            <div id="appointment-add-container" v-if="store.addOpen">
                <form class="appointment-form" @submit.prevent="store.addAppointment">
                    <label for="add-appointment">Description: </label>
                    <input class="appointment-description-input input-style" id="add-appointment" name="add-appointment" v-model="store.inputDescription" type="text" required><br>
                    <label for="add-start">Start time: </label>
                    <input class="input-style" id="add-start" name="add-start" type="time" v-model="store.inputStartTime" required @change="store.onTimeChange(store.inputStartTime)" /> 
                    <label for="add-end"> End time: </label>
                    <input class="input-style" id="add-end" name="add-end" type="time" v-model="store.inputEndTime" required /><br>
                    <input class="submit button-style" name="submit" type="submit" value="Submit"> <button class="cancel button-style" @click="store.cancelAddAppointment">Cancel</button>
                </form>
            </div> 
        </div>        
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

.fade-left-enter-active,
.fade-left-leave-active {
    @include mixins.enter-leave;
}

.fade-left-enter-from,
.fade-left-leave-to {
    @include mixins.from-to-left;
}

#appointment-container {
    @include mixins.display-container;
}

.appointment-item {
    @include mixins.item-container;

    @include mixins.mobile {
        flex-direction: column;
    }
}

.time {    
    @include mixins.time-container;
    width: 5.625rem;          
}

.start-time {
    @include mixins.flex-center;
    border-bottom: 0.0625rem solid variables.$white-color;
}

.end-time {
    @include mixins.flex-center;
}

.appointment {
    @include mixins.item-description;

    @include mixins.mobile {
        justify-content: center;
    }
}

.edit-delete {
    @include mixins.edit-delete-container;
}

.appointment-edit {
    position: relative;
    @include mixins.edit-delete;
    margin: 0 0.5rem;
}

.appointment-delete {
    position: relative;
    @include mixins.edit-delete;
}

.tooltip {
    position: absolute;
    background-color: variables.$white-color;
    color: variables.$olive-color;
    padding: 0 0.25rem;
    font-size: 1.25rem;
    z-index: 601;
}

.edit-appointment-container {
    @include mixins.add-container;
    z-index: 901;

    @include mixins.tablet {
        font-size: 1rem;
    }

    @include mixins.mobile {
        font-size: 1rem;
    }
}

.cancel {
    cursor: pointer;
}

.submit {
    cursor: pointer;
}

.appointment-description-input {
    width: 76%;
}

.input-style {
    @include mixins.input-style;
    margin-bottom: 0.5rem;
}

.button-style {
    @include mixins.button-style;
}

#appointment-add {
    @include mixins.add-display;
    z-index: 801;
    min-height: 8.75rem;
}

#appointment-add-container {
    @include mixins.add-container;
    z-index: 701;

    @include mixins.tablet {
        font-size: 1rem;
    }

    @include mixins.mobile {
        font-size: 1rem;
    }
}

.appointment-form {
    width: 100%;
}

</style>
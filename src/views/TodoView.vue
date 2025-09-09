<script setup lang="ts">
import AppointmentDisplay from '../components/AppointmentDisplay.vue';
import NotesDisplay from '../components/NotesDisplay.vue';
import ToDoDisplay from '../components/ToDoDisplay.vue';
import WhiteboardDisplay from '../components/WhiteboardDisplay.vue';

</script>

<template>
    <div id="main-container">
        <div id="appointment-todo-container">
            <div id="schedule-container">
                <AppointmentDisplay />
            </div>
            <div id="to-do-container">
                <ToDoDisplay />
            </div>
        </div>
        <div id="whiteboard-notes-container">
            <div id="whiteboard-container">
                <WhiteboardDisplay />
            </div>
            <div id="notes-container">
                <NotesDisplay />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

#main-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    border-bottom: variables.$borders;
    background-color: variables.$white-color;
}

#appointment-todo-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-width: 20.5rem;
}

#schedule-container {
    width: 50%;
    min-width: 20.5rem;
    padding: 1rem;
    border-right: variables.$borders;
    border-bottom: variables.$borders;

    @include mixins.mobile {
        border-right: none;
        width: 100%;
    }

    @include mixins.tablet {
        border-right: none;
        width: 100%;
    }

    @include mixins.desktop {
        border-right: none;
        width: 100%;
    }
}

#to-do-container {
    width: 50%;
    padding: 1rem;
    border-bottom: variables.$borders;

    @include mixins.mobile {
        width: 100%;
    }

    @include mixins.tablet {
        border-right: none;
        width: 100%;
    }

    @include mixins.desktop {
        border-right: none;
        width: 100%;
    }
}

#whiteboard-notes-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    min-width: 20.5rem;
}

#whiteboard-container {
    width: 50%;
    min-height: 57.0625rem;
    min-width: 20.5rem;
    padding: 1rem;
    border-right: variables.$borders;
    border-bottom: variables.$borders;

    @include mixins.mobile {
        border-right: none;
        width: 100%;
    }

    @include mixins.tablet {
        border-right: none;
        width: 100%;
    }

    @include mixins.desktop {
        border-right: none;
        width: 100%;
    }
}

#notes-container {
    width: 50%;
    min-height: 57.0625rem;
    padding: 1rem;

    @include mixins.mobile {
        width: 100%;
    }

    @include mixins.tablet {
        border-right: none;
        width: 100%;
    }

    @include mixins.desktop {
        border-right: none;
        width: 100%;
    }
}

</style>
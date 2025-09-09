<script setup lang="ts">
import { ref, useTemplateRef, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '../stores/user';
import { useWindowStore } from '../stores/window';

const windowStore = useWindowStore();
const userStore = useUserStore();

const navOpen = ref(false);
const navMenu = useTemplateRef('nav');
const navMenuButton = useTemplateRef('navButton');

const listener = (event: Event) => {
    if (!navMenu.value?.contains(event.target as HTMLElement) && !navMenuButton.value?.contains(event.target as HTMLElement)) {
        navOpen.value = false;
    } else {
        return
    }
}

onMounted(() => {
    window.addEventListener('click', listener);
});

onBeforeUnmount(() => {
    window.removeEventListener('click', listener);
});

const toggleNavOpen = () => {
    navOpen.value = !navOpen.value;
};

const toggleNavClose = () => {
    navOpen.value = false;
    if (windowStore.windowWidth < 687) {
            window.scrollTo(0, 1640);
        }
};

const onClickLogout = () => {
    userStore.onLogout();
    toggleNavClose();
};

</script>

<template>
    <div id="header">
        <div id="nav-image" @click="toggleNavOpen" ref="navButton">
            <img src="../assets/images/nav.png" alt="menu button" />
        </div>
        <div id="title">
            <h1>Daily Planner</h1>
        </div>        
        <div id="nav-container" ref="nav" v-if="navOpen">
            <ul>
                <router-link to="/daily-planner" @click="toggleNavClose"><li>Daily Planner</li></router-link>
                <router-link to="/account" @click="toggleNavClose"><li>Account</li></router-link>
                <router-link to="/forecast" @click="toggleNavClose"><li>Weather Forecast</li></router-link>
                <li v-if="userStore.loggedIn !== null" @click="onClickLogout">Logout</li>
            </ul>
        </div>
    </div>    
</template>

<style lang="scss" scoped>
@use '../assets/css/variables.scss';
@use '../assets/css/mixins.scss';

#header {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 3.125rem;
    background-color: variables.$white-color;
    border-bottom: variables.$borders;    
}

#title {
    width: 100%;
    text-align: center;
    padding-right: 3.125rem;

    h1 {
        color: variables.$olive-color;
        font-size: 2rem;
        font-weight: 600;
    }
}

#nav-image {
    @include mixins.flex-center;
    width: 3.125rem;
    height: 100%;
    text-align: center;
    cursor: pointer;

    img {
        width: 1.875rem;
        height: 1.875rem;
    }
}

#nav-container {
    position: absolute;
    top: 3.125rem;
    left: 0;
    width: 20.4375rem;
    background-color: variables.$white-color;
    border: 0.125rem solid variables.$white-color;

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        padding: 1rem;
        font-weight: bold;
        color: variables.$olive-color;
        cursor: pointer;

        &:hover {
            color: variables.$white-color;
            background-color: variables.$olive-color;
        }
    }

    a {
        color: variables.$olive-color;
        text-decoration: none;
        font-size: 1.5rem;

        &:hover {
            background-color: variables.$olive-color;
            color: variables.$white-color;
        }
    }

}

</style>
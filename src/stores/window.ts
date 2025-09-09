import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useWindowStore = defineStore('window', () => {
    const windowWidth = ref(window.innerWidth);

  return { windowWidth }
});
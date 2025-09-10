import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUrlStore = defineStore('url', () => {
    const url = ref('https://daily-planner-3faa0dc63243.herokuapp.com');

  return { url }
});
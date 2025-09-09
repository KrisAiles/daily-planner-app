import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUrlStore = defineStore('url', () => {
    const url = ref('http://localhost:3000');

  return { url }
});
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUrlStore = defineStore('url', () => {
    const url = ref('https://server.nextbigideamedia.com');

  return { url }
});
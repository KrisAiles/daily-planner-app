import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUrlStore = defineStore('url', () => {
    const url = ref('www.nextbigideamedia.co.uk');

  return { url }
});
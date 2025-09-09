<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import MainHeader from './components/MainHeader.vue';
import SubHeader from './components/SubHeader.vue';
import { useWindowStore } from './stores/window';

const windowStore = useWindowStore();

const scrollPosition = ref(false);
const backToTopHover = ref(false);

function scrollTop() {
  window.scrollTo(0, 0);
  backToTopHover.value = false
}

function setScrollPosition() {
  if (window.scrollY > 100) {
    scrollPosition.value = true;
  } else {
    scrollPosition.value = false;
  }
}

const handleResize = () => {
    windowStore.windowWidth = window.innerWidth;
}

onMounted(() => {
  window.addEventListener('scroll', setScrollPosition);
  window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
  window.removeEventListener('scroll', setScrollPosition)
  window.removeEventListener('resize', handleResize);
})

</script>

<template>
  <header>
    <MainHeader />
  </header>
  <section>
    <SubHeader />
  </section>
  <main>    
    <RouterView v-slot="{ Component }">
      <Transition name="fade-out" mode="out-in" appear>
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <div id="back-to-top" v-if="scrollPosition && !backToTopHover" @mouseover="backToTopHover = true">
    <img src="./assets/images/top.png" alt="Back to top button" />
  </div>
  <div id="back-to-top-hover" v-if="scrollPosition && backToTopHover" @mouseleave="backToTopHover = false" @click="scrollTop">
    <img src="./assets/images/tophover.png" alt="Back to top button" />
  </div>
</template>

<style lang="scss" scoped>
@use './assets/css/mixins.scss';

.fade-out-enter-active,
.fade-out-leave-active {
    @include mixins.enter-leave;
}

.fade-out-enter-from,
.fade-out-leave-to {
    @include mixins.from-to-fade;
}

#back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  opacity: 0.75;
  cursor: pointer;
}

#back-to-top-hover {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  cursor: pointer;
}

</style>

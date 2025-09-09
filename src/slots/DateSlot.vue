<script setup lang="ts">

</script>

<template>
    <div class="date-slot">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
@use '../assets/css/mixins.scss';

.date-slot {
    @include mixins.flex-center;
    width: 2.5rem;
    height: 2.5rem;
}
</style>
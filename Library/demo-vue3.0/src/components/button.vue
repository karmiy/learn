<template>
    <button class='km-button'>
        <slot></slot>
    </button>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'KmButton',
});
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss' scoped>
</style>

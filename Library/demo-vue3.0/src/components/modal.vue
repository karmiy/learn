<template>
    <transition name='fade'>
        <div v-if='open' class='modal'><slot/></div>
    </transition>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Modal',
    props: {
        open: Boolean,
    },
});
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

</style>

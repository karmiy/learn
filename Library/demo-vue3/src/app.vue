<template>
    <div id='app'>
        <teleport to='body'>
            <p>body1.</p>
        </teleport>
        <teleport to='body'>
            <p>body2.</p>
        </teleport>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, onMounted } from 'vue';
// import Header from '@/components/header.vue';

export default defineComponent({
    name: 'Home',
    /* components: {
        Header,
    }, */
    setup() {
        const user = reactive({
            id: 1,
            code: 100,
        });

        onMounted(() => {
            console.log('mounted');
        });

        return {
            ...toRefs(user),
        }
    }
});
</script>

<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<template>
    <div id='app'>
        <Header title='Title'></Header>
        {{name}}
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import Header from '@/components/header.vue';

export default defineComponent({
    name: 'Home',
    components: {
        Header,
    },
    setup() {
        return {
            name: 'k',
        }
    }
});
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

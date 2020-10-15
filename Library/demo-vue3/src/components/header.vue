<template>
    <div class='header'>
        <h1 @click='fn'>{{title}}</h1>
        <teleport to='body'>
            <div id='content'>
                <p>this will be moved to #app2.</p>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Header',
    props: {
        title: String,
    },
    setup() {

        return 1;
    },
    methods: {
        fn() {
            console.log(this);
        }
    }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>

<template>
    <div class='header'>
        <h1 @click='fn'>{{title}}</h1>
        <input type='text' v-model='id' />
        <!-- <teleport to='body'>
            <div id='content'>
                <p>this will be moved to #app2.</p>
            </div>
        </teleport> -->
    </div>
</template>

<script lang='ts'>
import { defineComponent, onRenderTriggered, onRenderTracked, ref } from 'vue';

export default defineComponent({
    name: 'Header',
    props: {
        title: String,
    },
    setup() {
        const id = ref(1);

        onRenderTracked((e) => {
            console.log('onRenderTracked', e);
        });

        onRenderTriggered((e) => {
            console.log('onRenderTriggered', e);
        });

        return {
            id,
        }
    },
    methods: {
        fn() {
            console.log(this);
        }
    }
});
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss'>
h3 {
  margin: 40px 0 0;
}

.header {
    font-size: 40px;
}
</style>

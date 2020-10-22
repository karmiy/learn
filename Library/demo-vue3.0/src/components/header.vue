<template>
    <div class='header'>
        <h1 @click='fn'>
            <slot></slot>
        </h1>
        <input type='text' v-model='id' />
        <Modal :open='true'>modal</Modal>
        <!-- <teleport to='body'>
            <div id='content'>
                <p>this will be moved to #app2.</p>
            </div>
        </teleport> -->
    </div>
</template>

<script lang='ts'>
import { defineComponent, ref, getCurrentInstance } from 'vue';
import Modal from './modal.vue';

export default defineComponent({
    name: 'Header',
    props: {
        title: String,
    },
    components: {
        Modal,
    },
    setup() {
        const id = ref(1);

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
<style lang='scss' scoped>
h3 {
  margin: 40px 0 0;
}

.header {
    font-size: 40px;
}

::v-slotted(.title) {
    color: yellowgreen;
}
</style>

<template>
    <div class='header'>
        <h1 @click='fn'>
            <slot></slot>
        </h1>
        {{messages}}
        {{userId}}
        <input type='text' v-model='userId' />
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
import { messages, userId } from '../observable';

export default defineComponent({
    name: 'Header',
    components: {
        Modal,
    },
    setup() {
        const id = ref(1);

        setTimeout(() => {
            messages.length = 12;
            userId.value = '39214';
        }, 2000);

        return {
            id,
            messages,
            userId,
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

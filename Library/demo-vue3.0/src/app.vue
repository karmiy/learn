<template>
    <div id='app'>
        <!-- <Header>
            <span class='title'>{{title}}</span>
        </Header> -->
        {{id}}
        {{code}}
        <input type='text' v-model='id' />
        <input type='text' v-model='code' />
        <button @click='stop'>stop watch</button>
        <!-- <input type='text' v-model='title' /> -->
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs, watch, watchEffect } from 'vue';
import Header from '@/components/header.vue';
import UserInfo from '@/components/user-info.vue';

const request = (id: number) => {
    const timer = setTimeout(() => {
        console.log('请求数据, id: ' + id);
    }, 1000);

    return () => clearTimeout(timer);
}

export default defineComponent({
    name: 'App',
    components: {
        Header,
        UserInfo,
    },
    setup() {
        const user = reactive({
            id: 1,
            code: 100,
            title: 't',
        });

        const stop = watch(() => user.id, async (id) => {
            console.log(id);
        }, {
            onTrack() {
                console.log('onTrack');
            },
            onTrigger() {
                console.log('onTrigger');
            },
        });

        return {
            ...toRefs(user),
            stop,
        }
    }
});
</script>

<style lang='scss' scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
::v-global(.test) {
    color: red;
}

#app ::v-global(.header h1) {
    // color: pink;
}

/* .title {
    color: pink;
} */
</style>

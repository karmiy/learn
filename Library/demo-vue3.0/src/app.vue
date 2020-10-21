<template>
    <div id='app'>
        <!-- <Header>
            <span class='title'>{{title}}</span>
        </Header> -->
        {{id}}
        {{code}}
        <input type='text' v-model='id' />
        <input type='text' v-model='code' />
        <!-- <button-counter></button-counter> -->
        <!-- <input type='text' v-model='title' /> -->
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, ref, toRef, isProxy, shallowReactive, isReactive, isRef } from 'vue';
import Header from '@/components/header.vue';
import UserInfo from '@/components/user-info.vue';

const isObject = (val: any): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export default defineComponent({
    name: 'App',
    components: {
        Header,
        UserInfo,
    },
    setup() {
        const rawUser = {
            id: 1,
            code: 100,
            title: 't',
        };
        const user = reactive(rawUser);

        // console.log(toRef(user, 'id'));
        // console.log(ref(1));
        // console.log(isObject(ref(1)));

        /* const u = {
            id: 1,
            code: 100,
            title: 't',
        };

        const _u = ref(u);
        _u.value.id = 2;

        console.log(u.id, _u.value.id);

        u.id = 3;
        console.log(u.id, _u.value.id);

        console.log(_u.value); */

        const idRef = ref(10);
        const u = reactive({
            id: idRef,
        });

        u.id = 100;
        console.log(idRef.value);

        return {
            ...toRefs(user),
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

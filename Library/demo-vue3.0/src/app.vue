<template>
    <div id='app'>
        <!-- <Header>
            <span class='title'>{{title}}</span>
        </Header> -->
        {{id}}
        {{code}}
        {{valueRef}}
        <input type='text' v-model='valueRef' />
        <input type='text' v-model='code' />
        <!-- <button-counter></button-counter> -->
        <!-- <input type='text' v-model='title' /> -->
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, ref, toRef, isProxy, shallowReactive, isReactive, isRef, customRef } from 'vue';
import Header from '@/components/header.vue';
import UserInfo from '@/components/user-info.vue';

function useDebouncedRef(value: string, delay = 200) {
    let timeout: ReturnType<typeof setTimeout>;
    
    return customRef((track, trigger) => {
        return {
            get() {
                // 初始化手动追踪依赖讲究什么时候去触发依赖收集
                track();
                return value;
            },
            set(newValue: string) {
                console.log(newValue);
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    value = newValue;
                    // 再有依赖追踪的前提下触发响应式
                    trigger();
                }, 500)
            },
        }
    });
}

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

        let timeout: ReturnType<typeof setTimeout>;

        let value = 'k';

        const valueRef = customRef((track, trigger) => {
            return {
                get() {
                    // 初始化手动追踪依赖讲究什么时候去触发依赖收集
                    track();
                    return value;
                },
                set(newValue: string) {
                    value = newValue;
                    // 再有依赖追踪的前提下触发响应式
                    trigger();
                },
            }
        });

        return {
            ...toRefs(user),
            valueRef,
            // value: useDebouncedRef('k'),
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

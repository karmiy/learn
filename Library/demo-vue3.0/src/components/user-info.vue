<template>
    <div class='user-info'>
        <input type='text' :value='name' @input='onNameChange' />
        <br>
        <input type='text' :value='age' @input='onAgeChange' />
        <br>
        <input type='text' :value='code' @input='onCodeChange' />
    </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UserInfo',
    props: {
        name: String,
        age: Number,
        code: Number,
    },
    emits: {
        codeChange: (value: number) => true,
        'update:name': (value: string) => true,
        'update:age': (value: number) => true,
    },
    setup(props, { emit }) {
        const onNameChange = (e: { target: HTMLInputElement }) => {
            emit('update:name', e.target.value);
        };

        const onAgeChange = (e: { target: HTMLInputElement }) => {
            emit('update:age', +e.target.value);
        };

        const onCodeChange = (e: { target: HTMLInputElement }) => {
            emit('codeChange', +e.target.value);
        };

        return {
            onNameChange,
            onAgeChange,
            onCodeChange,
        }
    },
});
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
h3 {
  margin: 40px 0 0;
}
</style>

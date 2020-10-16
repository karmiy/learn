<template>
    <div class='user-info'>
        <input type='text' :value='name' @input='onNameChange' />
        <br>
        <input type='text' :value='age' @input='onAgeChange' />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'UserInfo',
    props: {
        name: String,
        age: Number,
    },
    setup(props, { emit }) {
        const onNameChange = (e: { target: HTMLInputElement }) => {
            emit('update:name', e.target.value);
        };

        const onAgeChange = (e: { target: HTMLInputElement }) => {
            emit('update:age', +e.target.value);
        };

        return {
            onNameChange,
            onAgeChange,
        }
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>

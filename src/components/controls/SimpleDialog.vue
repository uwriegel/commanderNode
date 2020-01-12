<template>
    <div class="container">
        <input ref=input v-if="data.input" v-model="data.inputText" v-selectall v-select-name-only="data.selectOnlyNameInInput">
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: [ "data" ],
    methods: {
        getFocusables() {
           return this.$refs.input ? [ this.$refs.input ] : []
        },
        getFocusIndex(buttonCount: number) {
           return this.$refs.input ? buttonCount : 0
       },
       getInputText() { return this.data.inputText },
       getDefaultButton(defBtn: number) { return defBtn }
   }
})
</script>

<style scoped>
.container {
    flex-grow: 1;
    max-width: 400px;    
}
input {
    background-color: var(--main-background-color);
    color: var(--main-color);
    border-color: var(--dialog-input-border-color);
    border-width: 1px;
}
input:focus {
    outline-color: var(--dialog-input-outline-color);
}
</style>


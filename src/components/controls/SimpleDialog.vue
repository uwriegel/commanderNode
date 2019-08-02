<template>
    <div class="container">
        <p>{{data.text}}</p>    
        <!-- <input appDefaultButton [defaultButton]="defaultButton" *ngIf="withInput" appSelectAll [selectNameOnly]="selectNameOnly"> -->
        <input ref=input v-if="data.input">
    </div>
</template>

<script>

export default {
    props: [ "data" ],
    methods: {
        getFocusables() {
            return this.$refs.input ? [ this.$refs.input ] : []
        },
        getFocusIndex(buttonCount) {
            return this.$refs.input ? buttonCount : 0
        }
    }
}   
</script>

<style scoped>
.container {
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


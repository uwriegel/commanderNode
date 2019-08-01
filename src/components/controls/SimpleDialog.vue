<template>
    <div>
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
input {
    background-color: var(--main-background-color);
    color: var(--main-color);
    border-width: 1px;
}
</style>


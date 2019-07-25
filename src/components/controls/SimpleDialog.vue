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

            // TODO: initial focus
            // TODO: Default Button
            // TODO: keyboard input to input, if focused
            return this.$refs.input ? [ this.$refs.input ] : []
        }
    }
}   
</script>

<style scoped>

</style>


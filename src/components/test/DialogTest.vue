<template>
    <div>
        <h1>DialogTest</h1>
        <p>
            <button v-on:click=onShow>Show Dialog</button>
        </p>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { showDialog } from '../controls/MainDialog.vue'

export default Vue.extend({
    methods: {
        async onShow() {
            const result = await showDialog({
                ok: true, 
                cancel : true,
                defButton: "ok",
                text: "Der Text des Dialoges", 
                simpleDialog: { 
                    input: true, 
                    inputText: "Der Vorschlag"
                }
            })
            console.log("Dialog result", result)
        }
    }
})
</script>

<style scoped>

</style>
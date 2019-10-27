<template>
    <div class="root">
        <p>
            <button @click=onBtn1>Bild 1</button>
            <button @click=onBtn2>Bild 2</button>
            <button @click=onBtn3>Nichts</button>
            <button @click=onBtn4>PDF</button>
        </p>
        <viewer class="viewer" :src=src :path=path></viewer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Viewer from '../controls/Viewer.vue'

export default Vue.extend({
    data() {
        return {
            src: "",
            path: ""
        }
    },
    components: {
        Viewer
    },
    methods:{
        onBtn1() {
            this.src = "C:\\Users\\urieg\\OneDrive\\Bilder\\desktop\\20131116_095204.jpg"
        },
        onBtn2() {
            this.src = "A:\\Bilder\\1967\\Bild011.jpg"
        },
        onBtn3() {
            this.src = ""
        },
        onBtn4() {
            this.src = "C:\\Users\\urieg\\documents\\NuGet 2 Essentials.pdf"
        }
    }
})
</script>

<style scoped>
.root {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}
.viewer {
    flex-grow: 1;
}
</style>

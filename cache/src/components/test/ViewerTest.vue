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

<script>
import Viewer from '../controls/Viewer'

export default {
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
            this.path = "C:\\Users\\urieg\\OneDrive\\Bilder\\desktop"
            this.src = "20131116_095204.jpg"
        },
        onBtn2() {
            this.src = "Bild02.jpg"
        },
        onBtn3() {
            this.src = ""
        },
        onBtn4() {
            this.path = "C:\\Users\\urieg\\documents"
            this.src = "NuGet 2 Essentials.pdf"
        }
    }
}
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

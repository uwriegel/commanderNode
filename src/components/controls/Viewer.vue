<template>
    <div class="viewer">
        <img :src="'vue://' + itemPath" v-if="isImage(itemPath)">
        <!-- <iframe :src="'vue://' + itemPath" frameBorder="0" v-if="isPdf(itemPath)"></iframe> -->
        <!-- <video :src="'vue://' + itemPath" controls autoplay v-if="isVideo(itemPath)"></video> -->
        <video src="http://localhost:9865/test/allein.mp4" controls autoplay></video>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

// TODO: Directory overview
// TODO: source code view
// TODO: Media player
export default Vue.extend({
    props: {
        src: String
    },
    data() {
        return {
            itemPath: "",
            timer: undefined as NodeJS.Timeout|undefined,
        }
    },
    watch: {
        src() {
            if (this.timer)
                clearTimeout(this.timer)
            this.timer = setTimeout(() => this.itemPath = this.src, 100)
        }
    },
    mounted() { this.itemPath = this.src },
    methods: {
        isImage(value: string) {
            return value.toLowerCase().endsWith('jpg')
        },
        isVideo(value: string) {
            return value.toLowerCase().endsWith('mp4') || value.toLowerCase().endsWith('mpg')
        },
        isPdf(value: string) {
            return value.toLowerCase().endsWith('pdf')
        }
    }
})
</script>

<style scoped>
.viewer {
    position: relative;
}
img {
    position: absolute;
    display: block;
    max-width: 100%;
    height: auto;
    max-height: 100%;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;    
}
</style>




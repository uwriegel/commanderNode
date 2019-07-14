<template>
    <div class="viewer">
        <img :src="'vue://' + itemPath" v-if="isImage(itemPath)">
    </div>
</template>

<script>
import Vue from 'vue'

// TODO: Directory overview
// TODO: source code view
export default {
    props: [
        "src",
        "path"
    ],
    data() {
        return {
            itemPath: ""
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
        isImage(value) {
            return value.toLowerCase().endsWith('jpg')
        }
    }
}
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




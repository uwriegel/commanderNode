<template>
    <div class="viewer">
        <img :src="src | getFile(path)" v-if="isImage(src)">
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    props: [
        "src",
        "path"
    ],
    filters: {
        getFile(value, path) {
            return "vue://" + path + (path.endsWith('\\') ? "" : "\\") + value
        }
    },
    methods: {
        isImage(value) {
            return value.toLowerCase().endsWith('jpg')
        }
    }
}
</script>

<style scoped>
.viewer {
    background-color: red;
}
img {
    display: block;
    margin: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
}
iframe {
    display: block;
    width: 100%;
    height: 100%;    
}
</style>




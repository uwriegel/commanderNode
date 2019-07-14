<template>
    <div class="viewer">
        <img :src="'vue://' + src" v-if="isImage(src)">
    </div>
</template>

<script>
import Vue from 'vue'
// TODO: decouple src-prop from src attribute: data-object imgPath: setTimeout imgPath =src
// TODO: img in div with position relative
// TODO: Directory overview
// TODO: source code view
export default {
    props: [
        "src",
        "path"
    ],
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
</style>




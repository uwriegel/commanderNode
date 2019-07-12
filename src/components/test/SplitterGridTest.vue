<template>
    <div class="root">
        <splitter-grid :isVertical=true>
            <template v-slot:first>
                <splitter-grid>
                    <template v-slot:first>
                        <!-- <div class="upper"></div> -->
                        <folder class="folder" id="test1"></folder>
                    </template>
                    <template v-slot:second>
                        <!-- <div class="lower"></div> -->
                        <folder class="folder" id="test2"></folder>
                    </template>
                </splitter-grid>
            </template>
            <template v-slot:second>
                <div class="left"></div>
            </template>
        </splitter-grid>
    </div>
</template>

<script>
import SplitterGrid from '../controls/SplitterGrid'
import Folder from '../controls/Folder'

export default {
    components: {
        SplitterGrid,
        Folder
    }
}
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.upper {
    background-color: chartreuse;
    flex-grow: 1;
}
.lower {
    background-color: blueviolet;
    flex-grow: 1;
}
.left {
    background-color: yellow;
    flex-grow: 1;
}
.right {
    background-color: red;
    flex-grow: 1;
}
</style>

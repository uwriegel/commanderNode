<template>
    <div class="root">
        <splitter-grid :isVertical=true :isSecondInvisible="isHidden" @splitter-position-changed="viewerHeightChanged">
            <template v-slot:first>
                <splitter-grid>
                    <template v-slot:first>
                        <div class="left">
                            <p>
                                <button @click="onHide">Verbergen</button>
                            </p>
                        </div>
                        <!-- <folder class="folder" id="test1"></folder> -->
                    </template>
                    <template v-slot:second>
                        <div class="right"></div>
                        <!-- <folder class="folder" id="test2"></folder> -->
                    </template>
                </splitter-grid>
            </template>
            <template v-slot:second>
                <div class="lower"></div>
            </template>
        </splitter-grid>
    </div>
</template>

<script>
import SplitterGrid from '../controls/SplitterGrid'
import Folder from '../controls/Folder'

export default {
    data() {
        return {
            isHidden: false
        }
    },
    components: {
        SplitterGrid,
        Folder
    },
    methods: {
        onHide() {
            this.isHidden = !this.isHidden
        },
        viewerHeightChanged() {
            console.log("new viewer height")
        }
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

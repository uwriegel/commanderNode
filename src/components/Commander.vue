<template>
    <div class="commander">
        <splitter-grid :isVertical=true :isSecondInvisible="isHidden" @splitter-position-changed="viewerHeightChanged">
            <template v-slot:first>
                <splitter-grid>
                    <template v-slot:first>
                        <folder ref="leftFolder" class="folder" id="left"></folder>
                    </template>
                    <template v-slot:second>
                        <folder ref="rightFolder" class="folder" id="right"></folder>
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
import SplitterGrid from './controls/SplitterGrid'
import Folder from './controls/Folder'

// TODO: tab changes focus from left to right to left
// TODO: Menu command set focus: focuses input, not folder
// TODO: Viewer connected to path
// TODO: Viewer splitter changes: resize folders
// TODO: Status displays actual selection or # selected items
// TODO: input in folder: mixes with restrictions!
// TODO: input in folder: on change has to focus table
// TODO: Change theme crashes controlling folders
export default {
    data() {
        return {
            isHidden: true
        }
    },
    components: {
        SplitterGrid,
        Folder
    },
    mounted() {
        this.$refs.leftFolder.focus()
    },
    methods: {
        viewerHeightChanged() {
            console.log("new viewer height")
        }
    }
}
</script>

<style scoped> 
.commander {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
.folder {
    flex-grow: 1;
}
</style>

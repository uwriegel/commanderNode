<template>
    <div class="commander" @keydown=onKeyDown>
        <splitter-grid :isVertical=true :isSecondInvisible="isHidden" @splitter-position-changed="viewerHeightChanged">
            <template v-slot:first>
                <splitter-grid>
                    <template v-slot:first>
                        <folder ref="leftFolder" class="folder" id="left" @onFocusIn=onLeftFocus ></folder>
                    </template>
                    <template v-slot:second>
                        <folder ref="rightFolder" class="folder" id="right" @onFocusIn=onRightFocus></folder>
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

// TODO: Viewer connected to path
// TODO: Viewer splitter changes: resize folders
// TODO: Status displays actual selection or # selected items
// TODO: Change theme crashes controlling folders
export default {
    data() {
        return {
            isHidden: true,
            leftHasFocus: true
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
        },
        onKeyDown(evt) {
            if (evt.which == 9 && !evt.shiftKey && evt.target.tagName != "INPUT") {
                const folder = this.leftHasFocus ? this.$refs.rightFolder : this.$refs.leftFolder
                folder.focus()
                evt.preventDefault()
            }
        },
        onLeftFocus() { this.leftHasFocus = true },
        onRightFocus() { this.leftHasFocus = false }
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

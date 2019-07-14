<template>
    <div class="commander" @keydown=onKeyDown>
        <splitter-grid :isVertical=true :isSecondInvisible="!showViewer" @splitter-position-changed="viewerHeightChanged">
            <template v-slot:first>
                <splitter-grid>
                    <template v-slot:first>
                        <folder ref="leftFolder" class="folder" id="left" @focus-in=onLeftFocus @selection-changed=onSelectionChanged></folder>
                    </template>
                    <template v-slot:second>
                        <folder ref="rightFolder" class="folder" id="right" @focus-in=onRightFocus @selection-changed=onSelectionChanged></folder>
                    </template>
                </splitter-grid>
            </template>
            <template v-slot:second>
                <viewer class="viewer" :src=selectedItem></viewer>
            </template>
        </splitter-grid>
    </div>
</template>

<script>
import SplitterGrid from './controls/SplitterGrid'
import Folder from './controls/Folder'
import Viewer from './controls/Viewer'
import { mapState } from 'vuex'

// TODO: Viewer splitter changes: resize folders
// TODO: Status displays actual selection or # selected items
// TODO: Change theme crashes controlling folders
export default {
    data() {
        return {
            leftHasFocus: true,
            selectedItem: ""
        }
    },
    components: {
        SplitterGrid,
        Folder,
        Viewer
    },
    computed: {
        // ...
        // mix this into the outer object with the object spread operator
        ...mapState(['showViewer'])
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
        onLeftFocus() { 
            this.leftHasFocus = true 
            this.selectedItem = this.$refs.leftFolder.getSelectedItem()
        },
        onRightFocus() 
        { 
            this.leftHasFocus = false 
            this.selectedItem = this.$refs.rightFolder.getSelectedItem()
        },
        onSelectionChanged(newItem) {
            this.selectedItem = newItem
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
.viewer {
    flex-grow: 1;
}
</style>

<template>
    <div id="app">
        <!-- <column-test></column-test> -->
        <!-- <scrollbar-test></scrollbar-test> -->
        <!-- <table-view-test></table-view-test> -->
        <!-- <addon></addon> -->
        <!-- <connection-test></connection-test> -->
        <!-- <folder-test></folder-test> -->
        <!-- <splitter-grid-test></splitter-grid-test> -->
        <!-- <viewer-test></viewer-test> -->
        <commander></commander>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Commander from './components/Commander.vue'
const electron = (window as any).require('electron')

// Tests
// import ColumnTest from './components/test/ColumnTest.vue'
// import ScrollbarTest from './components/test/ScrollbarTest.vue'
// import TableViewTest from './components/test/TableViewTest.vue'
// import Addon from './components/test/Addon.vue'
// import ConnectionTest from './components/test/ConnectionTest'
// import FolderTest from './components/test/FolderTest.vue'
// import SplitterGridTest from './components/test/SplitterGridTest.vue'
// import ViewerTest from './components/test/ViewerTest.vue'

export default Vue.extend({
    name: 'app',
    components: {
        Commander,
        // Tests:
        // ColumnTest,
        // ScrollbarTest,
        // TableViewTest,
        // Addon,
        // FolderTest,
        // SplitterGridTest,
        // ViewerTest
    },
    mounted: function () {
        electron.ipcRenderer.on("SHOWHIDDEN", (event: any , data: boolean)=> {
            this.$store.commit('setShowHidden', this.$store.state.showHidden = data)
        })
        electron.ipcRenderer.on("PREVIEW", (event: any , data: boolean)=> {
            this.$store.commit('setShowViewer', this.$store.state.showViewer = data)
        })
    }
})
</script>

<style>
body {
    background-color: var(--main-background-color);
    color: var(--main-color); 
    font-family: sans-serif;
    font-size: var(--font-size);
    overflow:hidden;
    height: 100vh;
    padding: 0px;
    margin: 0px;    
}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    display: flex;
    flex-direction: column;
    /* border-top: var(--vue-electron-titlebar-top-height) solid transparent; */
}
</style>

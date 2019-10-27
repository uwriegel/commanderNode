<template>
    <div class="root">
        <h3>Folder Test</h3>
        <folder :eventBus="folderEventBus" class="folder" id="test"></folder>
        <footer>Status</footer>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Folder from '../controls/Folder.vue'

export default Vue.extend({
    components: {
        Folder
    },
    data() {
        return {
            folderEventBus: new Vue()
        }
    },
    mounted() { this.folderEventBus.$emit("focus") }
})
</script>

<style scoped>
.root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
} 
.folder {
    flex-grow: 1;
    margin: 10px 50px;
}
footer {
    margin: 10px;
}
</style>

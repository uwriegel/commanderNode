<template>
    <div>
        <button @click="onTest">Test</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import filesystem from '../../extensionFs'

export default {
    methods: {
        async onTest() {
            const files = await filesystem.getFiles("c:\\windows")
            files.forEach(item => {
                console.log(item.name, item.time, item.size, item.isDirectory)
            });
            console.log("Hallo")
        }
    }
    
}
</script>

<style>

</style>
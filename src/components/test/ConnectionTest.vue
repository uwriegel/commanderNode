<template>
    <div>
        <h1>Verbindungstest</h1>
        <button @click=onClick>"Get c:\windows\system32"</button>
    </div>
</template>

<script>

// TODO: Test production build
export default {
    name: "connection-test",
    methods: {
        async onClick() {
            const extfs = window.require(extFs)
            const result = await extfs.getFiles(`c:\\windows\\system32`)
            console.log(result)
        }
    }
}
</script>

<style scoped>

</style>

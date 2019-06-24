<template>
    <div class="main">
        <h1>Scrollbar Test</h1>
        <div class="list">
            <div v-for="item in items" :key="item">{{item}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "scrollbar-test",
    computed: {
        items () {
            return Array.from(Array(100).keys()).map((n, i) => `Item # ${i}`)
        }
    }
}
</script>

<style scoped>
    .main {
        display: flex;
        flex-direction: column;
    }
    .list {
        margin: 20px;
        flex-grow: 1;
        overflow: hidden;
    }
</style>

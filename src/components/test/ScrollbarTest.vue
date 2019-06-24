<template>
    <div class="main">
        <h1>Scrollbar Test</h1>
        <div>
            <input type="number" @change="onChange" placeholder="Items count" />
            <div>Message is: {{ itemsCount }}</div>
        </div>
        <scrollbar></scrollbar>
        <div class="list" ref="list">
            <div v-for="item in items" :key="item">{{item}}</div>
        </div>
    </div>
</template>

<script>
import Scrollbar from "./../controls/Scrollbar"

const itemHeight = 14

export default {
    name: "scrollbar-test",
    components: {
        Scrollbar
    },
    data: function () {
        return {
            itemsCount: 0
        }
    },
    computed: {
        items () {
            return Array.from(Array(this.itemsCount).keys()).map((n, i) => `Item # ${i}`)
        }
    },
    methods: {
        onChange: function (evt) {
            this.itemsCount = parseInt(evt.srcElement.value)
        },
        onResize: function (evt) {
            const itemCount = this.$refs.list.clientHeight / itemHeight
            console.log("resize", itemCount)
        }
    },
    created: function () {
        window.addEventListener("resize", this.onResize)
    },
    destroyed: function () {
        window.removeEventListener("resize", this.onResize)
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
        border-color: gray;
        border-style: solid;
        border-width: 1px;
    }
</style>

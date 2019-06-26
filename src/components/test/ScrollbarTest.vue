<template>
    <div class="main">
        <h1>Scrollbar Test</h1>
        <div>
            <input type="number" @change="onChange" placeholder="Items count" />
            <div>Message is: {{ itemsCount }}</div>
        </div>
        <div class=listcontainer>
            <div class="list" ref="list">
                <div v-for="item in items" :key="item">{{item}}</div>
            </div>
            <scrollbar :range="range"></scrollbar>
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
            itemsCount: 0,
            range: 0
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
            this.onResize()
        },
        onResize: function () {
            const itemCount = this.$refs.list.clientHeight / itemHeight
            console.log("resize", itemCount)
            this.range = Math.ceil(Math.max(0, this.items.length - itemCount))
            console.log(this.range)
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
    .listcontainer {
        margin: 20px;
        position: relative;
        flex-grow: 1;
        overflow: hidden;

        border-color: gray;
        border-style: solid;
        border-width: 1px;
    }
    .list {
        position: absolute;
        height: 100%;
        width: 100%;        
    }
</style>

<template>
    <div class="main">
        <h1>Scrollbar Test</h1>
        <div>
            <input type="number" @change="onChange" placeholder="Items count" />
            <div>Message is: {{ totalCount }}</div>
        </div>
        <div class=listcontainer>
            <div class="list" ref="list">
                <div v-for="item in items" :key="item">{{item}}</div>
            </div>
            <scrollbar :totalCount="totalCount" :itemsPerPage="itemsPerPage"></scrollbar>
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
            totalCount: 0,
            itemsPerPage: 0
        }
    },
    computed: {
        items () {
            return Array.from(Array(this.totalCount).keys()).map((n, i) => `Item # ${i}`)
        }
    },
    methods: {
        onChange: function (evt) {
            this.totalCount = parseInt(evt.srcElement.value)
            onResize()
        },
        onResize: function () {
            this.itemsPerPage = this.$refs.list.clientHeight / itemHeight
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

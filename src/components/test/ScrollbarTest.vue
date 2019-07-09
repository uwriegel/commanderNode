<template>
    <div class="main">
        <h1>Scrollbar Test</h1>
        <div>
            <input type="number" @change="onChange" placeholder="Items count" />
            <div>Message is: {{ totalCount }}</div>
        </div>
        <div class=listcontainer>
            <div class="list" ref="list" @mousewheel="onMouseWheel">
                <div v-for="item in items" :key="item">{{item}}</div>
            </div>
            <scrollbar :totalCount="totalCount" :itemsPerPage="itemsPerPage" :parentHeight="height" v-model='position'>
            </scrollbar>
        </div>
    </div>
</template>

<script>
import Scrollbar from "./../controls/Scrollbar"

const itemHeight = 14

export default {
    components: {
        Scrollbar
    },
    data: function () {
        return {
            position: 0,
            totalCount: 0,
            itemsPerPage: 0,
            height: 0,
            totalItems: [],
            startIndex: 0
        }
    },
    watch: {
        position: function (newVal, oldVal) { this.startIndex = newVal }
    },
    computed: {
        items () {
            return this.totalItems.slice(this.startIndex, this.startIndex + this.itemsPerPage + 1)
        }
    },
    methods: {
        onChange: function (evt) {
            this.totalCount = parseInt(evt.srcElement.value)
            this.totalItems = Array.from(Array(this.totalCount).keys()).map((n, i) => `Item # ${i}`)
            this.onResize()
        },
        onResize: function () {
            this.height = this.$refs.list.clientHeight
            this.itemsPerPage = Math.floor(this.height / itemHeight)
        },
        onMouseWheel: function (evt) { this.$emit('mousewheel', evt) }
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

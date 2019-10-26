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

<script lang="ts">
import Vue from 'vue'
import Scrollbar from "../controls/Scrollbar.vue"

const itemHeight = 14

export default Vue.extend({
    components: {
        Scrollbar
    },
    data() {
        return {
            position: 0,
            totalCount: 0,
            itemsPerPage: 0,
            height: 0,
            totalItems: [] as string[],
            startIndex: 0
        }
    },
    watch: {
        position: function (newVal, oldVal) { this.startIndex = newVal }
    },
    computed: {
        items(): string[] {
            return this.totalItems.slice(this.startIndex, this.startIndex + this.itemsPerPage + 1)
        }
    },
    methods: {
        onChange: function (evt: Event) {
            this.totalCount = parseInt((evt.srcElement as HTMLInputElement).value)
            this.totalItems = Array.from(Array(this.totalCount).keys()).map((n, i) => `Item # ${i}`)
            this.onResize()
        },
        onResize: function () {
            this.height = (this.$refs.list as HTMLElement).clientHeight
            this.itemsPerPage = Math.floor(this.height / itemHeight)
        },
        onMouseWheel: function (evt: MouseEvent) { this.$emit('mousewheel', evt) }
    },
    created: function () {
        window.addEventListener("resize", this.onResize)
    },
    destroyed: function () {
        window.removeEventListener("resize", this.onResize)
    }
})
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

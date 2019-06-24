<template>
    <div class="main">
        <h1>Scrollbar Test</h1>
        <p>
            <input type="number" @change="onChange" placeholder="Items count">
            <p>Message is: {{ itemsCount }}</p>
            <!-- <input type="number" v-model="itemsCount"/>
            <div>{{itemsCount}}</div> -->
        </p>
        <div class="list">
            <div v-for="item in items" :key="item">{{item}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "scrollbar-test",
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

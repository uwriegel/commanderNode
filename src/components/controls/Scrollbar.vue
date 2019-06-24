<template>
    <div>Die Skrollbar {{affe}}</div>
</template>

<script>
export default {
    name: "scrollbar",
    props: [
        'affe'
    ],
    methods: {
        onResize: function (evt) {
            console.log("resize", evt)
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

<style>

</style>

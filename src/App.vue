<template>
    <div id="app">
        <main-menu />
        <div class="main">Main Content</div>
    </div>
</template>

<script>
import MainMenu from './components/menu/MainMenu.vue'

const root = document.documentElement

export default {
    name: 'app',
    components: {
        MainMenu
    },
    methods: {
        onChange: function() {
            console.log(getComputedStyle(document.body).getPropertyValue('--main-color'))
            root.style.setProperty('--main-color', 'red')
            console.log("Geändert 3")
        }
    }
}
</script>

<style>
    @import 'assets/css/theme.css';
body {
    background-color: var(--main-color);
    font-family: sans-serif;
    font-size: 75%;
    overflow:hidden;
    height: 100vh;
    padding: 0px;
    margin: 0px;    
}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.main {
    background-color: lightblue;
    flex-grow: 1;   
    margin: 3px;
}
</style>

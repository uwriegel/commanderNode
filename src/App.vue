<template>
    <div id="app">
        <main-menu />
        <div class="main">
            <div>Main Content</div>
            <p>
                <input type="text">
            </p>
            <p>
                <input type="text">
            </p>
        </div>
    </div>
</template>

<script>
import MainMenu from './components/menu/MainMenu.vue'

export default {
    name: 'app',
    components: {
        MainMenu
    }
}
</script>

<style>
    @import 'assets/css/theme.css';
body {
    background-color: var(--main-background-color);
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
    flex-grow: 1;   
    margin: 3px;
}
</style>

<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <button @click="onChange">Ändere</button>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

const root = document.documentElement

export default {
  name: 'app',
  components: {
    HelloWorld
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
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import "/assets/main.scss";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script lang="ts">
import Vue from "vue";
var json = require("@/static/content.json");
// @ is an alias to /src

export default Vue.extend({
  name: "home"
});
</script>

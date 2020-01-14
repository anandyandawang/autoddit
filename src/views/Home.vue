<template>
  <div class="home">
    <b-container fluid class="p-5">
      <b-row>
        <b-col>component usage:</b-col>
      </b-row>
      <b-row>
        <b-col>
          <hello-world msg="TEXT THAT IS REACTIVE TO SCREEN SIZE"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>stuff from content.json: {{ json.example }}</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
</style>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
var json = require("@/static/content.json");
// @ is an alias to /src

export default Vue.extend({
  name: "home",
  components: {
    HelloWorld
  },
  data() {
    return {
      json: {}
    };
  },
  mounted() {
    this.json = json;
    console.log(json);
  }
});
</script>
`
<template>
  <div class="home">
    <b-container fluid class="p-5">
      <b-row class="m-2" v-for="threadObj in threadObjs" v-bind:key="threadObj.title">
        <b-col>
          <b-row>{{ threadObj.title }}</b-row>
          <b-row>
            {{ threadObj.media }}
            <img class="media" :src="threadObj.media" />
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
.media {
  max-height: 40vh;
}
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
      threadObjs: Array()
    };
  },
  created() {
    let vm = this;
    vm.getPostsAndComments("all", "hot");
  },
  methods: {
    async getPostsAndComments(subredditName: string, sortBy: string) {
      const response = await fetch(
        "https://www.reddit.com/r/" + subredditName + "/" + sortBy + ".json"
      );
      const responseJson = await response.json();

      const threads = responseJson.data.children;
      let threadObjs = Array();
      threads.forEach(async function(thread: any) {
        let link =
          "https://www.reddit.com" + thread.data.permalink + ".json?limit=3";
        console.log(link);
        const response = await fetch(link);
        const responseJson = await response.json();

        let threadObj = {
          title: responseJson[0].data.children[0].data.title,
          media: responseJson[0].data.children[0].data.url
        };

        threadObjs.push(threadObj);
      });

      this.threadObjs = threadObjs;
    }
  }
});
</script>
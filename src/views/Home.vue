<template>
  <div class="home">
    <b-container fluid class="p-5">
      <b-row class="m-5" v-for="thread in threadsFilterNonRedditHosts" v-bind:key="thread.title">
        <b-col>
          <b-row>{{ thread.title }}</b-row>
          <b-row>{{ thread.selftext }}</b-row>
          <b-row v-if="isUrlImg(thread.url)">
            <img class="media" :src="thread.url" />
          </b-row>
          <b-row v-if="thread.vid">
            <iframe class="media" allow="autoplay" :src="thread.vid" />
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
.media {
  height: 60vh;
  width: auto;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "home",
  data() {
    return {
      threads: [] as Thread[]
    };
  },
  computed: {
    // If the thread contains an image or video, filters threads to only contain those that are reddit-hosted
    threadsFilterNonRedditHosts(): Array<Thread> {
      let threadsFiltered = this.threads.filter(thread => {
        return (
          this.isUrlComments(thread.url) ||
          this.isUrlImg(thread.url) ||
          thread.vid
        );
      });
      return threadsFiltered;
    }
  },
  created() {
    let vm = this;
    vm.getPostsAndComments("aww", "hot");
  },
  methods: {
    async getPostsAndComments(subredditName: string, sortBy: string) {
      const response = await fetch(
        "https://www.reddit.com/r/" + subredditName + "/" + sortBy + ".json"
      );
      const responseJson = await response.json();

      const threadsJson = responseJson.data.children as Array<any>;
      let threads: Thread[] = [];
      threadsJson.forEach(async function(threadJson) {
        let link =
          "https://www.reddit.com" +
          threadJson.data.permalink +
          ".json?limit=3";
        const response = await fetch(link);
        const responseJson = await response.json();

        const threadData = responseJson[0].data.children[0].data;

        let thread: Thread = {
          title: threadData.title,
          selftext: threadData.selftext,
          url: threadData.url,
          vid:
            threadData.media && threadData.media.reddit_video
              ? threadData.media.reddit_video.fallback_url
              : ""
        };

        threads.push(thread);
      });

      this.threads = threads;
    },
    isUrlImg(url: string) {
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    },
    isUrlComments(url: string) {
      return url.match(/www.reddit.com/) != null;
    }
  }
});

interface Thread {
  title: string;
  selftext: string;
  url: string;
  vid: string;
}
</script>

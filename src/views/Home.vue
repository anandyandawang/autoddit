<template>
  <div class="home">
    <b-container fluid class="p-5">
      <b-row>
        <button @click="toggleTTS">
          Enable text-to-speech: {{ enableTTS }}
        </button>
      </b-row>
      <b-row>
        <!-- TODO:: make post component? instead of calling here / in Post copmonent, isUrlImg could be used in the process of grabbing reddit api info, then create an img field if it is (similar to) -->
        <b-col v-if="doneLoading">
          <b-row>{{ threadsFiltered[currThread].title }}</b-row>
          <b-row>{{ threadsFiltered[currThread].selftext }}</b-row>
          <b-row v-if="isUrlImg(threadsFiltered[currThread].url)">
            <img class="media" :src="threadsFiltered[currThread].url" />
          </b-row>
          <b-row v-if="threadsFiltered[currThread].vid">
            <iframe
              class="media"
              allow="autoplay"
              :src="threadsFiltered[currThread].vid"
            />
          </b-row>
          <comments :comments="threadsFiltered[currThread].comments"></comments>
        </b-col>
        <b-col v-if="!doneLoading">
          <b-row><loading></loading></b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
.home {
  text-align: left;

  .media {
    height: 60vh;
    width: auto;
  }
}
</style>

<script lang="ts">
import Vue from "vue";
import Comments from "../components/Comments.vue";
import Loading from "../components/Loading.vue";

export default Vue.extend({
  name: "home",
  components: {
    Comments,
    Loading
  },
  data() {
    return {
      threads: [] as Thread[],
      currThread: 0 as number,
      enableTTS: false,
      doneLoading: false,
      intervalId: -1 as number
    };
  },
  computed: {
    // Filters threads to only contain images and videos that are reddit-hosted
    threadsFiltered(): Array<Thread> {
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

    // enable the setInterval
    vm.intervalId = vm.incrementCurrThreadInterval();
  },
  methods: {
    async getPostsAndComments(subredditName: string, sortBy: string) {
      let vm = this;

      const response = await fetch(
        "https://www.reddit.com/r/" + subredditName + "/" + sortBy + ".json"
      );
      const responseJson = await response.json();

      const threadsJson = responseJson.data.children as Array<any>;
      threadsJson.forEach(async function(threadJson) {
        let link =
          "https://www.reddit.com" +
          threadJson.data.permalink +
          ".json?limit=3";
        const response = await fetch(link);
        const responseJson = await response.json();

        // recursively creates an array holding every comment tree in the current thread
        // each comment may contain several comment sub-trees, in the form of replies.
        // like a comment tree, this is also modeled as an array of comments
        let setCommentsArray = function(
          commentsData: Array<any>
        ): Array<Comment> {
          let comments: Array<Comment> = [];
          commentsData.forEach(commentData => {
            if (commentData.data.body) {
              let comment = {
                body: commentData.data.body,
                replies: commentData.data.replies
                  ? setCommentsArray(commentData.data.replies.data.children)
                  : []
              };
              comments.push(comment);
            }
          });
          return comments;
        };
        const commentsData = responseJson[1].data.children as Array<any>;
        let comments: Array<Comment> = setCommentsArray(commentsData);

        const threadData = responseJson[0].data.children[0].data;
        let thread: Thread = {
          title: threadData.title,
          selftext: threadData.selftext,
          url: threadData.url,
          vid:
            threadData.media && threadData.media.reddit_video
              ? threadData.media.reddit_video.fallback_url
              : "",
          comments: comments
        };
        vm.threads.push(thread);
        if (threadJson === threadsJson[threadsJson.length - 1]) {
          // done loading if we are on the last iteration ofo the olop and added the last thread
          vm.doneLoading = true;
        }
      });
    },
    isUrlImg(url: string) {
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    },
    isUrlComments(url: string) {
      return url.match(/www.reddit.com/) != null;
    },
    toggleTTS() {
      // everytime we toggle TTS, we want to enable/disable TTS and do the opposite for thte intervals
      this.enableTTS = !this.enableTTS;
      this.enableTTS ? this.doTTS() : this.doInterval();
    },
    doTTS(): void {
      let vm = this;

      if (vm.enableTTS) {
        // they toggled tts on; time to speak the text

        // also cancel the setInterval
        clearInterval(vm.intervalId);

        let speechString =
          this.threadsFiltered[this.currThread].title +
          ". " +
          this.commentsSpeechify(
            this.threadsFiltered[this.currThread].comments
          );

        // if TTS is enabled then on every completion of reading a thread,
        // increment the currThread counter, and start reading the next thread
        let utter = new SpeechSynthesisUtterance(speechString);
        utter.addEventListener("end", function(event) {
          // extra check needed here because it is possible to fire this listener when enableTTS is false
          // happens when speechSynthesis.cancel() is called
          // which happens when we toggle off TTS to use interval instead,
          // and we don't want to increase the currThread just yet when that toggle occurs
          if (vm.enableTTS) {
            vm.currThread++;
            vm.doTTS();
          }
        });
        speechSynthesis.speak(utter);
      }
    },
    doInterval(): void {
      let vm = this;

      if (!vm.enableTTS) {
        // they toggled tts off; time to stop speech
        // NOTE:: this cancel function causes the Utterance's end event listener to fire off
        speechSynthesis.cancel();

        // also re-enable the setInterval
        vm.intervalId = vm.incrementCurrThreadInterval();
      }
    },
    incrementCurrThreadInterval() {
      let vm = this;
      return setInterval(function() {
        vm.currThread++;
      }, 5000);
    },
    commentsSpeechify(comments: Array<Comment>) {
      let vm = this;

      let commentsString = "";
      comments.forEach(function(comment) {
        commentsString +=
          comment.body + ". " + vm.commentsSpeechify(comment.replies);
      });
      return commentsString;
    }
  }
});

interface Thread {
  title: string;
  selftext: string;
  url: string;
  vid: string;
  comments: Array<Comment>;
}

interface Comment {
  body: string;
  replies: Comment[];
}
</script>

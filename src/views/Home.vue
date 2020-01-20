<template>
  <div class="home">
    <b-container fluid class="m-4">
      <b-row>
        <b-col md="6" offset-md="3">
          <b-row>
            <transition name="slide-fade" mode="out-in">
              <!-- TODO:: make post component? instead of calling here / in Post copmonent, isUrlImg could be used in the process of grabbing reddit api info, then create an img field if it is (similar to) -->
              <b-col v-if="doneLoading" :key="currThread">
                <b-row
                  ><h5 class="title">
                    {{ threadsFiltered[currThread].title }}
                  </h5></b-row
                >
                <b-row
                  class="post-body"
                  v-if="threadsFiltered[currThread].selftext"
                  >{{ threadsFiltered[currThread].selftext }}</b-row
                >
                <b-row class="post-body" v-if="threadsFiltered[currThread].img">
                  <img class="media" :src="threadsFiltered[currThread].url" />
                </b-row>
                <b-row class="post-body" v-if="threadsFiltered[currThread].vid">
                  <iframe
                    class="media"
                    allow="autoplay"
                    :src="threadsFiltered[currThread].vid"
                  />
                </b-row>
                <comments
                  class="comments"
                  :comments="threadsFiltered[currThread].comments"
                ></comments>
              </b-col>
            </transition>
            <b-col v-if="!doneLoading">
              <b-row><loading></loading></b-row>
            </b-col>
          </b-row>
          <b-row>
            <button class="btn" @click="toggleTTS">
              Enable text-to-speech: {{ enableTTS }}
            </button>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang="scss">
@import "../assets/variables.scss";
.home {
  text-align: left;
  display: flex;
  align-items: center;

  .title {
    @media (max-width: $screen-sm) {
      font-size: 18px;
    }
  }

  .post-body,
  .comments {
    @media (max-width: $screen-sm) {
      font-size: 14px;
    }
  }

  .media {
    object-fit: cover; // automatically crops image to keep the aspect ratio if image does not fit within the range of dimensions
    min-width: 75%;
    max-width: 100%;
    min-height: 60vh;
    max-height: 70vh;

    @media (max-width: $screen-sm) {
      // higher min width on mobile to fill up screen width
      min-width: 90%;
    }
  }

  .post-body {
    margin-top: 1%;
    margin-bottom: 3%;
  }

  .slide-fade-enter-active {
    transition: all 0.4s ease;
  }

  .slide-fade-leave-active {
    transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter {
    transform: translateX(-30px);
    opacity: 0;
  }

  .slide-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
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
        return this.isUrlComments(thread.url) || thread.img || thread.vid;
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
          img: vm.isUrlImg(threadData.url) ? threadData.url : "",
          vid:
            threadData.media && threadData.media.reddit_video
              ? threadData.media.reddit_video.fallback_url
              : "",
          duration:
            threadData.media && threadData.media.reddit_video
              ? threadData.media.reddit_video.duration * 1000
              : 0,
          comments: comments
        };
        vm.threads.push(thread);
        if (threadJson === threadsJson[threadsJson.length - 1]) {
          // done loading if we are on the last iteration of the loop and added the last thread
          vm.doneLoading = true;

          // enable the setInterval
          if (!vm.enableTTS) {
            vm.intervalId = vm.incrementCurrThreadInterval();
          }
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

        // first speak the title
        let postSpeechString = vm.threadsFiltered[vm.currThread].title + ". ";
        if (vm.threadsFiltered[vm.currThread].selftext) {
          postSpeechString += vm.threadsFiltered[vm.currThread].selftext + ". ";
        }
        let utter = new SpeechSynthesisUtterance(postSpeechString);
        utter.addEventListener("end", function(event) {
          // extra check needed here because it is possible to fire this listener when enableTTS is false
          // happens when speechSynthesis.cancel() is called
          // which happens when we toggle off TTS to use interval instead,
          if (vm.enableTTS) {
            // then add a delay if there is an image or video
            let delay = 0;
            if (vm.threadsFiltered[vm.currThread].vid) {
              delay = vm.threadsFiltered[vm.currThread].duration;
            } else if (vm.threadsFiltered[vm.currThread].img) {
              delay = 3000;
            }

            // after the delay, speak the comments
            setTimeout(function() {
              let commentsSpeechString = vm.commentsSpeechify(
                vm.threadsFiltered[vm.currThread].comments
              );

              // if TTS is enabled then on every completion of reading a thread,
              // increment the currThread counter, and start reading the next thread
              let utter = new SpeechSynthesisUtterance(commentsSpeechString);
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
            }, delay);
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

      // giving extra delay time if there is an image or a video
      let delay = 5000;
      if (vm.threadsFiltered[vm.currThread].vid) {
        delay += vm.threadsFiltered[vm.currThread].duration;
      } else if (vm.threadsFiltered[vm.currThread].img) {
        delay += 3000;
      }

      return setInterval(function() {
        vm.currThread++;

        // clear the current interval, set a new interval with a delay customzied for the next thread
        clearInterval(vm.intervalId);
        vm.intervalId = vm.incrementCurrThreadInterval();
      }, delay);
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
  img: string;
  vid: string;
  duration: number;
  comments: Array<Comment>;
}

interface Comment {
  body: string;
  replies: Comment[];
}
</script>

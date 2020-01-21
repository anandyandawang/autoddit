<template>
  <div class="home">
    <b-container fluid class="m-4">
      <b-row>
        <b-col md="6" offset-md="3">
          <b-row>
            <transition name="slide-fade" mode="out-in">
              <!-- TODO:: make post component? instead of calling here / in Post copmonent, isUrlImg could be used in the process of grabbing reddit api info, then create an img field if it is (similar to) -->
              <b-col v-if="doneLoading" :key="currThread">
                <div v-if="!subredditNotFound">
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
                  <b-row
                    class="post-body"
                    v-if="threadsFiltered[currThread].img"
                  >
                    <img class="media" :src="threadsFiltered[currThread].url" />
                  </b-row>
                  <b-row
                    class="post-body"
                    v-if="threadsFiltered[currThread].vid"
                  >
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
                </div>
                <div v-if="subredditNotFound">
                  Subreddit Not Found
                </div>
              </b-col>
            </transition>
            <b-col v-if="!doneLoading">
              <b-row><loading></loading></b-row>
            </b-col>
          </b-row>
        </b-col>
        <!-- TODO:: settings component -->
        <transition name="slide-fade" mode="out-in">
          <b-col offset-md="1" md="2" v-if="doneLoadingFirst">
            <b-form-group class="settings">
              <b-row class="mb-1">
                <b-form-input
                  placeholder="Enter subreddit here"
                  type="text"
                  size="sm"
                  v-model="subreddit"
                  v-on:input="subredditApply"
                ></b-form-input>
              </b-row>
              <b-row>
                <b-checkbox v-model="enableTTS">
                  Text-to-speech
                </b-checkbox>
              </b-row>
            </b-form-group>
          </b-col>
        </transition>
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
  .comments,
  .settings {
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

  .settings {
    margin-top: 20vh;
    margin-bottom: 10vh;

    @media (max-width: $screen-sm) {
      margin-top: 6vh;
      margin-bottom: 4vh;
    }
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
      subreddit: "aww" as string,
      subredditKeyupTimer: null as number | null,
      subredditNotFound: false,
      sortBy: "hot" as string,
      threadsChanged: false as boolean,
      threads: [] as Thread[],
      currThread: 0 as number,
      nextPage: "" as string,
      enableTTS: false,
      doneLoading: false,
      doneLoadingFirst: false,
      // the Count variables are to keep track of the state of the program;
      // for example, if they decide to make a subreddit change, then
      // threadsCount would increase and that would make sure that any await calls made at a count of 0
      // would have all the suceeding lines not call anymore
      // (because the suceeding lines are meant to be used to, e.g., speak the original thread's comments, and we wouldn't want to let those calls speak the next thread's comments!)
      threadsCount: 0 as number,
      enableTTSCount: 0 as number
    };
  },
  created() {
    let vm = this;
    vm.getPostsAndComments(vm.subreddit, vm.sortBy);
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
  watch: {
    // everytime we toggle TTS, we want to enable/disable TTS and do the opposite for thte intervals
    enableTTS: function(newEnableTTS) {
      // everytime a change occurs to enableTTS, increase the counter to udpate the state
      this.enableTTSCount++;
      // make sure that when they toggle, we are done loading. prevents doing tts on no threads
      if (this.doneLoading) {
        newEnableTTS ? this.doTTS() : this.doInterval();
      }
    }
  },
  methods: {
    subredditApply() {
      let vm = this;
      if (vm.subredditKeyupTimer) {
        clearTimeout(vm.subredditKeyupTimer);
        vm.subredditKeyupTimer = null;
      }
      if (vm.subreddit.length >= 3) {
        vm.subredditKeyupTimer = setTimeout(() => {
          // increment threadsCount immediately after the intent to change subs is made
          // this prevents the await calls during TTS for the previous threads from executing any further
          // (i.e. going to the next thread and starting to read) since stateChanged would now return false
          vm.getPostsAndComments(vm.subreddit, vm.sortBy);
        }, 1000);
      }
    },
    subredditFailedToFind() {
      let vm = this;
      vm.subredditNotFound = true;
      vm.doneLoading = true;
      vm.doneLoadingFirst = true;
    },
    async getPostsAndComments(subredditName: string, sortBy: string) {
      let vm = this;

      // on subreddit change or on loading next page into the threads array
      // we should reset our current array of threads and the counter
      vm.threadsCount++;
      vm.doneLoading = false;
      vm.threads = [];
      vm.currThread = 0;
      vm.subredditNotFound = false;
      // also reset active TTS or intervals
      vm.cancelTTS();

      let response;
      try {
        response = await fetch(
          "https://www.reddit.com/r/" +
            subredditName +
            "/" +
            sortBy +
            ".json?after=" +
            vm.nextPage
        );
      } catch (e) {
        // trying to find the subreddit returned an error
        vm.subredditFailedToFind();
        return;
      }

      const responseJson = await response.json();

      // assert that subreddit exists
      if (responseJson.data.children.length === 0) {
        vm.subredditFailedToFind();
        return;
      }

      vm.nextPage = responseJson.data.after ? responseJson.data.after : "";

      const threadsJson = responseJson.data.children as Array<any>;
      // asynchrously adding threads into vm.threads array.
      // use a counter to check for when ALL threads are added in
      // (because we cant rely on the last thread to be added last if they are all being added at the same time async!)
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
                  : [],
                id: commentData.data.id
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
        if (vm.threads.length === threadsJson.length) {
          // done loading if we are on the last iteration of the loop and added the last thread
          vm.doneLoading = true;
          vm.doneLoadingFirst = true;

          // do the TTS/setInterval for current array of threads
          vm.enableTTS ? vm.doTTS() : vm.doInterval();
        }
      });
    },
    speak(text: string) {
      return new Promise(resolve => {
        const utter = new SpeechSynthesisUtterance(text);
        utter.onend = resolve;
        speechSynthesis.speak(utter);
      });
    },
    wait(ms: number) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    },
    isUrlImg(url: string) {
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    },
    isUrlComments(url: string) {
      return url.match(/www.reddit.com/) != null;
    },
    async doTTS() {
      let vm = this;
      let currEnableTTSCount = vm.enableTTSCount;
      let currThreadsCount = vm.threadsCount;

      if (vm.enableTTS) {
        // they toggled tts on; time to speak the text

        // first speak the title
        let postSpeechString = vm.threadsFiltered[vm.currThread].title + ". ";
        if (vm.threadsFiltered[vm.currThread].selftext) {
          postSpeechString += vm.threadsFiltered[vm.currThread].selftext + ". ";
        }
        await vm.speak(postSpeechString);
        // after the delay check if we are still doing TTS and we haven't changed the set of threads via subreddit change or next page
        // if the state has changed we no longer want to do anything more here, so simply return
        if (vm.stateChanged(currEnableTTSCount, currThreadsCount)) return;

        // then add a delay if there is an image or video
        let delay = 0;
        if (vm.threadsFiltered[vm.currThread].vid) {
          delay = vm.threadsFiltered[vm.currThread].duration;
        } else if (vm.threadsFiltered[vm.currThread].img) {
          delay = 3000;
        }
        // after the delay, speak the comments
        await vm.wait(delay);
        if (vm.stateChanged(currEnableTTSCount, currThreadsCount)) return;

        let commentsSpeechString = vm.commentsSpeechify(
          vm.threadsFiltered[vm.currThread].comments
        );
        await vm.speak(commentsSpeechString);
        if (vm.stateChanged(currEnableTTSCount, currThreadsCount)) return;

        await vm.wait(2000);
        if (vm.stateChanged(currEnableTTSCount, currThreadsCount)) return;

        // check if we are on the last *filtered* thread
        if (vm.currThread === vm.threadsFiltered.length - 1) {
          // get next page of threads
          vm.getPostsAndComments(vm.subreddit, vm.sortBy);
        } else {
          // add slight delay between reading last comment and next title
          vm.currThread++;
          vm.doTTS();
        }
      }
    },
    commentsSpeechify(comments: Array<Comment>) {
      let vm = this;

      let commentsString = "";
      comments.forEach(function(comment) {
        commentsString +=
          comment.body + ". " + vm.commentsSpeechify(comment.replies);
      });
      return commentsString;
    },
    doInterval(): void {
      let vm = this;

      if (!vm.enableTTS) {
        // they toggled tts off; time to stop speech
        speechSynthesis.cancel();

        // also re-enable the setInterval
        vm.incrementCurrThreadInterval();
      }
    },
    async incrementCurrThreadInterval() {
      let vm = this;
      let currEnableTTSCount = vm.enableTTSCount;
      let currThreadsCount = vm.threadsCount;

      // giving extra delay time if there is an image or a video
      let delay = 5000;
      if (vm.threadsFiltered[vm.currThread].vid) {
        delay += vm.threadsFiltered[vm.currThread].duration;
      } else if (vm.threadsFiltered[vm.currThread].img) {
        delay += 3000;
      }

      await vm.wait(delay);

      // after the wait, if we are still non TTS and threads havent changed
      if (
        !vm.enableTTS &&
        !vm.stateChanged(currEnableTTSCount, currThreadsCount)
      ) {
        // check if we are on the last *filtered* thread
        if (vm.currThread === vm.threadsFiltered.length - 1) {
          // get next page of threads
          vm.getPostsAndComments(vm.subreddit, vm.sortBy);
        } else {
          // go to next thread
          vm.currThread++;
          // set a new interval with a delay customzied for the next thread
          vm.incrementCurrThreadInterval();
        }
      }
    },
    cancelTTS(): void {
      speechSynthesis.cancel();
    },
    stateChanged(
      enableTTSCountState: number,
      threadsCountState: number
    ): boolean {
      return !(
        enableTTSCountState === this.enableTTSCount &&
        threadsCountState === this.threadsCount
      );
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
  id: string;
}
</script>

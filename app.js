(function(e){function t(t){for(var n,s,o=t[0],d=t[1],u=t[2],l=0,h=[];l<o.length;l++)s=o[l],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&h.push(a[s][0]),a[s]=0;for(n in d)Object.prototype.hasOwnProperty.call(d,n)&&(e[n]=d[n]);c&&c(t);while(h.length)h.shift()();return i.push.apply(i,u||[]),r()}function r(){for(var e,t=0;t<i.length;t++){for(var r=i[t],n=!0,o=1;o<r.length;o++){var d=r[o];0!==a[d]&&(n=!1)}n&&(i.splice(t--,1),e=s(s.s=r[0]))}return e}var n={},a={app:0},i=[];function s(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=n,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(r,n,function(t){return e[t]}.bind(null,n));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],d=o.push.bind(o);o.push=t,o=o.slice();for(var u=0;u<o.length;u++)t(o[u]);var c=d;i.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},"0310":function(e,t,r){},"21bb":function(e,t,r){"use strict";r("7a98")},"4cd2":function(e,t,r){},5254:function(e,t,r){"use strict";r("0310")},"5c0b":function(e,t,r){"use strict";r("e332")},"7a98":function(e,t,r){},b445:function(e){e.exports=JSON.parse('{"example":{"text":"hello world","phone":"4759349273"}}')},cd49:function(e,t,r){"use strict";r.r(t);r("cadf"),r("551c"),r("f751"),r("097d");var n=r("2b0e"),a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("router-view")],1)},i=[],s=(r("b445"),n["default"].extend({name:"home"})),o=s,d=(r("5c0b"),r("2877")),u=Object(d["a"])(o,a,i,!1,null,null,null),c=u.exports,l=r("8c4f"),h=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"home"},[r("b-container",{staticClass:"m-4",attrs:{fluid:""}},[r("b-row",[r("b-col",{attrs:{md:"6","offset-md":"3"}},[r("b-row",[r("transition",{attrs:{name:"slide-fade",mode:"out-in"}},[e.doneLoading?r("b-col",{key:e.currThread},[e.subredditNotFound?e._e():r("div",[r("b-row",[r("h5",{staticClass:"title"},[e._v("\n                    "+e._s(e.threadsFiltered[e.currThread].title)+"\n                  ")])]),e.threadsFiltered[e.currThread].selftext?r("b-row",{staticClass:"post-body"},[e._v(e._s(e.threadsFiltered[e.currThread].selftext))]):e._e(),e.threadsFiltered[e.currThread].img?r("b-row",{staticClass:"post-body"},[r("img",{staticClass:"media",attrs:{src:e.threadsFiltered[e.currThread].url}})]):e._e(),e.threadsFiltered[e.currThread].vid?r("b-row",{staticClass:"post-body"},[r("iframe",{staticClass:"media",attrs:{allow:"autoplay",src:e.threadsFiltered[e.currThread].vid}})]):e._e(),r("comments",{staticClass:"comments",attrs:{comments:e.threadsFiltered[e.currThread].comments}})],1),e.subredditNotFound?r("div",[e._v("\n                Subreddit Not Found\n              ")]):e._e()]):e._e()],1),e.doneLoading?e._e():r("b-col",[r("b-row",[r("loading")],1)],1)],1)],1),r("transition",{attrs:{name:"slide-fade",mode:"out-in"}},[e.doneLoadingFirst?r("b-col",{attrs:{"offset-md":"1",md:"2"}},[r("b-form-group",{staticClass:"settings"},[r("b-row",{staticClass:"mb-1"},[r("b-form-input",{attrs:{placeholder:"Enter subreddit here",type:"text",size:"sm"},on:{input:e.subredditApply},model:{value:e.subreddit,callback:function(t){e.subreddit=t},expression:"subreddit"}})],1),r("b-row",[r("b-checkbox",{model:{value:e.enableTTS,callback:function(t){e.enableTTS=t},expression:"enableTTS"}},[e._v("\n                Text-to-speech\n              ")])],1)],1)],1):e._e()],1)],1)],1)],1)},f=[],p=(r("4917"),r("ac6a"),r("f3e2"),r("96cf"),r("3b8d")),m=(r("d25f"),function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"comments"},[r("b-row",[r("b-col",e._l(e.comments,(function(t){return r("b-row",{key:t.id,staticClass:"mb-1"},[r("b-col",[r("b-row",{style:e.style},[e._v("\n            "+e._s(t.body)+"\n          ")]),t.replies?r("comments",{attrs:{comments:t.replies,depth:e.depth+1}}):e._e()],1)],1)})),1)],1)],1)}),b=[],v=(r("c5f6"),n["default"].extend({name:"comments",props:{comments:Array,depth:{type:Number,default:0}},computed:{style:function(){var e=5*Number(this.depth);return"padding-left: "+e+"vw"}}})),g=v,T=(r("5254"),Object(d["a"])(g,m,b,!1,null,"c3e8d6dc",null)),w=T.exports,y=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},x=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"lds-dual-ring"},[r("div")])}],C=n["default"].extend({name:"loading"}),_=C,F=(r("f068"),Object(d["a"])(_,y,x,!1,null,"19e7d867",null)),S=F.exports,k=n["default"].extend({name:"home",components:{Comments:w,Loading:S},data:function(){return{subreddit:"aww",subredditKeyupTimer:null,subredditNotFound:!1,sortBy:"hot",threadsChanged:!1,threads:[],currThread:0,nextPage:"",enableTTS:!1,doneLoading:!1,doneLoadingFirst:!1,threadsCount:0,enableTTSCount:0}},created:function(){var e=this;e.getPostsAndComments(e.subreddit,e.sortBy)},computed:{threadsFiltered:function(){var e=this,t=this.threads.filter((function(t){return e.isUrlComments(t.url)||t.img||t.vid}));return t}},watch:{enableTTS:function(e){this.enableTTSCount++,this.doneLoading&&(e?this.doTTS():this.doInterval())}},methods:{subredditApply:function(){var e=this;e.subredditKeyupTimer&&(clearTimeout(e.subredditKeyupTimer),e.subredditKeyupTimer=null),e.subreddit.length>=3&&(e.subredditKeyupTimer=setTimeout((function(){e.getPostsAndComments(e.subreddit,e.sortBy)}),1e3))},subredditFailedToFind:function(){var e=this;e.subredditNotFound=!0,e.doneLoading=!0,e.doneLoadingFirst=!0},getPostsAndComments:function(){var e=Object(p["a"])(regeneratorRuntime.mark((function e(t,r){var n,a,i,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=this,n.threadsCount++,n.doneLoading=!1,n.threads=[],n.currThread=0,n.subredditNotFound=!1,n.cancelTTS(),e.prev=7,e.next=10,fetch("https://www.reddit.com/r/"+t+"/"+r+".json?after="+n.nextPage);case 10:a=e.sent,e.next=17;break;case 13:return e.prev=13,e.t0=e["catch"](7),n.subredditFailedToFind(),e.abrupt("return");case 17:return e.next=19,a.json();case 19:if(i=e.sent,0!==i.data.children.length){e.next=23;break}return n.subredditFailedToFind(),e.abrupt("return");case 23:n.nextPage=i.data.after?i.data.after:"",s=i.data.children,s.forEach(function(){var e=Object(p["a"])(regeneratorRuntime.mark((function e(t){var r,a,i,o,d,u,c,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r="https://www.reddit.com"+t.data.permalink+".json?limit=3",e.next=3,fetch(r);case 3:return a=e.sent,e.next=6,a.json();case 6:i=e.sent,o=function e(t){var r=[];return t.forEach((function(t){if(t.data.body){var n={body:t.data.body,replies:t.data.replies?e(t.data.replies.data.children):[],id:t.data.id};r.push(n)}})),r},d=i[1].data.children,u=o(d),c=i[0].data.children[0].data,l={title:c.title,selftext:c.selftext,url:c.url,img:n.isUrlImg(c.url)?c.url:"",vid:c.media&&c.media.reddit_video?c.media.reddit_video.fallback_url:"",duration:c.media&&c.media.reddit_video?1e3*c.media.reddit_video.duration:0,comments:u},n.threads.push(l),n.threads.length===s.length&&(n.doneLoading=!0,n.doneLoadingFirst=!0,n.enableTTS?n.doTTS():n.doInterval());case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 26:case"end":return e.stop()}}),e,this,[[7,13]])})));function t(t,r){return e.apply(this,arguments)}return t}(),speak:function(e){return new Promise((function(t){var r=new SpeechSynthesisUtterance(e);r.onend=t,speechSynthesis.speak(r)}))},wait:function(e){return new Promise((function(t){setTimeout(t,e)}))},isUrlImg:function(e){return null!=e.match(/\.(jpeg|jpg|gif|png)$/)},isUrlComments:function(e){return null!=e.match(/www.reddit.com/)},doTTS:function(){var e=Object(p["a"])(regeneratorRuntime.mark((function e(){var t,r,n,a,i,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t=this,r=t.enableTTSCount,n=t.threadsCount,!t.enableTTS){e.next=26;break}return a=t.threadsFiltered[t.currThread].title+". ",t.threadsFiltered[t.currThread].selftext&&(a+=t.threadsFiltered[t.currThread].selftext+". "),e.next=8,t.speak(a);case 8:if(!t.stateChanged(r,n)){e.next=10;break}return e.abrupt("return");case 10:return i=0,t.threadsFiltered[t.currThread].vid?i=t.threadsFiltered[t.currThread].duration:t.threadsFiltered[t.currThread].img&&(i=3e3),e.next=14,t.wait(i);case 14:if(!t.stateChanged(r,n)){e.next=16;break}return e.abrupt("return");case 16:return s=t.commentsSpeechify(t.threadsFiltered[t.currThread].comments),e.next=19,t.speak(s);case 19:if(!t.stateChanged(r,n)){e.next=21;break}return e.abrupt("return");case 21:return e.next=23,t.wait(2e3);case 23:if(!t.stateChanged(r,n)){e.next=25;break}return e.abrupt("return");case 25:t.currThread===t.threadsFiltered.length-1?t.getPostsAndComments(t.subreddit,t.sortBy):(t.currThread++,t.doTTS());case 26:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),commentsSpeechify:function(e){var t=this,r="";return e.forEach((function(e){r+=e.body+". "+t.commentsSpeechify(e.replies)})),r},doInterval:function(){var e=this;e.enableTTS||(speechSynthesis.cancel(),e.incrementCurrThreadInterval())},incrementCurrThreadInterval:function(){var e=Object(p["a"])(regeneratorRuntime.mark((function e(){var t,r,n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=this,r=t.enableTTSCount,n=t.threadsCount,a=5e3,t.threadsFiltered[t.currThread].vid?a+=t.threadsFiltered[t.currThread].duration:t.threadsFiltered[t.currThread].img&&(a+=3e3),e.next=7,t.wait(a);case 7:t.enableTTS||t.stateChanged(r,n)||(t.currThread===t.threadsFiltered.length-1?t.getPostsAndComments(t.subreddit,t.sortBy):(t.currThread++,t.incrementCurrThreadInterval()));case 8:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),cancelTTS:function(){speechSynthesis.cancel()},stateChanged:function(e,t){return!(e===this.enableTTSCount&&t===this.threadsCount)}}}),j=k,O=(r("21bb"),Object(d["a"])(j,h,f,!1,null,null,null)),P=O.exports;n["default"].use(l["a"]);var L=new l["a"]({mode:"history",base:"/",routes:[{path:"/",name:"home",component:P}]}),N=r("9483");Object(N["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});r("21b6");var A=r("5f5b");n["default"].use(A["a"]),n["default"].config.productionTip=!1,new n["default"]({router:L,render:function(e){return e(c)}}).$mount("#app")},e332:function(e,t,r){},f068:function(e,t,r){"use strict";r("4cd2")}});
//# sourceMappingURL=app.js.map
<template>
  <div>
    <h1>{{ video.date }} - {{ video.name }}</h1>
    <div id="videoOut">
      <div id="videoIn">
        <video ref="videoPlayer" class="video-js">
          <track kind="captions" :src="'/videos/' + video.sub" srclang="en" label="English" default>
          <track kind="chapters" :src="chapters()" srclang="en">
        </video>
      </div>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js';
require('videojs-sprite-thumbnails');
require('videojs-shuttle-controls');

export default {
  name: 'Video',
  props: {
    video: Object,
  },
  data() {
    return {
      player: null,
      opts: {
        autoplay: true,
        controls: true,
        playbackRates: [-10, -5, -2, -1, -0.5, 0.5, 1, 2, 5, 10],
        sources: [
          {
            src: '/videos/' + this.video.fn,
            type: 'video/mp4'
          }
        ]
      }
    }
  },
  methods: {
    chapters: function() {
      let data = "WEBVTT\n\n";
      this.video.chapters.forEach(chapter => {
        let ss = chapter.ss == null ? 0 : chapter.ss;
        let et = chapter.et == null ? (ss + 1) : chapter.et;
        et = new Date(1000 * et).toISOString().substr(11, 12);
        ss = new Date(1000 * ss).toISOString().substr(11, 12);
        data += ss + " --> " + et + "\n";
        data += chapter.name + "\n";
        data += "\n";
      });
      let b64 = btoa(data);
      return 'data:text/vtt;base64,' + b64;
    }
  },
  mounted() {
    let sprite = null;
    if(this.video.sprite !== undefined) {
      sprite = this.video.sprite;
      sprite.url = '/videos/' + sprite.url;
    }
    this.player = videojs(this.$refs.videoPlayer, this.opts, function onPlayerReady() {
      console.log('player ready', this);
      window.player = this;
      if(sprite !== null)
        this.spriteThumbnails(sprite);
    });
  },
  beforeDestroy() {
    if(this.player) {
      this.player.dispose();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div#videoOut {
  position: relative;
  display: block;
  width: 100%;
  max-width: 85%;
  max-height: 80vh;
  margin: 0px auto;
}
div#videoIn {
  padding-top: 50%;
}
.video-js {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>
<style src="video.js/dist/video-js.min.css"></style>
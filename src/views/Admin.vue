<template>
  <div class="admin">
    <h1>Parse Bulletin</h1>
    <p>Copy the contents of the bulletin and paste it here:</p>
    <textarea v-model="paste"></textarea>
    <!-- <br>
    <button @click="clip()">Paste</button> -->
    <div id="admin_flex">
      <Bulletin :video="video" v-if="video.pdf != null || video.chapters.length > 0" class="fc" />
      <div class="fc">
        <h2>JSON</h2>
        <button v-clipboard="() => JSON.stringify(video.chapters, null, 2)">Copy</button>
        <vue-json-pretty :path="'chapters'" :data="video.chapters" @click="handleClick"> </vue-json-pretty>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Bulletin from '../components/Bulletin';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import _ from 'lodash';

export default {
  name: 'Admin',
  components: {
    VueJsonPretty,
    Bulletin
  },
  data() {
    return {
      db: this.$store.state.db,
      paste: "",
    }
  },
  methods: {
    handleClick: function(path, data) {
      console.log('click', path, data);
      let correction = prompt('New Value', data);
      _.set(this.video, path, correction);
    },
    clip: function() {
      navigator.permissions.query({name: "clipboard-read"}).then(result => {
        // If permission to read the clipboard is granted or if the user will
        // be prompted to allow it, we proceed.

        if (result.state == "granted" || result.state == "prompt") {
          navigator.clipboard.readText().then(str => {
            this.paste = str;
          });
          // navigator.clipboard.read().then(data => {
          //   data[0].getType('text/plain').then(blob => {
          //     blob.text().then(str => {
          //       console.log(str);
          //       this.paste = str;
          //     });
          //   });
          // });
        }
      });
    }
  },
  computed: {
    video: function() {
      let chapters = [];
      this.paste.split("\n").forEach((r) => {
        const m = r.match(/^(.*?)\s*\.{5,}\s*(.*$)/);
        let i = 0;
        if(m) {
          i = 1;
          chapters.push({
            // "r": r,
            "name": m[1].replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"'),
            "who": m[2].replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"'),
            "info": "",
            "ss": 0,
            "t": 0
          });
        } else {
          let e = chapters.pop();
          if(e == null || i > 1)
            return null;
          i += 1;
          if(e.info != '') {
            chapters.push(e);
            return;
          }
          Object.assign(e, {"info": r.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')});
          chapters.push(e);
        }
      });
      let chap = chapters.pop();
      if(chap != null) {
        if(chap.info.toLowerCase().startsWith('livestream'))
          chap.info = '';
        chapters.push(chap);
      }
      return {
        "chapters": chapters,
      };
    }
  }
}
</script>
<style scoped>
div#admin_flex {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
div#admin .fc {
  margin: auto;
  min-width: 500px;
}
</style>
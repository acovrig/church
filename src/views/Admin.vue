<template>
  <div class="admin">
    <h1>Parse Bulletin</h1>
    Kind: <select v-model="kind">
      <option v-for="opt in types" :key="opt" :value="opt">{{ (opt == 'ss' ? 'Sabbath School' : opt) | upper }}</option>
    </select>
    <p>Copy the contents of the bulletin and paste it here:</p>
    <textarea v-model="paste"></textarea>
    <!-- <br>
    <button @click="clip()">Paste</button> -->
    <div id="admin_flex">
      <Bulletin :video="video" v-if="video.pdf != null || video.chapters.length > 0" class="fc" />
      <div class="fc">
        <h2>JSON</h2>
        <button v-clipboard="() => JSON.stringify(video, null, 2)">Copy</button>
        <vue-json-pretty :path="'chapters'" :data="video" @click="handleClick"> </vue-json-pretty>
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
import moment from 'moment';

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
      types: ['church', 'ss', 'graduation', 'other'],
      kind: "church",
      name: ''
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
      let vid = {
        "date": "",
        "kind": this.kind,
        "name": this.name === '' ? this.$options.filters.upper(this.kind == 'ss' ? 'sabbath school' : this.kind) : this.name,
        "fn": "",
        "sub": "",
        "scripture": "",
        "sprite": {
            "interval": 0,
            "url": "",
            "width": 100,
            "height": 0
        },
        "chapters": [],
        "announcements": []
      };
      let announcements = false;
      this.paste.split("\n").forEach((r) => {
        const m = r.match(/^(.*?)\s*\.{5,}\s*(.*$)/);
        const date_re = r.match(/(\w* \d*, \d{4} \d*:\d{2} .\..\.)/);
        const ss_title_re = r.match(/#(\d)* \u201C(.*?)\u201D/);
        const announcement_re = r.match(/^\d+\) /)
        let i = 0;
        if(m) {
          i = 1;
          vid.chapters.push({
            // "r": r,
            "name": m[1].replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"'),
            "who": m[2].replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"'),
            "info": "",
            "ss": 0,
            "t": 0
          });
        } else if(date_re) {
          try {
            console.log('parsing d', date_re[1]);
            let md = moment(date_re[1].replaceAll('.', ''), 'MMM D, YYYY hh:mm a').toISOString();
            console.log(md);

            vid.date = md;
            vid.fn = moment(md).format('YYYY-MM-DD') + '_' + this.kind + '.mp4';
            vid.sub = moment(md).format('YYYY-MM-DD') + '_' + this.kind + '.vtt';
            vid.pdf = moment(md).format('YYYY-MM-DD') + '.pdf';
            vid.sprite.url = moment(md).format('YYYY-MM-DD') + '_' + this.kind + '-sprite.jpg';

          } catch(e) {
            console.error(e);
          }
        } else if(ss_title_re) {
          console.log('ss title', ss_title_re);
          if(this.kind == 'ss')
            this.name = ss_title_re[1] + ' - ' + ss_title_re[2];
        } else if(r.startsWith('Church Announcements')) {
          announcements = true;
        } else if(announcements && r.startsWith('Standifer Gap SDA Church')) {
          announcements = false;
        } else if(announcements && announcement_re) {
          vid.announcements.push(r.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/^\d+\) +(.+?) ([A-Za-z0-9][a-z])/, '<strong>$1</strong> $2'))
        } else {
          if(announcements) {
            vid.announcements[vid.announcements.length - 1] = vid.announcements[vid.announcements.length - 1] + ' ' + r.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
            return;
          }
          let e = vid.chapters.pop();
          if(e == null || i > 1) {
            console.log(r);
            return null;
          }
          i += 1;
          if(e.info != '') {
            vid.chapters.push(e);
            return;
          }
          Object.assign(e, {"info": r.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')});
          vid.chapters.push(e);
        }
      });
      let chap = vid.chapters.pop();
      if(chap != null) {
        if(chap.info.toLowerCase().startsWith('livestream'))
          chap.info = '';
        vid.chapters.push(chap);
      }
      return vid;
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
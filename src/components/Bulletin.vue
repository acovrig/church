<template>
  <div>
    <h1>Bulletin</h1>
    <div id="bulletin">
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Table" v-if="video.chapters.length > 0" active>
            <b-card-text>
            <b-table striped dark hover :items="video.chapters" :fields="fields">
              <template #cell(name)="data">
                <a href="#" v-on:click="play(data.index)">{{ data.value }}</a>
              </template>
              <template #cell()="data">
                <a v-if="data.item.name != null && data.item.name.toLowerCase() == 'scripture' && data.field.key == 'info' && video.scripture != null" href="#" v-b-modal.scripture>{{ data.value }}</a>
                <template v-else>
                  {{ data.value }}
                </template>
              </template>
            </b-table>
            </b-card-text>
          </b-tab>
          <b-tab title="PDF" v-if="video.pdf != null">
            <b-card-text>
              <div id="pdfOut">
                <div id="pdfIn">
                  <iframe :src="'/pdf/' +  video.pdf" class="pdf-iframe"></iframe>
                  <!-- <iframe :src="'/' + video.pdf" class="pdf-iframe"></iframe> -->
                </div>
              </div>
            </b-card-text>
          </b-tab>
          <template v-if="video.pdf != null" #tabs-end>
            <!-- <b-nav-item href="#" role="presentation" @click="() => {}">Another tab</b-nav-item> -->
            <li role="presentation" class="nav-item align-self-center"><a :href="'/pdf/' +  video.pdf" download>Download</a></li>
          </template>
        </b-tabs>
      </b-card>
    </div>
    <b-modal id="scripture" title="Scripture" hide-footer>
      <p class="my-4" v-html="scripture"></p>
    </b-modal>
  </div>
</template>

<script>
// import axios from 'axios';
// import pdfjs from 'pdfjs-dist/lib/pdfjs'

export default {
  name: 'Bulletin',
  props: {
    video: Object,
  },
  data() {
    return {
      fields: ['name', 'info', 'who'],
      scripture: 'Loading Scripture'
    }
  },
  methods: {
    play: function(i) {
      window.player.currentTime(this.video.chapters[i].ss)
    }
  },
  mounted() {
    // pdfjs.getdocument()
    this.$root.$on('bv::modal::show', () => {
      this.scripture = this.video.scripture.replaceAll('\n', '<br><br>\n');
      // axios.get('https://getbible.net/json?passage=1Jn3:16').then(res => {
      //   console.log(res);
      //   this.scripture = 'asdf';
      // });
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div#bulletin {
  max-width: 1750px;
  margin: 0px auto;
}
div#pdfOut {
  position: relative;
  display: block;
  width: 100%;
  margin: 0px auto;
  max-height: 1130px;
}
div#pdfIn {
  padding-top: 70%;
}
.pdf-iframe {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>
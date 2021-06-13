<template>
  <div>
    <h1>Bulletin</h1>
    <div id="bulletin">
      <v-card>
        <v-tabs
          v-model="tab"
          centered
          icons-and-text
          dark>
          <v-tabs-slider />
          <v-tab>
            Table
            <v-icon>mdi-table</v-icon>
          </v-tab>
          <v-tab>
            PDF
            <v-icon>mdi-book</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-simple-table dark>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">Name</th>
                    <th class="text-center">Info</th>
                    <th class="text-center">Who</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(chapt, index) in video.chapters"
                    :key="`${chapt.name}${chapt.info}${chapt.who}`">
                    <td><a href="#" v-on:click="play(index)">{{ chapt.name }}</a></td>
                    <td>
                      <v-dialog
                        v-if="chapt.name != null && chapt.name.trim().toLowerCase() == 'scripture'"
                        v-model="scriptureDialog"
                        width="500">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            text
                            plain
                            tag="a"
                            style="text-transform: none;"
                            color="primary"
                            v-bind="attrs"
                            v-on="on">
                            {{ chapt.info }}
                          </v-btn>
                        </template>

                        <v-card>
                          <v-card-title class="text-h5 grey lighten-2">
                            {{ chapt.info }}
                          </v-card-title>

                          <v-card-text>
                            <p v-for="verse in getScripture(chapt.info)" :key="verse.num">
                              {{verse.num}} - {{ verse.text }}
                            </p>
                          </v-card-text>
                          <v-divider></v-divider>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              text
                              @click="scriptureDialog = false">
                              Close
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <template v-else>
                        {{ chapt.info }}
                      </template>
                    </td>
                    <td><a :href="'/?who=' + chapt.who">{{ chapt.who }}</a></td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item>
            <div id="pdfOut">
              <div id="pdfIn">
                <iframe :src="'/pdf/' +  video.pdf" class="pdf-iframe"></iframe>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bulletin',
  props: {
    video: Object,
  },
  data() {
    return {
      tab: 0,
      fields: ['name', 'info', 'who'],
      scripture: [{num: 0, text: 'Loading Scripture'}],
      scriptureDialog: false,
    }
  },
  methods: {
    play: function(i) {
      window.player.currentTime(this.video.chapters[i].ss)
    },
  },
  mounted() {
    // this.$root.$on('bv::modal::show', () => {
    //   this.scripture = this.video.scripture.replaceAll('\n', '<br><br>\n');
    //   // axios.get('https://getbible.net/json?passage=1Jn3:16').then(res => {
    //   //   console.log(res);
    //   //   this.scripture = 'asdf';
    //   // });
    // })
  },
}
</script>

<style lang="scss" scoped>
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
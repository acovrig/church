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
            <v-form v-if="admin">
            <v-data-table
              :headers="headers"
              :items="video.chapters"
              item-key="id"
              hide-default-footer
              disable-pagination
              dark>
              <template v-slot:[`item.name`]="{ item }">
                <v-text-field v-model="item.name" />
              </template>
              <template v-slot:[`item.info`]="{ item }">
                <v-text-field v-model="item.info" />
              </template>
              <template v-slot:[`item.who`]="{ item }">
                <v-text-field v-model="item.who" />
              </template>
              <template v-slot:[`item.ss`]="{ item }">
                <v-text-field v-model="item.ss" required type="number" min="0" />
              </template>
              <template v-slot:[`item.t`]="{ item }">
                <v-text-field v-model="item.t" required type="number" min="0" />
              </template>
              <template v-slot:[`item.actions`]="{ index }">
                <v-btn
                  dark
                  color="success"
                  @click="addItem(index)"
                  icon>
                  <v-icon>mdi-table-row-plus-before</v-icon>
                </v-btn>
                <v-btn
                  dark
                  :disabled="index === 0"
                  color="primary"
                  @click="moveItm(index, index - 1)"
                  icon>
                  <v-icon>mdi-arrow-up-bold</v-icon>
                </v-btn>
                <v-btn
                  dark
                  :disabled="index === video.chapters.length - 1"
                  color="primary"
                  @click="moveItm(index, index + 1)"
                  icon>
                  <v-icon>mdi-arrow-down-bold</v-icon>
                </v-btn>
                <v-btn
                  dark
                  color="error"
                  @click="delItem(index)"
                  icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
            </v-form>
            <v-simple-table v-else dark>
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
      headers: [
        { text: 'Name', value: 'name', align: 'center' },
        { text: 'Info', value: 'info', align: 'center' },
        { text: 'Who', value: 'who', align: 'center' },
        { text: 'Start Seconds', value: 'ss', align: 'center', width: '1%' },
        { text: 'Total Seconds', value: 't', align: 'center', width: '1%' },
        { text: 'Actions', value: 'actions', align: 'center', width: '15%' },
      ],
      fields: ['name', 'info', 'who'],
      scripture: [{num: 0, text: 'Loading Scripture'}],
      scriptureDialog: false,
    }
  },
  computed: {
    admin() { return this.$store.getters.admin; },
  },
  methods: {
    play: function(i) {
      window.player.currentTime(this.video.chapters[i].ss)
    },
    addItem(i) {
      this.video.chapters.splice(i, 0, {ss: 0, t: 0});
    },
    delItem(i) {
      this.video.chapters.splice(i, 1);
    },
    moveItm(s, d) {
      const src = {...{order_num: d}, ...this.video.chapters[s]};
      const dst = {...{order_num: s}, ...this.video.chapters[d]};
      this.video.chapters.splice(d, 1, src);
      this.video.chapters.splice(s, 1, dst);
    },
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
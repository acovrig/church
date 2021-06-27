<template>
  <div>
    <v-data-iterator
      :items="videos"
      item-key="title"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer>
      <template v-slot:header>
        <v-toolbar
          color="blue darken-3"
          class="mb-1"
          dark>
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          />
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer />
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="sortKeys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            />
            <v-spacer />
            <v-btn-toggle
              v-model="sortDesc"
              mandatory>
              <v-btn
                depressed
                color="blue"
                :value="false"
                large>
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                depressed
                color="blue"
                :value="true"
                large>
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="{ items }">
        <v-row>
          <v-col
            v-for="item in items"
            :key="`${item.date}${item.name}`"
            cols="12"
            sm="8"
            md="6"
            lg="5">
            <v-card>
              <v-card-title>
                <h4 style="word-break: break-word;">
                  <router-link :to="`/watch/${item.id}`">
                    {{ item.title }}
                  </router-link>
                  <v-btn
                    v-if="admin"
                    :to="`/watch/${item.id}/edit`"
                    style="text-decoration: none;"
                    icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </h4>
              </v-card-title>
                <v-subheader style="height: 1em; margin-top: -1em;">
                  {{ item.date | humanDate }}
                </v-subheader>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  :to="`/watch/${item.id}`"
                  style="text-decoration: none;"
                  text>
                  <v-icon class="mx-2">mdi-eye</v-icon>
                  Watch
                </v-btn>
                <v-btn
                  v-if="item.pdf"
                  :href="`/pdf/${item.pdf}`"
                  target="_BLANK"
                  style="text-decoration: none;"
                  text>
                  <v-icon class="mx-2">mdi-download</v-icon>
                  Bulletin
                </v-btn>
                <v-dialog
                  v-model="dialog[item.scripture]"
                  v-if="item.scripture"
                  width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      text>
                      <v-icon class="mx-2">mdi-open-in-app</v-icon>
                      {{ item.scripture }}
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                      {{ item.scripture }}
                    </v-card-title>

                    <v-card-text>
                      <p v-for="verse in getScripture(item.scripture)" :key="verse.num">
                        {{verse.num}} - {{ verse.text }}
                      </p>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        text
                        @click="dialog = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row
          class="mt-2 mx-3"
          align="center"
          justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
                dark
                text>
                {{ itemsPerPageArray.find((i) => i.n === itemsPerPage).text }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(i, index) in itemsPerPageArray"
                :key="index"
                @click="setItemsPerPage(i.n)">
                <v-list-item-title>{{ i.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            color="blue darken-3"
            class="mr-1"
            @click="prevPage"
            dark
            fab>
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            color="blue darken-3"
            class="ml-1"
            @click="nextPage"
            fab
            dark>
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
export default {
  name: 'VideoIndex',
  props: {
    lst: Array,
    admin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialog: [],
      search: '',
      filter: {},
      page: 1,
      itemsPerPage: 52,
      itemsPerPageArray: [
        { n: Math.floor(52 / 12), text: '1 Month' },
        { n: (52 / 2), text: '6 Months' },
        { n: (52 * 1), text: '1 Year' },
        { n: (52 * 2), text: '2 Years' },
        { n: (52 * 3), text: '3 Years' },
        { n: (52 * 4), text: '4 Years' },
      ],
      sortBy: 'date',
      sortDesc: true,
      sortKeys: [
        'date',
        'name',
        'kind'
      ],
    }
  },
  computed: {
    videos: function() {
      let lst = this.lst;
      let ret = [];
      if(this.$route.params.program != null) {
        lst = this.lst.filter(vid => vid.kind == this.$route.params.program);
      }
      lst = lst.sort((a, b) => { return new Date(b.date) - new Date(a.date) });
      lst.forEach((v) => {
        let chapt = {};
        if(v.chapters != null) {
          v.chapters.forEach((c) => {
            if(c.name.toLowerCase() == 'message')
              chapt = c;
          });
        }
        ret.push({...v, ...{
            type: v.kind == 'ss' ? 'Sabbath School': v.kind,
            title: chapt?.info || v.name,
            speaker: chapt == null ? '' : chapt.who
          }
        });
      });
      return ret;
    },
    numberOfPages() {
      return Math.ceil(this.videos.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.sortKeys.filter((key => key !== 'Name'))
    },
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    prevPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    setItemsPerPage(num) {
      this.itemsPerPage = num;
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  list-style-type: none;
}
</style>

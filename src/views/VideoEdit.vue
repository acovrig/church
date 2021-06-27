<template>
  <div class="video_edit">
    <v-btn
      :disabled="!dirty"
      color="warning"
      @click="save()">
      <v-icon>mdi-content-save</v-icon>
      Save
    </v-btn>
    <v-btn
      :disabled="!dirty"
      color="error"
      @click="reset()">
      <v-icon>mdi-database-refresh-outline</v-icon>
      Reset
    </v-btn>
    <v-form>
      <v-row>
        <v-col>
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="admin_video.date"
                label="Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="admin_video.date"
              @input="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-select label="Kind" required v-model="admin_video.kind" :items="kinds" />
        </v-col>
        <v-col>
          <v-text-field label="Name" v-model="admin_video.name" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field label="PDF" v-model="admin_video.pdf" />
        </v-col>
        <v-col>
          <v-text-field label="Subtitle" v-model="admin_video.sub" />
        </v-col>
      </v-row>
    </v-form>
    <Bulletin :video="admin_video" />
    <Video :video="admin_video" />
  </div>
</template>

<script>
// @ is an alias to /src
import Video from '@/components/Video.vue'
import Bulletin from '@/components/Bulletin.vue'
import moment from 'moment';
import _ from 'lodash';

export default {
  name: 'VideoEdit',
  components: {
    Video,
    Bulletin
  },
  data() {
    return {
      kinds: ['church', 'sabbath school', 'graduation', 'other'],
      curDate: null,
      dateMenu: false,
      video: this.$store.getters.getVideo(this.$route.params.id),
      admin_video: null,
    }
  },
  computed: {
    dirty() {
      return !_.isEqual(this.admin_video, {...this.video, ...{date: moment(this.video.date).format('YYYY-MM-DD')}});
    },
    maxDate() {
      return moment().format('YYYY-MM-DD');
    },
  },
  methods: {
    save() {
      this.$store.dispatch('saveVideo', {orig: this.video, video: this.admin_video});
    },
    reset() {
      this.admin_video = JSON.parse(JSON.stringify({...this.video, ...{date: moment(this.video.date).format('YYYY-MM-DD')}}));
    },
  },
  created() {
    this.reset();
  },
}
</script>

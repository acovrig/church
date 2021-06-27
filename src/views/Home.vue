<template>
  <div class="home">
    <VideoIndex :lst="videos" :admin="isAdmin" />
  </div>
</template>

<script>
// @ is an alias to /src
import VideoIndex from '@/components/VideoIndex.vue'
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    VideoIndex
  },
  data() {
    return {
      videos: [],
    }
  },
  computed: {
    ...mapState(['events']),
    isAdmin() { return this.$store.getters.admin; },
  },
  watch: {
    events(newVal) {
      this.videos = newVal;
    }
  },
  created: function() {
    this.$store.dispatch('initStore');
  }
}
</script>

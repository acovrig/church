<template>
  <div class="home">
    <VideoIndex :lst="videos" />
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
  computed: mapState(['events']),
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

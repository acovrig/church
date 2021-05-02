<template>
  <div class="home">
    <b-container>
      <VideoIndex :lst="db" />
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import VideoIndex from '@/components/VideoIndex.vue'

export default {
  name: 'Home',
  components: {
    VideoIndex
  },
  data() {
    return {
      db: this.$store.state.db,
    }
  }
}
</script>

<template>
  <div class="watch">
    <Video :video="video" />
    <Bulletin :video="video" v-if="video.pdf != null || (video.chapters != null && video.chapters.length > 0)" />
  </div>
</template>

<script>
// @ is an alias to /src
import Video from '@/components/Video.vue'
import Bulletin from '@/components/Bulletin.vue'

export default {
  name: 'Watch',
  components: {
    Video,
    Bulletin
  },
  data() {
    return {
    }
  },
  computed: {
    video: function() {
      return this.$store.getters.getVideo(this.$route.params.id);
    }
  }
}
</script>

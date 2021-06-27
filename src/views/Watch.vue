<template>
  <div class="watch">
    <v-btn
      v-if="admin"
      :to="`/watch/${$route.params.id}/edit`"
      style="text-decoration: none;"
      color="warning">
      <v-icon>mdi-pencil</v-icon> Edit
    </v-btn>
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
    video() {
      return this.$store.getters.getVideo(this.$route.params.id);
    },
    admin() { return this.$store.getters.admin },
  },
  created() {
    if (this.$store.getters.notify) {
      this.$store.getters.notify.forEach((notify) => {
        this.$toast(notify.msg, {
          position: "top-right",
          timeout: 10000,
          icon: true,
          type: notify.type,
        });
      });
      this.$store.commit('notify', []);
    }
  },
}
</script>

<template>
  <div>
    <h1>Video List</h1>
    <ul>
      <li v-for="vid in videos" :key="vid.fn">
        <a :href="'/watch/' + vid.fn">{{ vid.date + ' - ' + vid.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'VideoIndex',
  props: {
    lst: Array
  },
  computed: {
    videos: function() {
      console.log(this.$route.params.program);
      if(this.$route.params.program != null) {
        return this.lst.filter(vid => vid.kind == this.$route.params.program);
      }
      return this.lst;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
}
</style>

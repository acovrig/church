<template>
  <div>
    <h1>Video List</h1>
    <b-table striped dark hover :items="videos" :fields="fields">
      <template #cell(type)="data">
        <router-link :to="'/watch/' + data.item.fn">{{ data.value | upper }}</router-link>
      </template>
      <template #cell(speaker)="data">
        <router-link :to="'/?who=' + data.value">{{ data.value }}</router-link>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'VideoIndex',
  props: {
    lst: Array
  },
  data() {
    return {
      fields: ['date', 'type', 'title', 'speaker']
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
        ret.push({
          date: v.date,
          fn: v.fn,
          type: v.kind == 'ss' ? 'Sabbath School': v.kind,
          title: chapt == null ? '' : chapt.info,
          speaker: chapt == null ? '' : chapt.who
        });
      //   if(ret.filter().length > 0)
      //   let e = ret.pop();
        // ret.push(e);
      });
      return ret;
    }
  },
  filters: {
    upper(value) {
      value.toLowerCase().split(' ');
      return value.charAt(0).toUpperCase() + value.slice(1);
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

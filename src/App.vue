<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-btn @click="homeClick()" text>
          SGSDA Church
        </v-btn>
        <v-btn to="/about" text>
          About
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              v-bind="attrs"
              v-on="on"
            >
              Programs
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in programs"
              :key="index"
              :to="item.path">
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex mt-8">
        <v-text-field
          label="Search"
        />
        <v-btn v-if="!showAdmin && clickedHome > 0" text>
          {{ 'Admin'.substring(0, clickedHome) }}
        </v-btn>
        <v-btn v-if="showAdmin" to="/admin" text>
          {{ 'Admin'.substring(clickedHome) }}
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    programs: [
      { title: 'Church', path: '/programs/church' },
      { title: 'Sabbath School', path: '/programs/sabbath_school' },
      { title: 'Graduation', path: '/programs/graduation' },
      { title: 'Other', path: '/programs/other' },
    ],
    clickedHome: 0,
    clickTimer: null,
    showAdmin: false,
  }),
  methods: {
    homeClick() {
      if (this.$route.path === '/') {
        clearInterval(this.clickTimer);
        this.clickTimer = setInterval(() => {
          this.clickedHome -= 1;
          if (this.clickedHome < 1) {
            this.clickedHome = 0;
            clearInterval(this.clickTimer);
          }
        }, 1000);
        this.clickedHome += 1;
        if (this.clickedHome > 4) {
          this.clickedHome = 0;
          this.showAdmin = !this.showAdmin;
        }
      } else {
        this.$router.push('/')
      }
    },
  },
};
</script>
<style lang="scss">
html, body, #app {
  min-height: 100vh;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>

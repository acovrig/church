<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark>
      <span class="d-flex d-sm-none">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </span>
      <div class="d-flex align-center">
        <v-btn @click="homeClick()" text>
          <v-icon>mdi-home</v-icon>
          <!-- SGSDA Church -->
        </v-btn>
        <div class="d-none d-sm-flex">
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
      </div>

      <v-spacer class="d-none d-sm-flex" />
      <h3 class="mt-3 mx-auto">SGSDA Church</h3>
      <v-spacer class="d-none d-sm-flex" />

      <div class="mt-8 d-none d-sm-flex">
        <v-text-field
          label="Search"
          v-model="search"
        />
      </div>
      <div class="align-center d-none d-sm-flex">
        <v-btn
          v-if="!admin && showAdmin"
          @click="setAdmin(!admin)"
          text>
          log in
        </v-btn>
        <v-btn
          v-if="admin"
          @click="setAdmin(!admin)" text>
          log out
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list
        nav
        dense>
        <v-list-item-group
          active-class="deep-purple--text text--accent-4">
          <v-list-item to="/" @click="homeClick()" style="text-decoration: none;">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item to="/about" style="text-decoration: none;">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
          <v-list-group
            no-action>
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>mdi-shape</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Categories</v-list-item-title>
            </template>
            <v-list-item
              link
              to="/programs/all"
              exact>
              <v-list-item-content>
                <v-list-item-title>
                  View All
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-item
              v-for="prog in programs"
              :key="prog.title"
              link
              :to="prog.path"
              exact>
              <v-list-item-content>
                <v-list-item-title>
                  {{ prog.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>


        
          <v-list-item class="d-flex align-center">
            <v-list-item-icon style="align-self: center;">
              <v-icon>mdi-movie-search</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-text-field
                label="Search"
                v-model="search"
              />
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="!admin && showAdmin"
            @click="setAdmin(!admin)">
            <v-list-item-icon>
              <v-icon>mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-title>log in</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="admin"
            @click="setAdmin(!admin)">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>log out</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    programs: [
      { title: 'Church', path: '/programs/church' },
      { title: 'Sabbath School', path: '/programs/sabbath_school' },
      { title: 'Graduation', path: '/programs/graduation' },
      { title: 'Other', path: '/programs/other' },
    ],
    search: '',
    clickedHome: 0,
    clickTimer: null,
    showAdmin: false,
  }),
  computed: {
    admin() { return this.$store.getters.admin },
  },
  methods: {
    homeClick() {
      if (this.$route.path === '/') {
        // console.log(Math.ceil((this.clickedHome*5)/7), (this.clickedHome*5)/7);
        clearInterval(this.clickTimer);
        this.clickTimer = setInterval(() => {
          this.clickedHome -= 1;
          if (this.clickedHome < 1) {
            this.clickedHome = 0;
            clearInterval(this.clickTimer);
          }
        }, 1000);
        this.clickedHome += 1;
        if (this.clickedHome > 4 && !this.admin) {
          this.clickedHome = 0;
          this.showAdmin = !this.showAdmin;
          if (!this.showAdmin) this.setAdmin(false);
        }
      } else {
        this.$router.push('/')
      }
    },
    setAdmin(val) {
      if (val) {
        const key = prompt('key');
        if (key !== '' && key !== null && key !== undefined) {
          this.$store.commit('key', key);
        }
      } else {
        this.$store.commit('key', null);
        if (this.$route.name == 'EditVideo') this.$router.push({ name: 'Watch', params: this.$router.params });
      }
      this.showAdmin = val;
      this.drawer = false;
    }
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

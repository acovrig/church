<template>
  <div id="app" class="bg-dark text-light">
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand to="/">Home</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item-dropdown text="Programs" right>
            <b-dropdown-item to="/programs/church">Church</b-dropdown-item>
            <b-dropdown-item to="/programs/ss">Sabbath School</b-dropdown-item>
            <b-dropdown-item to="/programs/graduation">Graduation</b-dropdown-item>
            <b-dropdown-item to="/programs/other">Other</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- <keep-alive> -->
      <router-view/>
    <!-- </keep-alive> -->
  </div>
</template>

<style>
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

<template>
  <div id="app" class="container-background">
    <div id="nav">
      <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
          <b-navbar-brand to="/">
            <img src="./assets/TranslatorLogo.png" alt="Logo" height="70" width="70"/>
          </b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-item to="/OwnProjects" v-bind:disabled="getUser==null">Мои проекты</b-nav-item>
              <b-nav-item to="/projects" v-bind:disabled="getUser==null">Чужие проекты</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">

              <b-nav-item-dropdown v-if="getUser!=null">
                <template right v-slot:button-content v-if="getUser!=null">
                  <em>{{getUser.name+"#"+getUser.id}}</em>
                </template>
                <b-dropdown-item to="/profile">Profile</b-dropdown-item>
                <b-dropdown-item href="#" @click="logout">Sign Out</b-dropdown-item>
              </b-nav-item-dropdown>
              
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions } from "vuex";
export default {
  methods:{
    ...mapActions(["logoutUser"]),
    logout(evt){
      evt.preventDefault();
      this.logoutUser();
      this.$router.push({name:"Home"});
    }
  },
  computed:{
    ...mapGetters(["getUser"])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.container-background{
  background-color: rgb(59, 63, 66);
  min-height: 100vh;
}
</style>

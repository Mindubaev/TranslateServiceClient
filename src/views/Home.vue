<template>
  <b-container class="bv-example-row container-background">
    <loginForm v-if="getUser==null"/>

    <b-jumbotron header="LinkTXT" v-if="getUser!=null && getUser!=undefined" lead="Сервис для коллаборации переводчиков" class="mt-2">
      <p>Создайте свой первый проект или присоединитесь к сущуствующей команде!</p>
      <b-button variant="primary" class="mt-1" to="/OwnProjects">Создать свой проект</b-button>
      <b-button variant="success" class="mt-1 ml-1" to="/projects">Посмотреть доступные проекты</b-button>
    </b-jumbotron>

</b-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import LoginForm from '@/components/LoginForm'
export default {
  name: 'Home',
  components: {
    loginForm: LoginForm
  },
  computed:{
    ...mapGetters(["getUser"])
  }
}
</script>

<style scoped>
.container-background{
  background-color: rgb(59, 63, 66);
}
</style>

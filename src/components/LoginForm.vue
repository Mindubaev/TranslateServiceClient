<template>
  <div>
    <b-form 
    @submit="onSubmit" 
    @reset="onReset" 
    class="w-30 p-3 mb-1 bg-secondary text-light mt-3">
      <b-form-group id="input-group-1" label="Логин:" label-for="input-1" label-align="left" label-cols-md="0" label-cols-lg="3">
        <b-form-input
          id="input-1"
          size="sm"
          v-model="form.username"
          type="text"
          required
          placeholder="Введите логин"
        ></b-form-input>
        <b-form-invalid-feedback :state="isValidUsername">Слишком короткий логин</b-form-invalid-feedback>
        <b-form-valid-feedback :state="isValidUsername">Отлично</b-form-valid-feedback>
        <b-form-invalid-feedback :state="isAuthFail">неверное имя пользователя</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-2" label="Пароль:" label-for="input-2" label-align="left" label-cols-md="0" label-cols-lg="3">
        <b-form-input
          id="input-2"
          size="sm"
          v-model="form.password"
          type="password"
          required
          placeholder="Введите пароль"
        ></b-form-input>
        <b-form-invalid-feedback :state="isValidPassword">Слишком короткий пароль</b-form-invalid-feedback>
        <b-form-valid-feedback :state="isValidPassword">Отлично</b-form-valid-feedback>
        <b-form-invalid-feedback :state="isAuthFail">неверный пароль</b-form-invalid-feedback>
      </b-form-group>

      <b-button size="sm" type="submit" variant="primary">Войти</b-button>
      <b-button size="sm" type="reset" variant="danger" >Очистить</b-button>
      <b-button size="sm" type="toRegistrForm" to="/registration" variant="success" >Зарегистрироваться</b-button>
    </b-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "LoginForm",
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      validation: {
        isValid:true,
        username:{
          message:''
        },
        password:{
          message:''
        }
      },
      show:true
    };
  },
  methods: {
    ...mapActions(["loginUser"]),
    onSubmit(evt) {
      evt.preventDefault();
      if (this.form.username.length != 0 && this.form.password.length != 0) {
        try {
          this.isValid=false;
          this.loginUser(this.form);
        } catch (ex) {
          console.log(ex);
        }
      }
    },
    onReset(evt) {
      this.form.username="";
      this.form.password="";
    }
  },
  computed: {
    ...mapGetters(["getUser","getAuthFail"]),
    isValidPassword(){
      return (this.form.password.length>4);
    },
    isValidUsername(){
      return (this.form.username.length>4);
    },
    isAuthFail(){
      return !this.getAuthFail;
    }
  },
  watch: {
    getUser(newVal, oldVal) {
      if (newVal != null && newVal != undefined) {
        this.show=false;
      }
    }
  }
};
</script>
<style >

</style>

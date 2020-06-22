<template>
    <div>
        <b-form @submit="onSubmit"
            class="w-30 p-3 mb-1 bg-secondary text-light mt-3">

            <b-form-group id="input-group-0" label="Имя:" label-for="input-0" label-align="left" label-cols-md="0" label-cols-lg="3">
                <b-form-input
                id="input-0"
                size="sm"
                v-model="form.name"
                type="text"
                required
                placeholder="Введите имя"
                ></b-form-input>
                <b-form-invalid-feedback :state="isValidName">Введите хотя бы 4 символа</b-form-invalid-feedback>
                <b-form-valid-feedback :state="isValidName">Отлично</b-form-valid-feedback>
                <b-form-invalid-feedback :state="isAuthFail">Недопустимое имя</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="input-group-1" label="Логин:" label-for="input-1" label-align="left" label-cols-md="0" label-cols-lg="3">
                <b-form-input
                id="input-1"
                size="sm"
                v-model="form.username"
                type="text"
                required
                placeholder="Введите логин"
                ></b-form-input>
                <b-form-invalid-feedback :state="isValidUsername">Введите хотя бы 4 символа</b-form-invalid-feedback>
                <b-form-valid-feedback :state="isValidUsername">Отлично</b-form-valid-feedback>
                <b-form-invalid-feedback :state="isAuthFail">Недопустимый логин</b-form-invalid-feedback>
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
                <b-form-invalid-feedback :state="isValidPassword">Введите хотя бы 4 символа</b-form-invalid-feedback>
                <b-form-valid-feedback :state="isValidPassword">Отлично</b-form-valid-feedback>
                <b-form-invalid-feedback :state="isAuthFail">Недопустимый пароль</b-form-invalid-feedback>
            </b-form-group>

            <b-button size="sm" type="submit" variant="primary">Зарегистрироваться</b-button>
            <b-button size="sm" to="/" variant="danger">Вход в систему</b-button>
        </b-form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "RegistrationForm",
  data() {
    return {
      form: {
        username: "",
        password: "",
        name:""
      }
    //   loader:true
    };
  },
  components: {

  },
  methods:{
      ...mapActions(["postUser"]),
    onSubmit(evt) {
      evt.preventDefault();
      if (this.form.username.length != 0 && this.form.password.length != 0 && this.form.name.length!=null) {
        try {
          this.postUser(this.form);
        } catch (ex) {
          console.log(ex);
        }
      }
    }
  },
  computed:{
    ...mapGetters(["getUser","getAuthFail"]),
    isValidName(){
    return (this.form.name.length>0);
    },
    isValidPassword(){
    return (this.form.password.length>0);
    },
    isValidUsername(){
    return (this.form.username.length>0);
    },
    isAuthFail(){
    return !this.getAuthFail;
    }
  },
  watch: {
    getUser(newVal, oldVal) {
      console.log("watcher watch");
      if (newVal != null && newVal != undefined) {
        this.$router.push({name:"Home"});
      }
    }
  }
}
</script>

<style scoped>
</style>
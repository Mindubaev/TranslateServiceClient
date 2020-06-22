<template>
    <div>
        <b-form @submit="onNameSubmit"
            class="w-75 p-3 bg-secondary text-light mt-3 mx-auto">

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
                <b-form-invalid-feedback :state="getUserPatched">Недопустимое имя</b-form-invalid-feedback>
            </b-form-group>

            <label v-if="changed && nameChanged" class="mr-1" style="color:green;">Изменения сохранены</label>
            <b-button size="sm" type="submit" variant="primary">Изменить</b-button>
        </b-form>

        <b-form @submit="onUsernameSubmit"
            class="w-75 p-3 bg-secondary text-light mx-auto">
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
                <b-form-invalid-feedback :state="getUserPatched">Недопустимый логин</b-form-invalid-feedback>
            </b-form-group>
            <label v-if="changed && usernameChanged" class="mr-1" style="color:green;">Изменения сохранены</label>
            <b-button size="sm" type="submit" variant="primary">Изменить</b-button>
        </b-form>

        <b-form @submit="onPasswordSubmit"
            class="w-75 p-3 mb-1 bg-secondary text-light mx-auto">
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
                <b-form-invalid-feedback :state="getUserPatched">Недопустимый пароль</b-form-invalid-feedback>
            </b-form-group>

            <label v-if="changed && passwordChanged" class="mr-1" style="color:green;">Изменения сохранены</label>
            <b-button size="sm" type="submit" variant="primary">Изменить</b-button>
        </b-form>
    </div>
</template>

<script>
import {mapActions,mapGetters} from "vuex";
export default {
    name:"PersonForm",
    data(){
        return{
            form:{
                name:"",
                username:"",
                password:""
            },
            changed:false,
            nameChanged:false,
            usernameChanged:false,
            passwordChanged:false
        };
    },
    methods:{
        ...mapActions(["patchUser"]),
        onNameSubmit(evt){
            evt.preventDefault();
            this.changed=false;
            this.nameChanged=true;
            this.usernameChanged=false;
            this.passwordChanged=false;
            let user={name:this.form.name};
            this.patchUser(user);            
        },
        onUsernameSubmit(evt){
            evt.preventDefault();
            this.changed=false;
            this.nameChanged=false;
            this.usernameChanged=true;
            this.passwordChanged=false;
            let user={username:this.form.username};
            this.patchUser(user);            
        },
        onPasswordSubmit(evt){
            evt.preventDefault();
            this.changed=false;
            this.nameChanged=false;
            this.usernameChanged=false;
            this.passwordChanged=true;
            let user={password:this.form.password};
            this.patchUser(user);            
        },
    },
    computed:{
        ...mapGetters(["getUser","getUserPatched"]),
        isValidName(){
        return (this.form.name.length>0);
        },
        isValidPassword(){
        return (this.form.password.length>0);
        },
        isValidUsername(){
        return (this.form.username.length>0);
        }
    },
    watch:{
        getUser(oldval,newVal){
            if (newVal != null && newVal != undefined)
                this.changed=true;
        }
    },
    beforeMount(){
        this.form.name=this.getUser.name;
    }
}
</script>
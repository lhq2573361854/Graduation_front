<template>
  <v-row justify="center" class="py-5">
    <v-col cols="12" lg="8" md="6" sm="4"  class="text-center" style="background-color: white">
      <v-list-item >
        <v-list-item-title class="headline text-center text-h4 font-weight-black">
          注册系统
        </v-list-item-title>
      </v-list-item>
      <v-form>
        <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            :counter="20"
            label="Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
            autocomplete="off"

        ></v-text-field>
        <v-text-field
            v-model="password"
            :error-messages="passwordErrors"
            label="Password"
            required
            counter
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="passwordShow = !passwordShow"
            :type="passwordShow ? 'text' : 'password'"
            autocomplete="off"
        ></v-text-field>
        <v-text-field
            v-model="repeatPassword"
            :error-messages="repeatPasswordErrors"
            counter
            label="repeatPassword"
            required
            :append-icon="repeatPasswordShow ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="repeatPasswordShow = !repeatPasswordShow"
            placeholder="密码"
            :type="repeatPasswordShow ? 'text' : 'password'"
            @input="$v.repeatPassword.$touch()"
            @blur="$v.repeatPassword.$touch()"
            autocomplete="off"
        ></v-text-field>
        <v-text-field
            v-model="email"
            :error-messages="emailErrors"
            label="E-mail"
            required
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
            autocomplete="off"
        ></v-text-field>
        <v-combobox
            v-model="select"
            :items="items"
            label="Sex"
            dense
        ></v-combobox>
        <v-text-field
            v-model="telPhoneNumber"
            :error-messages="telPhoneNumberErrors"
            label="please input a telPhone  number"
            required
            @input="$v.telPhoneNumber.$touch()"
            @blur="$v.telPhoneNumber.$touch()"
            autocomplete="off"
        >
        </v-text-field>
        <div class="divwrap">
          <v-distpicker   :province="province" :city="city" :area="area" @province="onChangeProvince" @city="onChangeCity"
                          @area="onChangeArea"></v-distpicker>
        </div>
        <v-text-field
            v-model="validateCode"
            :error-messages="validateCodeErrors"
            label="validator code"
            required
            @input="$v.validateCode.$touch()"
            @blur="$v.validateCode.$touch()"
            autocomplete="off"
        >
         <template v-slot:append-outer>
           <v-btn  width="150" color="primary" class="ml-6"> 获取验证码</v-btn>
         </template>
        </v-text-field>
        <v-checkbox
            v-model="checkbox"
            :error-messages="checkboxErrors"
            label="是否同意用户协议"
            required
            @change="$v.checkbox.$touch()"
            @blur="$v.checkbox.$touch()"
        ></v-checkbox>
        <v-btn
            class="mr-4"
            @click="submit"
        >
          submit
        </v-btn>
        <v-btn @click="clear">
          clear
        </v-btn>
      </v-form>
      <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          top
      >
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn
              color="pink"
              text
              v-bind="attrs"
              @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>

    </v-col>

  </v-row>


</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email,minLength,sameAs } from 'vuelidate/lib/validators'
import {phone} from "@/validate";
import VDistpicker from 'v-distpicker'
import {show_time} from "@/utils/finalVariables";
import request from "@/axios";

export default {
  mixins: [validationMixin],
  name:'Register',
  components:{
    VDistpicker
  },
  validations: {
    name: { required, minLength:minLength(8)},
    password:{required,minLength:minLength(8)},
    repeatPassword:{required,sameAsPassword: sameAs('password')},
    email: { required, email },
    checkbox: {
      checked (val) {
        return val
      },
    },
    telPhoneNumber:{
      required,
      phone
    },
    validateCode:{
      required
    }
  },

  data: () => ({
    name: 'tianling',
    email: '859071431@qq.com',
    validateCode:'810114',
    checkbox: false,
    password:'123456789',
    repeatPassword:'123456789',
    telPhoneNumber:'13014035039',
    repeatPasswordShow:false,
    passwordShow:false,
    province:'安徽省',
    city:'六安市',
    area:'裕安区',
    snackbar:false,
    snackbarText:'',
    timeout:show_time,
    items:[
        '男',
        '女'
    ],
    select:'男'
  }),

  computed: {
    checkboxErrors () {
      const errors = []
      if (!this.$v.checkbox.$dirty) return errors
      !this.$v.checkbox.checked && errors.push('You must agree to continue!')
      return errors
    },
    selectErrors () {
      const errors = []
      if (!this.$v.select.$dirty) return errors
      !this.$v.select.required && errors.push('Item is required')
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.minLength && errors.push('Name must be at less 8 characters long')
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
    passwordErrors(){
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.minLength && errors.push('password must be at less 10 characters long')
      !this.$v.password.required && errors.push('password is required.')
      return errors
    },
    repeatPasswordErrors(){
      const errors = []
      if (!this.$v.repeatPassword.$dirty) return errors
      !this.$v.password.required && errors.push('repeatPassword is required.')
      !this.$v.repeatPassword.sameAsPassword &&  errors.push('Password  is not same.')
      return errors
    },
    validateCodeErrors(){
      const errors = []
      if (!this.$v.validateCode.$dirty) return errors
      !this.$v.validateCode.required && errors.push('validateCode is required.')
      return errors
    },
    telPhoneNumberErrors(){
      const errors = []
      if (!this.$v.telPhoneNumber.$dirty) return errors
      !this.$v.telPhoneNumber.required && errors.push('telPhoneNumber is required.')
      !this.$v.telPhoneNumber.phone && errors.push(this.$v.telPhoneNumber.$params.phone.type)
      return errors
    },
    getUser(){
      return {
        userName:this.name,
        userPass:this.password,
        userEmail:this.email,
        userPhone:this.telPhoneNumber,
        userCountry:'中国',
        userSex:this.select,
        userProvince:this.province,
        userCity:this.city,
        userDistrict:this.area
      }
    }
  },

  methods: {
    onChangeProvince(val){
      this.province = val.value
    },
    onChangeCity(val){
      this.city =  val.value
    },
    onChangeArea(val){
      this.area =  val.value
    },
    async submit () {
      this.$v.$touch()
      if(!this.$v.$invalid){
        console.log(1)
        const result = await request.post("/code/addUser",this.getUser)
        this.snackbar = !!result
        this.snackbarText = result.msg
      }
    },
    clear () {
      this.$v.$reset()
      this.name = ''
      this.email = ''
      this.select = null
      this.checkbox = false
    },
  },
}
</script>

<style>

.distpicker-address-wrapper select{
  width: 32% !important;
  margin: 0 3px;
}
</style>


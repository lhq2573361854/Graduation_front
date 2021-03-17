<template>
    <v-card>
      <v-toolbar
          flat
          color="primary"
          dark
      >
        <v-toolbar-title>用户登录系统</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical background-color="#eeeeee"  >
        <v-tab  >

         账号密码登录
        </v-tab>
        <v-tab>

          验证码登录
        </v-tab>
        <v-tab>

         第三方登录
        </v-tab>

        <v-tab-item  >
          <v-row justify="center" align="center" style="height: 30rem"  >
            <v-col
                cols="12"
                sm="10"
                md="8"
                lg="5"
            >
              <v-form  ref="form" >
                <v-card-text class="py-0">
                  <v-list-item three-line>
                    <v-list-item-title class="headline text-center text-h4 font-weight-black">
                      登录系统
                    </v-list-item-title>
                  </v-list-item>
                  <v-text-field
                      v-model="username"
                      placeholder="用户名/手机号码/电子邮箱"
                      autocomplete="off"
                      color="teal"
                      solo
                      @input="$v.username.$touch()"
                      @blur="$v.username.$touch()"
                      :error-messages="usernameErrorMessage"

                  >
                    <template v-slot:prepend>
                      <v-icon size="30" color="grey darken-2" class="mr-3">mdi-account-outline</v-icon>
                    </template>
                  </v-text-field>
                  <v-text-field
                      v-model="password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      placeholder="密码"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      @click:append="show1 = !show1"
                      solo
                      autocomplete="off"
                      @input="$v.password.$touch()"
                      @blur="$v.password.$touch()"
                      :error-messages="passwordErrorMessage"
                  >
                    <template v-slot:prepend>
                      <v-icon size="30" color="grey darken-2" class="mr-3">mdi-lock-outline</v-icon>
                    </template>

                  </v-text-field>
                  <v-text-field
                      placeholder="验证码"
                      solo
                      v-model="validateCode"
                      :error-messages="validateCodeErrorMessage"
                      autocomplete="off"
                      @input="$v.validateCode.$touch()"
                      @blur="$v.validateCode.$touch()"
                  >
                    <template v-slot:prepend>
                      <v-icon size="30" color="grey darken-2" class="mr-3">mdi-message-outline</v-icon>
                    </template>
                    <template v-slot:append-outer >
                      <div style="margin-top: -0.5rem">
                        <v-img :src="src" height="45" width="110" @click="getImageCode"  class="ma-0" />
                      </div>
                    </template>

                  </v-text-field>
                  <v-container class="py-0 d-flex justify-space-between">
                    <v-checkbox
                        class="ma-0"
                        v-model="rememberMe"
                        label="记住我"
                    ></v-checkbox>
                    <v-btn text color="red"  width="100">
                      忘记密码
                    </v-btn>
                  </v-container>

                </v-card-text>
                <v-card-actions class="d-flex justify-space-around pt-0">
                  <v-btn
                      color="primary"
                      @click="submit(login_path)"
                      width="100"
                      :loading="loading"
                  >
                    登录
                  </v-btn>
                  <v-btn width="100"  @click="register">
                    注册
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-col>

          </v-row>
        </v-tab-item>
        <v-tab-item  >
          <v-row justify="center"  style="height: 30rem" >
            <v-col  cols="12"
                   sm="10"
                   md="8"
                   lg="5"
                 >
            <v-form   ref="form"  >
              <v-card-text   >
                <v-list-item three-line>
                  <v-list-item-title class="headline text-center text-h4 font-weight-black">
                    登录系统
                  </v-list-item-title>
                </v-list-item>
                <v-text-field
                    v-model="phone"
                    label="手机号码"
                    color="teal"
                    solo
                    :error-messages="phoneErrorMessage"
                    @input="$v.phone.$touch()"
                    @blur="$v.phone.$touch()"
                    autocomplete="off"
                >
                  <template v-slot:prepend>
                    <v-icon size="30" color="grey darken-2" class="mr-3">mdi-account-outline</v-icon>
                  </template>
                </v-text-field>


                <v-text-field
                    placeholder="验证码"
                    solo
                    v-model="phoneMessage"
                    autocomplete="off"
                    :error-messages="phoneMessageErrorMessage"
                    @input="$v.phoneMessage.$touch()"
                    @blur="$v.phoneMessage.$touch()"
                >
                  <template v-slot:prepend>
                    <v-icon size="30" color="grey darken-2" class="mr-3">mdi-message-outline</v-icon>
                  </template>
                  <template v-slot:append-outer >
                    <div style="margin-top: -0.5rem">
                      <v-btn  height="43" width="90" color="primary" @click="getPhoneMessageCode"    class="ma-0"> 获取验证码</v-btn>
                    </div>
                  </template>

                </v-text-field>
              </v-card-text>
              <v-card-actions class="d-flex justify-space-around pt-0">
                <v-btn
                    color="primary"
                    @click="submit(message_login_path)"
                    width="100"
                    :loading="loading"
                >
                  登录
                </v-btn>
                <v-btn width="100"  @click="register">
                  注册
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item >
          <v-row  justify="center" style="height: 30rem">
            <v-col cols="12"
                   sm="8"
                   md="4"
                   lg="4"
            >

              <v-list-item three-line>
                <v-list-item-title class="headline text-center text-h4 font-weight-black">
                  第三方登录系统
                </v-list-item-title>
              </v-list-item>
              <v-btn color="blue"  height="45" class="mt-5" width="100%">QQ账号登录</v-btn>
              <v-btn color="blue" height="45" class="mt-5" width="100%">微信账号登录</v-btn>
              <v-btn color="blue" height="45" class="mt-5" width="100%">网易云邮箱登录</v-btn>


            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
      <v-snackbar
          v-model="snackbar"
          timeout="1000"
          top
      >
        {{ showText }}

        <template v-slot:action="{ attrs }">
          <v-btn
              color="red"
              text
              v-bind="attrs"
              @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </template>


<script>
import request from "@/axios";
import {mapMutations} from 'vuex'
import { validationMixin } from 'vuelidate'
import { required,minLength } from 'vuelidate/lib/validators'
import {phone} from "@/validate";
import {getImg,getPhoneCode} from "@/utils";
import * as final_variable from "@/utils/finalVariables";

export default {
  name: "Login",
  data(){
    return {
      countries: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', `Timor L'Este`, 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
      username: '',
      password: '',
      phone:'13014035039',
      show1:false,
      rememberMe:'',
      selectedItem: 1,
      loading:false,
      snackbar:false,
      showText:'',
      src:'',
      validateCode:'',
      commonLogin:false,
      test:'',
      phoneMessage:'810114',
      message_login_path:final_variable.message_login_path,
      login_path:final_variable.login_path
    }
  },
  validations: {
    password:{
      required,
      minLength:minLength(3)
    },
    phone: {
      required,
      phone
    },
    validateCode:{
      required
    },
    username:{
      required
    },
    phoneMessage:{
      required
    },
    commonFormData:['username','password','validateCode'],
    phoneFormData:['phone','phoneMessage'],


  },
  mixins:[validationMixin],
  computed: {
    commonFormData () {
        return {
          username: this.username,
          password: this.password,
          image_validateCode: this.validateCode,
        }
    },
    phoneFormData () {
      return {
        userPhone: this.phone,
        phone_validateCode: this.phoneMessage,
      }
    },
    date(){
      return Date.now()
    },
    usernameErrorMessage(){
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('用户名必须填写')

      return errors
    },
    passwordErrorMessage(){
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('密码必须填写')
      !this.$v.password.minLength && errors.push('密码长度不正确')

      return errors
    },
    phoneErrorMessage(){
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.required && errors.push('手机号码必须填写')
      !this.$v.phone.phone && errors.push(this.$v.phone.$params.phone.type)
      return errors
    },
    validateCodeErrorMessage(){
      const errors = []
      if (!this.$v.validateCode.$dirty) return errors
      !this.$v.validateCode.required && errors.push('验证码必须填写')
      return errors
    },
    phoneMessageErrorMessage(){
      const errors = []
      if (!this.$v.phoneMessage.$dirty) return errors
      !this.$v.phoneMessage.required && errors.push('验证码必须填写')
      return errors
    },


  },
  created() {
    this.getImageCode()
  },
  methods: {
    ...mapMutations(['updateCurrentUser']),
    register () {
      this.$router.push(final_variable.register_path)
    },
    async submit (val) {
      this.$v.$touch()
      let result
      if(val===this.login_path){
        if(this.$v.commonFormData.$invalid)
          return
        this.loading = true
        result = await request.post(final_variable.login_path, this.commonFormData)
        this.showData(result)
      } else if(val === this.message_login_path){
        if(this.$v.phoneFormData.$invalid)
          return
        this.loading = true
        result = await request.post(final_variable.message_login_path, this.phoneFormData)
        this.showData(result)
      }

    },
    refreshValidateCode(){
      setTimeout( ()=>{
        this.getImageCode()
        this.$v.$reset()
        this.validateCode = ''
      },final_variable.show_time)
    },
    showData(result){
      this.loading = false;
      if(result.code === final_variable.status_success){
        this.showText = final_variable.login_success_text
        this.snackbar = true
        let payload = {
          userinfo:result.data[0],
          authority:result.data[1],
          role: result.data[2],
          isAuth:true,
        }
        this.updateCurrentUser(payload)
        this.rememberMe &&  localStorage.setItem("currentUser",JSON.stringify(payload),final_variable.storage_time)
        sessionStorage.setItem("currentUser",JSON.stringify(payload),final_variable.storage_time)
        this.$v.$reset()
        this.clear()
        setTimeout(()=>{
          this.$router.push("/")
        },final_variable.redirect_time)
      }else if(result.code === final_variable.status_validate_failure){
        this.showText = result.msg
        this.snackbar = true
        this.refreshValidateCode()
      } else{
        this.showText = final_variable.login_failure_text
        this.snackbar = true
        this.refreshValidateCode()
      }
    },
     async getImageCode() {
      this.src = await getImg()
    },
     async getPhoneMessageCode(){
      const result = await getPhoneCode()
      this.snackbar = !! result
      this.showText = result.msg

    },
    clear(){
      this.username = ''
      this.phoneMessage = ''
      this.phone = ''
      this.validateCode = ''
      this.password = ''
    }

  },
}
</script>

<style scoped>

</style>

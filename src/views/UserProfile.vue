<template>
  <v-row justify="center" >
    <v-col cols="12" lg="12" class="text-center">
      <v-data-table
          :headers="headers"
          :items="desserts"
          class="elevation-1"
          :items-per-page="page"
          hide-default-header
          :loading="tableLoading"
          loading-text="Loading... Please wait"
      >
        <template v-slot:item.actions="{item}">
          <div class="d-flex justify-center">
            <v-btn color="primary" :disabled="item.action" @click="updateUserInfo(item)" >
              修改
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-col>
    <v-col>
      <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">修改信息</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-form>
                      <v-text-field
                          :label="editedItem.category"
                          v-model="editedItem.value"
                          type="password"
                          :error-messages="passwordErrorMessage"
                          @blur="$v.editedItem.value.$touch()"
                          @input="$v.editedItem.value.$touch()"
                          required
                      ></v-text-field>
                    </v-form>

                  </v-col>
                </v-row>

              </v-container>


            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false"
              >
                Close
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  :loading="loading"
                  @click="updateUser"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-col>
  </v-row>


</template>
<script>
import request from "@/axios";
import {mapGetters,mapMutations} from 'vuex'
import {assertUserLogin} from "@/utils";
import * as finalVaribales from "@/utils/finalVariables";
import {validationMixin} from "vuelidate";
import {minLength, required} from 'vuelidate/lib/validators'

export default {
  name:'UserProfile',
  mixins: [validationMixin],
  mounted() {
     request.get("/field-explain/getAllFieldExplain").then(result=>{
       this.filedExplain = result.data
       this.tableLoading = false;
     })
  },
  validations:{
    editedItem:{
      value:{
        required,
        minLength:minLength(3)
      }
    },
  },
  data () {
    return {
      headers: [
        {text: 'Category', value: 'category'},
        {text: 'Value', value: 'value' },
        {text: 'Actions', value: 'actions' },
      ],
      desserts: [],
      isShow: false,
      filedExplain:[],
      page:15,
      dialog:false,
      editedIndex:-1,
      editedItem:{
        'category' : '',
        'value':  '',
        'action':false,
      },
      tagName:'',
      loading:false,
      tableLoading:true,
      allowUpdate:["userPass"]
    }
  },
  created() {
    assertUserLogin()
  },
  methods: {
    ...mapMutations(["updateCurrentUser"]),
    updateUserInfo(item){
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({},item)
      this.tagName = this.filedExplain.find(value => item.category === value.fieldExplain)["fieldName"].replace(/[a-zA-Z]*_/,"")
      this.dialog = true
    },
    updateUser(){
      this.$v.$touch()
      if(!this.$v.$invalid){
        this.loading = true
        let parse = JSON.parse(sessionStorage.getItem("currentUser"));
        parse.userinfo[this.tagName] = this.editedItem.value
        console.log(parse)
        request.post("/update/user",parse.userinfo).then(result=>{
          this.loading =!result
          this.dialog = !result
          parse.userinfo = result.data
          this.updateCurrentUser(parse)
          sessionStorage.setItem("currentUser",parse,3600)
        })
      }


    },
    getRole(roles){
      if( roles.search("admin") !== -1){
        return finalVaribales.admin_text;
      }else if( roles.search("vip") !== -1){
        return  finalVaribales.vip_text
      }
      return finalVaribales.common_user
    },
    setRoleInfo(data){
      let obj =   {
        'category' : this.getFieldExplain('role'),
        'value':  this.getRole(data.role),
        'action':true,
      }
     this.desserts.push(obj)
    },
    setBasicInfo(data){
      this.updateCurrentUser(data)
      Object.keys(data.userinfo).forEach(value => {
        if( value !== "id"){
          let fieldExplain = this.getFieldExplain('user_'+value)
          let obj =   {
            'category' : fieldExplain,
            'value':  data.userinfo[value],
            'action':this.allowUpdate.findIndex(value1 => value1 === value) === -1,
          }
          if(value === "userPass"){
            obj.value =  ' * * * * * * * *'
          }
          this.desserts.push(obj)
        }
      })
      this.setRoleInfo(data)
    }

  },
  computed:{
    ...mapGetters(["getUserInfo"]),
    getFieldExplain(){
      return (value)=> this.filedExplain.filter(item=> item["fieldName"] === value).map(item=> item["fieldExplain"])[0]
    },
    getFieldName(){
      return (item)=> this.filedExplain.find(value => item.category === value.fieldExplain).fieldName
    },
    passwordErrorMessage(){
      const error = []
      !this.$v.editedItem.value.required && error.push('密码不能为空')
      !this.$v.editedItem.value.minLength && error.push('至少有三位')
      return error;
    }
  },
  watch:{
    filedExplain(){
      let data = this.getUserInfo || JSON.parse(sessionStorage.getItem("currentUser")) || JSON.parse(localStorage.getItem("currentUser"))
      if(data) this.setBasicInfo(data)
    }
  },

}
</script>

<style scoped>

</style>

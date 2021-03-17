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
                    <v-text-field
                        label="Password*"
                        v-model="editedItem.value"
                        required
                    ></v-text-field>
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

export default {
  name:'UserProfile',
   mounted() {
     request.get("/field-explain/getAllFieldExplain").then(result=>{
       this.filedExplain = result.data
       this.tableLoading = false;
     })

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
      allowUpdate:["userName","userPass","userEmail","userPhone"]
    }
  },
  created() {
    assertUserLogin()
  },
  methods: {
    ...mapMutations(["updateCurrentUser"]),
    updateUserInfo(item){
      this.editedIndex = this.desserts.indexOf(item)
      console.log("item",item)
      this.editedItem = Object.assign({},item)
      this.tagName = this.filedExplain.find(value => item.category === value.fieldExplain).fieldName
      this.dialog = true
    },
    updateUser(){
      this.loading = true
      Object.assign(this.desserts[this.editedIndex],this.editedItem)
      let parse = JSON.parse(sessionStorage.getItem("currentUser"));
      parse.userinfo[this.tagName] = this.editedItem.value
      sessionStorage.setItem("currentUser",JSON.stringify(parse),3600)
      localStorage.setItem("currentUser",JSON.stringify(parse),3600)
      this.updateCurrentUser(parse)
      console.log(parse)
      request.post("/user/updateUserById",parse.userinfo).then(result=>{
        this.loading =!result
        this.dialog = !result
      })

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
    }
  },
  watch:{
    filedExplain(){
      let data = this.getUserInfo || JSON.parse(sessionStorage.getItem("currentUser")) || JSON.parse(localStorage.getItem("currentUser"))
      if(data) this.setBasicInfo(data)
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <v-card
      class="mx-auto"
      rounded
  >
    <v-card-text class="pa-0">
      <v-list rounded>
        <v-list-item-group
            color="primary"
        >
            <v-list-item
                v-for="(item, i) in items"
                :key="i"
                link
                :to="item.link"
            >
              <v-list-item-icon>
                <v-icon color="light-blue darken-4" v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider key="1" ></v-divider>

    <v-row justify="center" align="center" class="text-center mx-2 mt-2 ">
      <v-col cols="6">
        <v-btn class="text-center" rounded color="primary"  :disabled="getShowItem" @click="logoutOut">退出登录</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn class="text-center" rounded color="secondary" >搜索</v-btn>
      </v-col>

      <v-col cols="12" class="pb-5">
        <v-text-field
            background-color="grey lighten-1"
            label="请输入关键词"
            height="100%"
            dense
            flat
            hide-details
            rounded
            solo
            class="pa-0 ma-0"
        ></v-text-field>

      </v-col>
    </v-row>

      <v-divider key="2"  ></v-divider>

      <v-col cols="12"  class="pa-0">
        <v-dialog
            v-model="acceptDialog"
            max-width="290"
        >
          <v-card>
            <v-card-title class="headline">
              LOGOUT
            </v-card-title>

            <v-card-text>
              你确定要登录嘛
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                  color="green darken-1"
                  text
                  @click="acceptDialog = false"
              >
                {{ cancel_text }}
              </v-btn>

              <v-btn
                  color="green darken-1"
                  text
                  @click="logout"
              >
                {{ determine_text }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import {clearCookie} from "@/utils";
import * as finalVariables from "@/utils/finalVariables";

export default {
  name: "UserProfile",
  data (){
    return{
      items: [
        { text: '用户登录', icon: 'mdi-clock' ,link:'/login'},
        { text: '个人中心', icon: 'mdi-account' ,link: '/profile'},
      ],
      dialog:false,
      acceptDialog:false,
      cancel_text:finalVariables.cancel_text,
      determine_text:finalVariables.determine_text,
    }
  },
  methods:{
    ...mapMutations(["updateCurrentUser"]),
    logoutOut(){
      this.acceptDialog = true
    },
    logout(){
      this.updateCurrentUser("")
      localStorage.removeItem("currentUser")
      sessionStorage.removeItem("currentUser")
      clearCookie("auth_token")
      this.acceptDialog = false
    }
  },
  computed:{
    ...mapGetters(["getUserInfo"]),
    getShowItem(){
      return ! (this.getUserInfo || localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser"))
    }
  }
}
</script>

<style scoped>

</style>

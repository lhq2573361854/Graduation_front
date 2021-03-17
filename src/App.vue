<template>
  <v-app>
    <ApplicationNavBar></ApplicationNavBar>
    <ApplicationMain></ApplicationMain>
  </v-app>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: "App",
  methods:{
    ...mapMutations(["updateCurrentUser"])
  },
  components:{
    ApplicationNavBar:()=> import('@/views/ApplicationNavBar'),
    ApplicationMain:()=> import('@/views/ApplicationMain')
  },
  data: () => ({
    links: [
      { name:"首页",route:"/home"},
      { name:"栏目",route:"/category"},
      { name:"文章",route:"/article"},
      { name:"留言板",route:"/message"},
    ],
  }),
  created() {
    let userData = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser")
    if(userData)
      this.updateCurrentUser(JSON.parse(userData))
    this.$store.commit("setWebSocket")

  }
}
</script>

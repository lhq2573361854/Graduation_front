<template>
  <v-row style="height: 20rem" align="center">
    <v-col cols="12">
      <v-card
          class="mx-auto"
          max-width="362"
          color="amber darken-3"
      >
        <v-card-text class="text-center text-h5 font-weight-bold">
          <v-row>
            <v-col cols="12">
              {{ logout_sure_text }}
            </v-col>
            <v-snackbar
                timeout="600"
                color="blue-grey"
                absolute
                right
                top
                v-model="snackbar"
            >
              {{ logout_success_text }}
            </v-snackbar>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">

          <v-btn
              color="primary"
              @click="delUserData"
          >
            {{ cancel_text }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>


</template>

<script>
import {mapMutations} from 'vuex'
import * as finalVariables from "@/utils/finalVariables";
export default {
  name: "Logout",
  data(){
    return{
      snackbar:false,
      cancel_text:finalVariables.cancel_text,
      determine_text:finalVariables.determine_text,
      logout_sure_text:finalVariables.logout_sure_text,
      logout_success_text:finalVariables.logout_success_text,
    }
  },
  methods:{
    ...mapMutations(["updateCurrentUser"]),
    delUserData(){
      sessionStorage.removeItem("currentUser")
      localStorage.removeItem("currentUser")
      this.updateCurrentUser("")
      this.snackbar = true
      setTimeout(()=>{
        this.$router.push({path:'/'})
      },finalVariables.redirect_time)
    }
  }

}
</script>

<style scoped>

</style>

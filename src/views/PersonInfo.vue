<template>
  <v-card
      max-width="375"
      class="mx-auto"
  >
    <v-img
        src="https://cdn.vuetifyjs.com/images/lists/ali.png"
        height="220px"
        dark
    >
      <v-row class="fill-height" >
        <v-card-title>

        </v-card-title>

        <v-spacer></v-spacer>

        <v-card-title class="white--text pl-16 pt-16">
          <div class="text-h5 pl-16 pt-16 text-h4">
            {{getCurrentUser.userName | defaultInfo}}
          </div>
        </v-card-title>
      </v-row>
    </v-img>

    <v-list two-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="green accent-4">
            mdi-phone
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ getCurrentUser.userPhone  }}</v-list-item-title>
          <v-list-item-subtitle>Mobile</v-list-item-subtitle>
        </v-list-item-content>

      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="green accent-4">
            mdi-email
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ getCurrentUser.userEmail  }}</v-list-item-title>
          <v-list-item-subtitle>Personal</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>


      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="green accent-4">
            mdi-map-marker
          </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ getShowLocationInfo  }}</v-list-item-title>
          <v-list-item-subtitle>Address</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "PersonInfo",
  data(){
    return{
      loading: false,
      selection: 1,

    }
  },
  methods: {
  },
  computed:{
    ...mapGetters(["getCurrentUser"]),
    getShowLocationInfo(){
      return  this.getCurrentUser && this.getCurrentUser.userProvince  +  '·' + this.getCurrentUser.userCity  + '·'+ this.getCurrentUser.userCountry
    }
  },
  filters:{
    defaultInfo(value){
      if(value) return   value.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
      return value
    }
  }
}
</script>

<style scoped>

</style>

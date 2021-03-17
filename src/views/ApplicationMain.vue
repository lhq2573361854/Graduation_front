<template>
  <v-main class="grey lighten-3 ">
    <v-container>
      <v-row >
        <v-col
            cols="12"
            sm="2"
        >
          <v-sheet
              rounded="lg"
              min-height="268"
          >
            <PersonInfo></PersonInfo>

          </v-sheet>

          <v-sheet
              rounded="lg"
              class="mt-5"
          >
            <UserProfile></UserProfile>
          </v-sheet>
        </v-col>
        <v-col
            cols="12"
            sm="8"
        >
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"/>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"/>
        </v-col>
        <v-col
            cols="12"
            sm="2"
        >
          <v-sheet
              rounded="lg"
              min-height="268"
          >
            <DateAndWeather></DateAndWeather>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

</template>

<script>
import DateAndWeather from "@/views/DateAndWeather";
import PersonInfo from "@/views/PersonInfo";
import UserProfile from "@/views/UserInfo"
export default {
  name: "ApplicationMain",
  components:{
    DateAndWeather,
    PersonInfo,
    UserProfile,
  }
}
</script>

<style scoped>

</style>

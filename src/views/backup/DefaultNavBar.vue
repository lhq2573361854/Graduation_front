<template>
  <v-app-bar
      app
      color="white"
      flat
  >
    <v-tabs
        centered
        color="grey darken-4"
        show-arrows
        background-color="brown lighten-1"
        center-active
    >

      <v-tabs-slider color="red"></v-tabs-slider>
      <v-tab
          v-for="link in links"
          :key="link.name"
          class="font-weight-black text-lg-h5"
          link
          :to="link.route"
      >
        <span class="text-center mx-5 " >{{ link.name }}</span>
      </v-tab>
    </v-tabs>
    <v-app-bar-nav-icon>
      <v-avatar
          color="teal"
          size="48"
      >
        <span class="white--text headline">48</span>
      </v-avatar>
    </v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script>
export default {
name: "DefaultNavBar"
}
</script>

<style scoped>

</style>

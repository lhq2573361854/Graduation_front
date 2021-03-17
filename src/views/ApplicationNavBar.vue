<template>
    <v-app-bar
        color="deep-purple accent-4"
        dark
        flat
        app
    >
        <v-tabs
            centered
            color="grey darken-4"
            show-arrows
            center-active
            background-color="brown lighten-1">

          <v-tabs-slider color="red"></v-tabs-slider>
          <v-tab
              v-for="link in links"
              :key="link.name"
              class="font-weight-black text-lg-h5"
              link
              :to="link.route"
          >
            <span class=" mx-8 " >{{ link.name }}</span>
          </v-tab>
        </v-tabs>
    </v-app-bar>
</template>

<script>
export default {
  name: "ApplicationNavBar",
  data(){
    return {
      links: [
        { name:"首页",route:"/home"},
        { name:"栏目",route:"/category"},
        { name:"文章",route:"/article"},
        { name:"留言板",route:"/message"},
      ],
    }
  },
}
</script>

<style scoped>

</style>

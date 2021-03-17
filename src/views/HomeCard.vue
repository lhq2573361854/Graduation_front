<template>
    <v-container >
      <v-row >
        <v-col
            v-for="(item, i) in articles"
            :key="i"
            cols="12"
            class="pa-0 ma-0"
        >
          <ArticleCard  :article="item" :ws="getWebSocket"></ArticleCard>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import request from "@/axios";
import {mapGetters} from 'vuex'
export default {
  name: "HomeCard",
  created() {
    request.get("/article/getCommandArticle/10").then(resolve=>{
      this.articles = resolve.data
    })
  },
  data: () => ({
    articles:[]
  }),
  components:{
    ArticleCard:()=>import("@/views/ArticleCard")
  },
  computed:{
    ...mapGetters(["getWebSocket"])
  }
}
</script>

<style scoped>

</style>

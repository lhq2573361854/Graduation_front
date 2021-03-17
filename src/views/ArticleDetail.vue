<template>
  <v-card
      elevation="8"
      outlined
      tile
  >
    <v-card-title class="text-h3 font-weight-bold">
      文章标题
    </v-card-title>
    <v-card-subtitle>
      <v-list>
          <v-list-item>
            <v-list-item-content >作者：{{this.getUserName(articleData.userId)}}</v-list-item-content>
            <v-list-item-content >发布时间：{{ articleData.articleDate }}</v-list-item-content>
            <v-list-item-content >点赞数：{{ articleData.articleStars}}</v-list-item-content>

          </v-list-item>
      </v-list>

    </v-card-subtitle>

    <v-card-text v-html="articleData.articleContent">

    </v-card-text>
  </v-card>
</template>

<script>
import request from "@/axios";
import {mapGetters} from 'vuex'
export default {
  name: "ArticleDetail",
  created() {
    console.log();
  },
  async mounted() {
    const result = await request.get(`/article/getArticleById/${this.$route.params.id}`)
    this.articleData = result.data
  },
  data(){
    return{
      articleData:''
    }
  },
  computed:{
    ...mapGetters(["getUserName"])
  }

}
</script>

<style scoped>

</style>

<template>
  <v-container >
    <v-row  class="align-content-start" style="height: 64rem">
      <v-col cols="12" v-for="(item,index) in articleList" :key="index" class="ma-0 pa-0" >
        <ArticleCard :ws="getWebSocket"  :article="item"></ArticleCard>
      </v-col>

    </v-row>

    <v-col cols="12" class="mt-6">
      <Pagination @getPageArticle="getPageArticle" @getPageArticleByCategory="getPageArticleByCategory" :total="getTotal" :pageFunction="!this.categoryName ? 'getPageArticle' : 'getPageArticleByCategory'" ></Pagination>
    </v-col>
      <v-overlay   :value="overlay">
        <v-progress-circular
            indeterminate
            size="64"
        ></v-progress-circular>
      </v-overlay>
  </v-container>
</template>
<script>
import {mapMutations,mapGetters} from 'vuex'
import request from "@/axios";

export default {
  name: "Article",
  components:{
    ArticleCard:() => import('@/views/ArticleCard'),
    Pagination:() => import('@/views/Pagination')
  },
  data(){
     return {
       ws:{},
       articleList:[],
       pageShowNumber: 5,
       isShow:true,
       overlay: true,
       test:[],
       categoryName:'',
       total:1
     }
  },
  methods:{
    ...mapMutations(['setStarList','updateStarList']),


    async getPageArticle(page) {
       const total = await request.get("/article/getAllArticleTotal")
       const result = await request.get("/article/getPageArticle", {
         params:{
           page: page,
           pageShowNumber: this.pageShowNumber,
           total: total.data
         }
       })
      this.total = total.data
       this.articleList = result.data
       this.overlay = ! result.data
     },

    async getPageArticleByCategory(page){
      const total = await request.get(`/article/getArticlesTotalByCategoryName/${this.categoryName}`)
      const result = await request.get(`/article/getPageArticleByCategoryName/${this.categoryName}`, {
        params:{
          page: page,
          pageShowNumber: this.pageShowNumber,
          total: total.data
        }
      })
      this.total = total.data
      this.articleList = result.data
      this.overlay = ! result.data
    }

  },
  created() {

  },
  mounted() {
    this.categoryName = this.$route.params.categoryName
    if(this.categoryName) this.getPageArticleByCategory(1)
    else this.getPageArticle(1)
  },
  computed:{
    getTotalVal(){
      return this.articleList.length
    },
    getTotal(){
      if(this.total === 0) return 1
      if(this.total &&  this.total < this.pageShowNumber) return 1
      return this.total && this.total % this.pageShowNumber === 0 ? this.total/ this.pageShowNumber : Math.ceil(this.total/ this.pageShowNumber )
    },
    ...mapGetters(["getUserName","getWebSocket"])
  },
  watch: {
    overlay (val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 3000)
    },
  },


}
</script>

<style scoped>

</style>

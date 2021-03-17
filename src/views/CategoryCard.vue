<template>
  <div class="text-center" >

      <v-btn v-for="(item,index) in getCategoryList" :color="getColor(index)"
             :key = "index"  class="ma-2" rounded  @click="getCategoryArticle(item.categoryName)">  {{ item.categoryName }}

      </v-btn>


  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: "CategoryCard",
  computed:{
    ...mapGetters(['getCategoryList','getColor']),
  },
  methods:{
    getCategoryArticle(category){
      this.$router.push("/article/"+category)
    }
  }

}
</script>
<style scoped>

</style>

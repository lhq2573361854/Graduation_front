<template>
  <v-card
      class="mx-auto my-2"
      color="blue-grey lighten-5"
  >
    <v-card-title class="pa-0">
      <v-toolbar flat color="blue-grey lighten-5" >
        <v-icon
            left
            color="cyan darken-3"
        >
          mdi-newspaper
        </v-icon>

        <v-toolbar-title><span class="title font-weight-light font-weight-bold ">{{ article.articleTitle }}</span> </v-toolbar-title>

        <v-spacer><v-chip
            class="ml-4"
            color="blue-grey lighten-4"
            text-color="white"
            small

        >


          {{ article.articleDate }}
        </v-chip></v-spacer>

        <v-chip
            :color="getColor(article.id)" small>
          {{ getCategoryName(article.categoryId) }}
        </v-chip>

      </v-toolbar>
    </v-card-title>
    <v-card-text class="text--primary overflow-hidden" style="height: 5rem"  >
      <div style="text-indent: 2em" class="ml-4" v-text="replaceTag(article.articleContent)"></div>
      <v-dialog
          v-model="contentDialog"
          persistent
          max-width="50%"
      >
        <v-card >
          <v-card-title class="headline">
            Comment
          </v-card-title>
          <v-card-text class="py-0">
            <div style="height: 40rem">
                <CommentCard v-for="(comment,index) in showCommentList" :key="index" :comment="comment"></CommentCard>
            </div>
            <Pagination @getPageComment="getPageComment"  pageFunction="getPageComment" :total="getTotal" ></Pagination>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="green darken-1"
                text
                @click="openCommentDialog()"
            >
              评论
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                @click="contentDialog = false"
            >
              关闭
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
          v-model="loadingDialog"
          persistent
          width="300"
      >
        <v-card
            color="primary"
            dark
        >
          <v-card-text>
            Please stand by
            <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
          v-model="innerCommentDialog"
          persistent
          width="45%"
      >
        <v-form>
          <v-card  rounded height="11rem" class="pt-5">
            <v-card-text class="py-0 px-8" >
              <v-text-field
                  required
                  color="teal"
                  solo
                  :rules="[rules.required,rules.counter]"
                  counter
                  v-model="content"
              >
              </v-text-field>
            </v-card-text>
            <v-card-actions class="d-flex justify-space-around pt-0">
              <v-col lg="6" cols="12" class="mx-5 text-center">
                <v-btn  color="primary" @click="commentCommit" class="mx-5">
                  提交
                </v-btn>
                <v-btn @click="innerCommentDialog = false"  class="mx-5">
                  关闭
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
      <v-snackbar
          v-model="isTarget"
          dark
          @click="snackbar = true"
          rounded
          top
          :timeout="timeout"
          color="red"
      >
        <div class="text-center">{{ getTextStar}}</div>
      </v-snackbar>
      <v-snackbar
          v-model="isLogin"
          timeout="800"
          top
          color="cyan"
      >
          {{ failedText }}
        <template v-slot:action="{ attrs }">
          <v-btn
              text
              v-bind="attrs"
              @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-card-text>
    <v-card-actions class="d-flex justify-space-between" >
      <v-btn
          small
          rounded
          color="grey lighten-4"
          link
          :to="`/detail/${article.id}`"
      >
        详细信息
      </v-btn>
      <v-btn
          small
          rounded
          color="grey lighten-4 "
          :loading="loadingDialog"
          @click="getCommentByArticleId(page)"
          :disabled="loadingDialog"
      >
        查看评论
      </v-btn>
      <v-btn
          rounded
          small
          @click="upStar"
          color="grey lighten-4"
      >
        <v-icon  :color="getStarColor" left>mdi-thumb-up</v-icon>
        <span v-if="getStar(article.id)"> {{ getStar(article.id) }}</span>
      </v-btn>

    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import {replaceTag,assertUserLogin} from '@/utils'
import request from "@/axios";
import * as finalVariables from "@/utils/finalVariables";
export default {
  name: "ArticleCard",
  props:{
    article:{
      type:Object
    },
    ws:{
      required: true
    },

  },
  created() {
    this.isStarClick = this.getStarClick(this.article.id)
  },
  data(){
    return{
      stars:this.article.articleStars,
      contentDialog:false,
      loadingDialog:false,
      innerCommentDialog:false,
      isStarClick:false,
      isTarget:false,
      starColor:'',
      timeout:400,
      current_ws:this.ws,
      pageShowNumber:6,
      showCommentList:[],
      content:'',
      isLogin:false,
      failedText:finalVariables.un_login_text,
      rules: {
        required: value => !!value || '请输入内容或者关闭',
        counter: value => value.length <= 100 || '最大 100 个文字 ',
      },
      page:1,
      total:1
    }
  },
  computed:{
    ...mapGetters(['getCategoryName','getStar','getUserName','getColor','getStarClick']),
    getTextStar(){
      return this.isStarClick ? "为他点赞":"取消点赞"
    },
    getStarColor(){
      return !this.isStarClick ? "grey ":"red "
    },
    getTotal(){
      if(this.total === 0) return 1
      if(this.total &&  this.total < this.pageShowNumber) return 1
      return this.total && this.total % this.pageShowNumber === 0 ? this.total/ this.pageShowNumber : Math.ceil(this.total/ this.pageShowNumber )
    },

  },
  methods:{
    ...mapMutations(['updateStarList','setStarClick']),
    upStar:function () {
      let message = {id:this.article.id,code:finalVariables.star_add_operation_back,starNumber:1}
      let login = assertUserLogin()
      if(!login){
        this.isLogin = !login
        return
      }
      if( !this.isStarClick){
        this.stars +=finalVariables.star_add_operation
        this.updateStarList(message)
        this.setStarClick(Object.assign(message,{
          isClickStar:true
        }))
        this.isStarClick = true
        this.current_ws.send( JSON.stringify(message))
      }else {
        this.stars += finalVariables.star_sub_operation
        message.code= finalVariables.star_sub_operation_back
        this.updateStarList(message)
        this.isStarClick = false
        this.setStarClick(Object.assign(message,{
          isClickStar:false
        }))
        this.current_ws.send( JSON.stringify(message))
      }
      this.isTarget = true
    },
    async getCommentByArticleId(page){
      this.loadingDialog = true
      this.showCommentList = ''
      const total =  await request.get(`/comment/getCommentTotalByArticleId/${this.article.id}`)
      this.total = total.data
      const result =  await request.get(`/comment/getPageCommentByArticleId/${this.article.id}`,{
        params:{
          page: page,
          pageShowNumber: this.pageShowNumber,
          total: total.data
        }
      })
    this.showCommentList = result.data.map(comment =>{
        return {
          ...comment,
          "usernameComment":this.getUserName(comment.commentUserId),
          "usernameCommented":this.getUserName(comment.commentOtherId),

        }
      })

      this.contentDialog = !!this.showCommentList
      this.loadingDialog = !this.showCommentList
    },
    getPageComment(page){
      if(this.page !== page){
        this.page = page
        this.getCommentByArticleId(page)
      }



    },
    replaceTag(data){
      return replaceTag(data)
    },
    openCommentDialog(){
      let login = assertUserLogin()
      if(!login){
        this.isLogin = !login
        return
      }
      this.innerCommentDialog = true
    },
    commentCommit(){
      console.log(this.content);
    }
  },
  components:{
    CommentCard: () => import('@/views/CommentCard'),
    Pagination: () => import('@/views/Pagination')
  },
  watch:{
    showCommentList(){
      console.log("改变了", this.showCommentList)
    }
  }


}
</script>

<style scoped>

</style>

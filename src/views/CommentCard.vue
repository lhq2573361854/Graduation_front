<template>
  <v-card
      class="mb-4"
      color="#26c6da"

      max-width="100%"
      left
      max-height="100%"
  >
    <v-list>
      <v-list-item>
        <v-list-item-content>

          <v-list-item-title v-text="commentInfo.commentContent"></v-list-item-title>
          <v-list-item-title class="mt-2">
            <v-list-item-subtitle v-text="commentInfo.commentTime"></v-list-item-subtitle>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-avatar>
          <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "CommentCard",
  data(){
    return{
      commentInfo: this.comment
    }
  },
  props:{
    comment:{
      type:Object,
    }
  }
}
</script>

<style scoped>

</style>

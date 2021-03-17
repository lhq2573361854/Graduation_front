<template>
  <div class="text-center " >
    <v-container>
      <v-row justify="center">
        <v-col cols="12" class="py-0" >
          <v-container class="max-width pa-0 " >
            <v-pagination
                v-model="page"
                @input="input"
                :length="total"
                total-visible="7"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  data () {
    return {
      page:1
    }
  },
  props:{
    total:{
      required:false,
      default:1
    },
    pageFunction:{
      required: true,
      type:String
    }
  },
  methods:{
     input(){
      this.$emit(this.pageFunction,this.page)
    }
  },
  watch:{

  }
}
</script>

<style scoped>

</style>

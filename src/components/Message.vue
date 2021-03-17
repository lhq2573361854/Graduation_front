<template>
  <div>
    <v-form>
      <v-container
          id="input-usage"
          fluid
      >
        <v-row>
          <v-col cols="12">
              <v-text-field
                  v-model="inputValue"
                  :error-messages="inputErrors"
                  label="请输入主题"
                  prefix="Title :"
                  @blur="$v.inputValue.$touch()"
                  @input="$v.inputValue.$touch()"
              ></v-text-field>
          </v-col>
          <v-col cols="12">
            <div id="editor" >
              <ckeditor tag-name="textarea" v-model="editorData"  :config="editorConfig" :editor="editor" @ready="onReady"></ckeditor>

            </div>
            <v-text-field
                v-model="editorData"
                :error-messages="editorDataErrors"
                required
                hidden
                @blur="$v.editorData.$touch()"
                @input="$v.editorData.$touch()"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
                v-model="name"
                :counter="20"
                :error-messages="nameErrors"
                label="用户名"
                required
                @blur="$v.name.$touch()"
                @input="$v.name.$touch()"
            ></v-text-field>
            <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="邮箱"
                required
                @blur="$v.email.$touch()"
                @input="$v.email.$touch()"
            ></v-text-field>
            <v-select
                v-model="select"
                :error-messages="selectErrors"
                :items="this.getSelect"
                label="栏目"
                required
                @blur="$v.select.$touch()"
                @change="$v.select.$touch()"
            ></v-select>
            <v-container >
              <v-btn
                  class="mr-4"
                  @click="submit"
                  rounded
                  color="primary"
                  :loading="isLoading"

              >
                提交
              </v-btn>
              <v-btn @click="clear"
                     rounded
                     color="error"
              >
                清空
              </v-btn>
            </v-container>
          </v-col>
        </v-row>

        <v-overlay :value="overlay">
          <div class="text-center ma-2">
            <v-snackbar
                v-model="snackbar"
                top
            >
              {{ text1 }}

              <template v-slot:action="{ attrs }">
                <v-btn
                    color="pink"
                    text
                    v-bind="attrs"
                    @click="overlay = false"
                >
                  Close
                </v-btn>
              </template>
            </v-snackbar>
          </div>
        </v-overlay>
      </v-container>

    </v-form>

  </div>


</template>

<script>

import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'
import {validationMixin} from 'vuelidate'
import {mapGetters} from 'vuex'
import {email, maxLength, required} from 'vuelidate/lib/validators'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import request from "@/axios";
// import qs from 'query-string';
import {format} from "@/utils";

export default {
  name: "Message",
  mixins: [validationMixin],
  validations: {
    inputValue: {required, maxLength: maxLength(20)},
    name: {required, maxLength: maxLength(20)},
    email: {required, email},
    select: {required},
    checkbox: {
      checked(val) {
        return val
      },
    },
    editorData:{required}
  },
  data: () => ({
    user:{},
    name: 'tianling',
    email: '859073143@qq.com',
    select: null,
    items: [],
    checkbox: false,
    editor: ClassicEditor,
    editorData: 'tianling',
    editorConfig: {
      // The configuration of the editor.
      language: 'zh-cn',
      toolbar: {
        items: [
          'heading',
          '|',
          'highlight',
          '|',
          'Markdown',
          'insertTable',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          'alignment',
          'imageUpload',
          'blockQuote',
          'undo',
          'redo'
        ]
      },
      alignment: {
        options: ['left', 'right', 'center', 'justify']
      },
      table: {
        contentToolbar: [
          'tableColumn', 'tableRow', 'mergeTableCells',
          'tableProperties', 'tableCellProperties'
        ],
        tableProperties: {
          // ...
        },
        tableCellProperties: {
          // ...
        }
      },
      removePlugins: ['MediaEmbed', 'Link'], mediaEmbed: {} //if you want to remove any plugin
    },
    inputValue: 'tianling',
    rules: [
      value => !!value || 'Required.',
      value => (value && value.length >= 3) || 'Min 3 characters',
    ],
    text: '',
    isLoading:false,
    snackbar: false,
    text1: `添加成功`,
    timeout:1000,
    overlay: false,
  }),
  methods: {
    onReady(editor) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
      editor.plugins.get("FileRepository").createUploadAdapter = function (loader) {
        return {
          upload: async function () {
            return await loader.file.then(f => {
              let fileReader = new FileReader();
              fileReader.readAsArrayBuffer(f)
              return new Promise(resolve => {
                fileReader.onload = function () {
                  resolve(f.result)
                }
              })
            }).then(buf => {
              console.log(buf)
              return {
                default: "www"
              }
            })
          }
        };
      }
    },
    submit() {
      this.$v.$touch()
      this.isLoading = true;
      request.post("/leave-message/addLeaveMessage",{
        "userId":1,
        "acceptId":2,
        "sendTime":format(new Date(),"yyyy-MM-dd hh:mm:ss"),
        "message":this.editorData,
        "messageTitle":this.inputValue,
        "messageEmail":this.email,
        "categoryId": this.getCategoryId
      }).then(resolve=>{
        this.clear()
        this.isLoading = !resolve
        this.snackbar = !!resolve
        this.overlay = !!resolve
      })
    },
    clear() {
      this.$v.$reset()
      this.name = ''
      this.email = ''
      this.select = null
      this.checkbox = false
      this.inputValue = ''
      this.editorData = ''
    },
  },
  computed: {
    ...mapGetters(["getCategoryList"]),
    editorDataErrors(){
      const errors = []
      if (!this.$v.editorData.$dirty) return errors
      !this.$v.editorData.required && errors.push('content is required')
      return errors
    },
    inputErrors() {
      const errors = []
      if (!this.$v.inputValue.$dirty) return errors
      !this.$v.inputValue.required && errors.push('Title is required')
      !this.$v.inputValue.maxLength && errors.push('Name must be at most 20 characters long')

      return errors
    },
    selectErrors() {
      const errors = []
      if (!this.$v.select.$dirty) return errors
      !this.$v.select.required && errors.push('Category is required')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.maxLength && errors.push('Name must be at most 20 characters long')
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be valid e-mail')
      !this.$v.email.required && errors.push('E-mail is required')
      return errors
    },
    getSelect(){
      let map = this.getCategoryList.map(category => category.categoryName)
      map.push("给作者留言")
      return map
    },
    getCategoryId(){
      let number = this.getCategoryList.findIndex(category => category.categoryName === this.select);
      if(number  === -1){
        return -1
      }
      return this.getCategoryList[number].id

    }
  },
  watch:{
    overlay (val) {
      val && setTimeout(() => {
        this.overlay = false
      }, this.timeout)
    },
  },
  created() {
    console.log()
    console.log((this.getCategoryList.filter(category => category.categoryName === "JavaScript") &&
        this.getCategoryList.filter(category => category.categoryName === "JavaScript").id) || -1);
  }

}
</script>

<style scoped>

</style>

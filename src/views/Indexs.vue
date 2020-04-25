<template>
  <div class="indexs">
    <v-container  >
       
      <v-row class="row" align="center" justify="center">
            
          <v-col cols="12" md="10" class="">
            <v-combobox
              id="search_index"
              v-model="search__pageindex"
              :items="items"
              :search-input.sync="search"
              hide-selected
              hint="Maximum of 5 tags"
              label="Add some tags"
              multiple
              persistent-hint
              small-chips
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="12" md="2" class="">
            <v-btn color="primary" outlined @click="clicksearch(getwords)" align="center" justify="center">
              <v-icon class="mb-2" >mdi-magnify</v-icon> <p class="mt-2">Search</p>
            </v-btn>
          </v-col>
        
      </v-row>

       <v-row v-if="setoverlay===false">
         <v-col cols="6" align="start" justify="center">พบ {{getTotalIndexs}} รายการ</v-col>
         <v-col cols="6" align="end" justify="center">หน้าที่ {{page}}-{{pages}}</v-col>
       </v-row>   

       <v-row v-if="setoverlay===false">
          <v-card
            class="mx-auto"
            max-width="344"
            flat
            v-if="notfound===true"
          >
            <v-card-text style="color:red;" class="headline">
              <div>การค้นหาของคุณไม่ตรงกับเอกสารใดๆ</div>
              <p class="headline">
                {{getwords}}
              </p>
              <div>
                คำแนะนำ :<br>
                -ลองใชคำอื่นๆ<br>
                -ลองใช้คำที่กว้างขึ้น
              </div>
            </v-card-text>
          </v-card>
       </v-row>

       <v-row id="top" v-if="setoverlay===false"> 
        <v-col cols="12">

          <div v-for="(index,i) in indexs" :key="i" :value="index">
            <v-card  height="" flat>
                <v-col cols="12" class="pa-1">
                  <v-card-text class="pa-1">
                    <v-list-item-title class="headline mb-5" v-html="index.mark_index"></v-list-item-title>
                    <v-list-item-title class="grey--text"><v-btn text @click="clickedSendbook(index.search_heading)">จากหนังสือ:{{index.search_heading}}</v-btn></v-list-item-title>
                    <p v-html="text_render(index.mark_details)"></p>
                  </v-card-text>
                </v-col>
                <v-col cols="12" class="pa-1">
                  <v-card-actions class="d-flex justify-end pa-1">
                     <v-btn text color="orange" style="margin-right:10px;" target="_blank" :href="index.link_pdf">PDF</v-btn>
                     <v-btn text color="red lighten-2" @click="dialogs(index.search_index,index.search_details,index.mark_details)">Read All</v-btn>
                  </v-card-actions>
                </v-col>
            </v-card><hr>
          </div>

          <v-dialog v-model="dialog" width="1500"  >
            <v-card>
              <v-card-title class="headline lighten-2">{{head_content}}</v-card-title>
                <v-card-text v-html="content_copy" style="font-size: 17px; white-space: pre-wrap;" ></v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click.stop.prevent="copyTextDetail">{{word_copy}}</v-btn>
                <v-btn color="primary" text @click="closs">ออก</v-btn>
              <input type="hidden" id="textDetail" :value="content">
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-pagination
            v-model ="page"
            class="my-4"
            :length ="pages"
            total-visible="7"
            v-if="getTotalIndexs!==0"
           ></v-pagination>
     
        </v-col>
      </v-row><br>

        <div v-if="setoverlay===true">
          <v-col cols="12" v-for="(item,i) in 10" :key="i">
            <v-card >
              
                <v-skeleton-loader
                  ref="skeleton"
                  type= "article, actions"
                  class="mx-auto"
                ></v-skeleton-loader>
               
            </v-card><br>
          </v-col>
        </div>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
      return {
        dialog: false,
        content:"",
        content_copy:"",
        head_content:"",
        search:"",
        page:1,
        items: ['บุญ', 'วิชชา'],
        word_copy:'คัดลอก'
       
 
      }
    },
  computed:{
    notfound(){
      return this.$store.getters.getnotfound
    },
    setoverlay(){
      return this.$store.getters.getoverlay
      },
    indexs(){
      return this.$store.getters.getIndexs
    },
    getwords(){
      return this.$store.getters.getwords_search
    },
    getTotalIndexs(){
      return this.$store.getters.getTotalIndexs
    },
    pages(){ 
      return Math.ceil(this.getTotalIndexs/10)
    },
    search__pageindex: {
			get: function() {
				let words = this.$store.getters.getwords_search
				return words
			},
			set: function(value) {
        this.$store.dispatch('setwordssearch',value)
      },
    }
  },
  methods:{
    dialogs(head,content,content_copy){
      this.dialog=!this.dialog
      this.content=content
      this.content_copy=content_copy
      this.head_content=head
    },
    closs(){
      this.dialog=!this.dialog
      this.word_copy = 'คัดลอก'
      this.content=""
      this.head_content=""
    },
    text_render(input){
       let text = input.split("html")
       if(text.length>1){
        let t = input.split("html").slice(1).join(' ')
        let b = t.replace('<mark>',`$<mark>`)
        let s = b.split("$")
        console.log(s)
        let x = s[0].split(" ")
        let value =`${x[x.length-1]}${s[1]}`
        return value
       }else{
        let b = input.replace('<mark>',`$<mark>`)
        let s = b.split("$")
        let x = s[0].split(" ")
        let value =`${x[x.length-1]}${s[1]}`
        return value
       }
    },
    clicksearch(input){
      this.page = 1
      this.$store.dispatch('setFirstIndexsFromApi',{words:input,page:0})
    },
    copyTextDetail () {
        
        let textDetailToCopy = document.querySelector('#textDetail')
        textDetailToCopy.setAttribute('type', 'text')    
        textDetailToCopy.select()

        try {
          var successful = document.execCommand('copy');
          var msg = successful ? 'คัดลอกแล้ว' : 'คัดลอกไม่สำเร็จ';
          this.word_copy = `${msg}`
        } catch (err) {
        alert('Oops, unable to copy');
        }

        /* unselect the range */
        textDetailToCopy.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
      },
       clickedSendbook(bookname2) {
        this.$store.dispatch('setbook_index',bookname2)
        this.$store.dispatch('setPagenation',{limit:12, offset:0,book_name:bookname2})
        this.$router.push({ path: `/book/${bookname2}` })
      },
  },
   watch: {
    search__pageindex (val) {
      if (val.length > 5) {
        this.$nextTick(() => this.search__pageindex.pop())
      }
    },
    page(val){
      this.$vuetify.goTo('#search_index')
      let remitcards = 10
      let pageoffset = (remitcards*(val-1))
      this.$store.dispatch('setFirstIndexsFromApi',{words:this.getwords,page:pageoffset})
    },
  },   
}
</script>
<style>
/* @media (min-width: 320px) {
  h5.heading {
    font-size: 0.8em;
  }
} */
@import url('https://fonts.googleapis.com/css2?family=Prompt&display=swap');

p{
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  
}
.indexs{
  font-family: 'Prompt', sans-serif;
}

</style>


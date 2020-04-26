<template>
  <div class="indexs">
    <v-container  >
       
      <v-row class="row" align="center" justify="center">
            
          <v-col cols="12" md="10" class="">
              <v-combobox
                v-model="search__pageindex"
                :filter="filter"
                :hide-no-data="!search"
                :items="items"
                :search-input.sync="search"
                hide-selected
                label="ค้นหาธรรมะ"
                multiple
                small-chips
                solo
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <span class="subheading">ต้องการค้นหา</span>
                    <v-chip
                      :color="`${colors[nonce - 1]} lighten-3`"
                      label
                      small
                    >
                      {{ search }}
                    </v-chip>
                    <span class="subheading">กรุณากด</span>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ attrs, item, parent, selected }">
                  <v-chip
                    v-if="item === Object(item)"
                    v-bind="attrs"
                    :color="`${item.color} lighten-3`"
                    :input-value="selected"
                    label
                    small
                  >
                    <span class="pr-2">
                      {{ item.text }}
                    </span>
                    <v-icon
                      small
                      @click="parent.selectItem(item)"
                    >mdi-close</v-icon>
                  </v-chip>
                </template>
              </v-combobox>
          </v-col>
          <v-col cols="12" md="2" class="">
            <v-btn color="primary" outlined @click="clicksearch(getwords)" align="center" justify="center">
              <v-icon class="mb-2" >mdi-magnify</v-icon> <p class="mt-2">ค้นหา</p>
            </v-btn>
          </v-col>
        
      </v-row>

       <v-row v-if="setoverlay===false">
         <v-col cols="6" align="start" justify="center">พบ {{getTotalIndexs}} รายการ</v-col>
         <v-col cols="6" align="end" justify="center"></v-col>
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
                    <v-row>
                      <v-col cols="10">
                        <v-list-item-title class="headline mb-5" v-html="index.mark_index" ></v-list-item-title>
                      </v-col>
                      <v-col cols="2">
                        <v-list-item-title class="grey--text" align="end">{{i+1}}</v-list-item-title>
                      </v-col>
                    </v-row>
                    <v-list-item-title class="grey--text"><v-btn text @click="clickedSendbook(index.book_id)">จากหนังสือ:{{index.search_heading}}</v-btn></v-list-item-title>
                    <p v-html="text_render(index.mark_details)"></p>
                  </v-card-text>
                </v-col>
                <v-col cols="12" class="pa-1">
                  <v-card-actions class="d-flex justify-end pa-1">
                     <v-btn text color="orange" style="margin-right:10px;" target="_blank" :href="index.link_pdf">PDF</v-btn>
                     <v-btn text color="red lighten-2" @click="dialogs(index.search_index,index.search_details,index.mark_details,index.search_heading)">Read All</v-btn>
                  </v-card-actions>
                </v-col>
            </v-card><hr>
          </div>

          <v-dialog v-model="dialog" max-width="1100" align="center"   >
            <v-card>
              <v-card class="d-flex justify-center" flat>
                <v-card class="max-width-auto"  flat>
                  <v-card-text class="headline lighten-2 ">{{head_content}}</v-card-text>
                  <v-list-item-title class="grey--text "><v-btn text @click="clickedSendbook(index.book_id)">จากหนังสือ:{{frombook}}</v-btn></v-list-item-title>
                <div >
                  <v-card-text  v-html="content_copy" style="font-size: 17px; white-space: pre-wrap;" ></v-card-text>
                </div>
                </v-card>  
                
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click.stop.prevent="copyTextDetail">{{word_copy}}</v-btn>
                <v-btn color="primary" text @click="closs">ออก</v-btn>
                <input type="hidden" id="textDetail" :value="content">
              </v-card-actions>
              </v-card>
          </v-dialog>

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

        <v-col cols="12" v-if=" indexs.length<getTotalIndexs">
          <v-card >
              
            <v-skeleton-loader
              ref="skeleton"
              type= "article, actions"
              class="mx-auto"
              v-intersect="search_infenit"
            ></v-skeleton-loader>
               
          </v-card><br>
        </v-col>
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
        frombook:"",
        search:"",
        word_copy:'คัดลอก',
        activator: null,
        attach: null,
        colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
        editing: null,
        index: -1,
        items: [{ header: 'สูงสุด ๕ คำ' }],
        nonce: 1,
        menu: false,
        x: 0,      
        y: 0,
 
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
    dialogs(head,content,content_copy,book){
      this.dialog=!this.dialog
      this.content=content
      this.content_copy=content_copy
      this.head_content=head
      this.frombook=book
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
      this.$store.dispatch('setFirstIndexsFromApi',{words:input,page:0,infenit:false})
    },
    search_infenit(){
      let offset = this.$store.getters.getIndexs.length
      this.$store.dispatch('setFirstIndexsFromApi_infenit',{words:this.getwords,page:offset,})
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
        let openBook = this.$router.resolve({path: `/book/${bookname2}`});
        window.open(openBook.href, '_blank')
    },
    filter (item, queryText, itemText) {
      if (item.header) return false

        const hasValue = val => val != null ? val : ''

        const text = hasValue(itemText)
        const query = hasValue(queryText)

        return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    },
  },
  watch: {
    search__pageindex (val,prev) {
      if (val.length > 5) {
        this.$nextTick(() => this.words_pageindex.pop()) 
      }
      if (val.length === prev.length) return
        this.search__pageindex = val.map(v => {
          if (typeof v === 'string') {
            v = {
              text: v,
              color: this.colors[this.nonce - 1],
            }
            this.items.push(v)
            this.nonce++
          }
          return v
        })
    } 
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


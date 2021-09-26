<template>
  <div class="indexs">
    <v-container  >
       
      <v-row class="mb-1" align="center" justify="center">
            
          <v-col cols="12" md="10" class="pb-1">
              <v-combobox 
                v-model="search_pageindex" 
                :filter="filter" 
                :hide-no-data="!search" 
                :items="items" 
                :search-input.sync="search"  
                hide-selected  
                :label="label_search"  
                multiple 
                small-chips  
                solo 
                :delimiters="space"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <span class="subheading mr-1">กด</span><kbd ><v-icon color="white" class="mb-2">mdi-keyboard-space</v-icon></kbd>
                    <span class="subheading mr-1">{{text_exp}}</span>
                    <v-chip
                      :color="`${colors[nonce - 1]} lighten-3`"
                      label
                      small
                    >
                      {{ search }}
                    </v-chip>                        
                  </v-list-item>
                </template>
                <template v-slot:selection="{ attrs, item, parent, selected }">
                  <v-chip  
                    v-if="item === Object(item)" 
                    v-bind="attrs" 
                    :color="`${item.color} lighten-3`" 
                    :input-value="selected" 
                    label 
                    small >
                    <span class="pr-2">{{ item.text }} </span>
                    <v-icon small @click="parent.selectItem(item)">mdi-close</v-icon>
                  </v-chip>
                </template>
              </v-combobox>
          </v-col>
          <v-col cols="12" md="2" class="mb-5">
            <v-btn @click="clicksearch(search_pageindex)" class="mr-10" dark color="blue lighten-1"><v-icon class="mr-3">mdi-magnify</v-icon>ค้นหา</v-btn>
          </v-col>
      </v-row>
         <v-col v-if="setoverlay===false" cols="6" align="start" justify="center" class="pt-1">พบ {{getTotalIndexs}} รายการ</v-col>

       <v-row v-if="setoverlay===false">
       </v-row>   

       <v-row v-if="setoverlay===false">
          <v-card
            class="mx-auto"
            max-width="100%"
            flat
            v-if="notfound===true"
          >
            <v-card-text  class="headline">
              <div class="mb-3">คำค้นหาของคุณไม่ตรงกับเอกสารใดๆ</div>
              <p v-for="(w,i) in search_pageindex" :key="i" :value="w" class="headline" style="color:red;">
                - {{w.text}}
              </p>
              <div >
                 คำแนะนำ :<br>
                <p>- ตรวจดูให้แน่ใจว่าสะกดถูกต้องทุกคำ</p> 
                <p>- ลองใช้คำอื่นๆ</p> 
                <p>- ลองใช้คำที่กว้างขึ้น</p> 
                <p>- ลองใช้คำที่น้อยลง</p> 
              </div>
            </v-card-text>
          </v-card>
       </v-row>

       <v-row id="top" v-if="setoverlay===false"> 
        <v-col cols="12" >

          <div v-for="(index,i) in indexs" :key="i" :value="index">
            <v-card  height="" flat>
                <v-col cols="12" class="pa-1">
                  <v-card-text class="pa-1">
                    <v-row>
                      <v-col cols="10">
                        <v-list-item-title class=" mb-1 " v-html="index.mark_index" style="line-height:2;font-size:24px;"></v-list-item-title>
                      </v-col>
                      <v-col cols="2">
                        <v-list-item-title class="grey--text" align="end">{{i+1}}</v-list-item-title>
                      </v-col>
                    </v-row>
                    
                    <v-list-item-title class="mb-2"><v-btn text color="primary lighten-1" @click="clickedSendbook(index.dm_id)"><v-icon small class="mr-2">mdi-book-open-page-variant</v-icon> จากหนังสือ:{{index.dm_name}}</v-btn></v-list-item-title>
                    <p v-html="text_render(index.mark_details)"></p>
                  </v-card-text>
                </v-col>
                <v-col cols="12" class="pa-1">
                  <v-card-actions class="d-flex justify-end pa-1">
                     <v-btn text color="red" style="margin-right:10px;" target="_blank" :href="index.dd_link_pdf">PDF</v-btn>
                     <v-btn text color="blue lighten-1" @click="dialogs(index.mark_index,index.dd_detail,index.mark_details,index.dm_name,index.dm_id)">อ่านทั้งหมด</v-btn>
                  </v-card-actions>
                </v-col>
            </v-card><hr>
          </div>

          <v-dialog v-model="dialog" max-width="1100" align="center"   >
            <v-card>
              <v-card class="d-flex justify-center" flat>
                <v-card class="max-width-auto"  flat>
                  <v-card-text class=" lighten-2 " style="line-height:2;font-size:24px;" v-html="head_content" ></v-card-text>
                  <v-list-item-title class="grey--text "><v-btn text color="primary lighten-1" @click="clickedSendbook(book_id)"><v-icon small class="mr-2">mdi-book-open-page-variant</v-icon>จากหนังสือ:{{frombook}}</v-btn></v-list-item-title>
                <div >
                  <v-card-text ref="textCopy" v-html="content_copy" style="font-size: 17px; white-space: pre-wrap;" ></v-card-text>
                </div>
                </v-card>  
                
              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary lighten-1" text @click="copyTextDetail">{{word_copy}}</v-btn>
                <v-btn color="primary lighten-1" text @click="closs">ออก</v-btn>

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
        label_search:"ค้นหาคำสอน",
        content:"",
        content_copy:"",
        head_content:"",
        frombook:"",
        book_id:"",
        search:"",
        word_copy:'คัดลอก',
        activator: null,
        attach: null,
        colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
        editing: null,
        index: -1,
        items: [{ header: 'สามารถใส่คำค้นหาได้สูงสุด 5 คำ' }],
        nonce: 1,
        menu: false,
        x: 0,      
        y: 0,
        space:[' '],
 
      }
    },
  computed:{
    text_exp(){
      if (this.$vuetify.breakpoint.xsOnly){
        return 'ที่แป้นพิมพ์เพื่อยืนยัน'
      }
        return  '(spacebar,เว้นวรรค) ที่แป้นพิมพ์เพื่อยืนยัน'
    },
    notfound(){
      return this.$store.getters.getnotfound
    },
    setoverlay(){
      return this.$store.getters.getoverlay
      },
    indexs(){
      return this.$store.getters.getIndexs
    },
    getTotalIndexs(){
      return this.$store.getters.getTotalIndexs
    },
    search_pageindex: {
			get() {
				let words = this.$store.getters.getwords_search
				return words
			},
			set(value) {
        this.$store.dispatch('setwordssearch',value)
      },
    }
  },
  methods:{
    dialogs(head,content,content_copy,book,id){
      this.dialog=!this.dialog
      this.content=content
      this.content_copy=content_copy
      this.head_content=head
      this.frombook=book
      this.book_id=id
    },
    closs(){
      this.dialog=!this.dialog
      window.getSelection().removeAllRanges()
      this.word_copy = 'คัดลอก'
      this.content=""
      this.head_content=""
    },
    text_render(input){
      if(!input.includes("<mark>")) return input

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
      if(input.length!==0){
      this.$store.dispatch('setFirstIndexsFromApi',{words:input,page:0})
      }else{
        this.label_search='กรุณาใส่คำที่่ต้องการค้นหา'
      }
    },
    search_infenit(){
      let offset = this.$store.getters.getIndexs.length
      this.$store.dispatch('setFirstIndexsFromApi_infenit',{words:this.search_pageindex,page:offset,})
    },
    copyTextDetail () {
        this.selectText(this.$refs.textCopy); // e.g. <div ref="text">

        try {
          var successful = document.execCommand('copy');
          var msg = successful ? 'คัดลอกแล้ว' : 'คัดลอกไม่สำเร็จ';
          this.word_copy = `${msg}`
        } catch (err) {
          alert('Oops, unable to copy');
        }
      },
    clickedSendbook(bookname2) {
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
    selectText(element) {
        var range;
        if (document.selection) {
          // IE
          range = document.body.createTextRange();
          range.moveToElementText(element);
          range.select();
        } else if (window.getSelection) {
          range = document.createRange();
          range.selectNode(element);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
        }
    },
  },
  watch: {
    search_pageindex (val,prev) {
      if (val.length === prev.length) return
      
      if (val.length > 5) {
        this.$nextTick(() =>this.search_pageindex.pop())
      }
      this.search_pageindex = val.map(v => {
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
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

p{
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  font-family: 'Sarabun', sans-serif;
}
.indexs{
  font-family: 'Sarabun', sans-serif;
}
.headline{
  font-family: 'Sarabun', sans-serif;
}


</style>


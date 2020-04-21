<template>
  <div class="indexs">
     <v-container  >
       <v-row>
         <v-row class="row" align="center" justify="center">
           
              <v-col cols="10" class="mb-12">
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
              <v-col cols="2" class="mb-10">
                <v-btn color="primary" outlined @click="clicksearch(getwords)" align="center" justify="center">
                  <v-icon class="mb-2" >mdi-magnify</v-icon> <p class="mt-2">Search</p>
                </v-btn>
              </v-col>
            
          </v-row>
       </v-row>

       <v-row>
          <v-card
            class="mx-auto"
            max-width="344"
            flat
            v-if="notfound===true"
          >
            <v-card-text>
              <div>การค้นหาของคุณ</div>
              <p class="display-1 text--primary">
                {{getwords}}
              </p>
              <div>ไม่ตรงกับเอกสารใดๆ</div>
              <div class="text--primary">
                คำแนะนำ :<br>
                -ลองใชคำอื่นๆ<br>
                -ลองใช้คำที่กว้างขึ้น
              </div>
            </v-card-text>
          </v-card>
       </v-row>

       <v-row id="top"> 
        <v-col cols="12">

          <div v-for="(index,i) in indexs" :key="i" :value="index">
            <v-card  height="" flat>
              <v-card-title>
                <v-col cols="12">
                  <v-card-content >
                    <v-list-item-title class="headline" v-html="text_render(index.mark_index)"></v-list-item-title>
                    <v-list-item-title class="grey--text">จากหนังสือ:{{index.search_heading}}</v-list-item-title>
                    <p v-html="text_render(index.mark_details)"></p>
                  </v-card-content>
                </v-col>
                <v-col cols="12">
                  <v-card-action class="d-flex justify-end">
                     <v-btn text color="orange" style="margin-right:10px;" target="_blank" :href="index.link_pdf">PDF</v-btn>
                     <v-btn text color="red lighten-2" @click="dialogs(index.search_index,index.search_details)">Read All</v-btn>
                  </v-card-action>
                </v-col>
              </v-card-title>
            </v-card><hr>
          </div>

          <v-dialog v-model="dialog" width="1000"  >
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>{{head_content}}</v-card-title>
                <v-card-text style="font-size: 17px;">{{content}}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="closs">ออก</v-btn>
                <v-btn
                  color="primary"
                  text
                  @click.stop.prevent="copyTextDetail"
                >
                  คัดลอก
                </v-btn>
              <input type="hidden" id="textDetail" :value="content">
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-overlay v-model="setoverlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>
    
          <v-pagination
            v-model ="page"
            class="my-4"
            :length ="pages"
            total-visible="7"
            
           ></v-pagination>
     
        </v-col>
      </v-row><br>
    </v-container>
  </div>
</template>

<script>
export default {
  data () {
      return {
        dialog: false,
        content:"",
        head_content:"",
        search:"",
        page:1,
        items: ['บุญ', 'วิชชา'],
 
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
    dialogs(head,content){
      this.dialog=!this.dialog
      this.content=content
      this.head_content=head
    },
    closs(){
      this.dialog=!this.dialog
      this.content=""
      this.head_content=""
    },
    text_render(input){
       let text = input.split("html")
       if(text.length>1){
         return input.split("html").slice(1).join(' ')
       }else{
         return input
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
          var msg = successful ? 'successful' : 'unsuccessful';
          alert('copdied '+ msg);
        } catch (err) {
        alert('Oops, unable to copy');
        }

        /* unselect the range */
        textDetailToCopy.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
      },
  },
   watch: {
    search__pageindex (val) {
      if (val.length > 5) {
        this.$nextTick(() => this.model.pop())
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

p{
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
}

</style>


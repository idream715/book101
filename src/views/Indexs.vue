<template>
  <div class="indexs">
     <v-container fluid >
       <v-row>
         <v-row class="row" align="center" justify="center">
           
              <v-col cols="10" class="mb-12">
                <v-combobox
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
                <v-btn icon @click="clicksearch(getwords)">
                  <v-icon>mdi-magnify</v-icon>
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
       <v-row>
        <v-col cols="12">

          <div v-for="(index,i) in indexs" :key="i" :value="index">

            <v-card height="" flat>
              <v-card-title>
                <v-col cols="12">
                  <v-card-item-content >
                    <v-list-item-title class="headline" v-html="text_render(index.mark_index)"></v-list-item-title>
                    <v-list-item-title class="grey--text">Book {{index.search_heading}}</v-list-item-title>
                    <p v-html="text_render(index.mark_details)"></p>
                  </v-card-item-content>
                </v-col>
                <v-col cols="12">
                  <v-card-item-action class="d-flex justify-end">
                     <v-btn flat color="orange" style="margin-right:10px;" target="_blank" :href="index.link_pdf">PDF</v-btn>
                     <v-btn color="red lighten-2" @click="dialogs(index.search_heading,index.search_details)">Read All</v-btn>
                  </v-card-item-action>
                </v-col>
              </v-card-title><hr>
            </v-card>

          </div>

          <v-dialog v-model="dialog" width="600">
            <v-card>
              <v-card-title class="headline grey lighten-2" primary-title>{{head_content}}</v-card-title>
                <v-card-text>{{content}}</v-card-text>
    
                <v-divider></v-divider>
    
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="closs">ออก</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-overlay v-model="setoverlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
          </v-overlay>

        </v-col>
      </v-row><br>
    </v-container>

  </div>
</template>

<script>
export default {
  // mounted(){
  //   if(this.indexs.length === 0 ){
  //     this.$store.dispatch('getFirstIndexsFromApi')
  //   }
  // },
  data () {
      return {
        dialog: false,
        content:"",
        head_content:"",
        searchs:"",

        
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
    marks(){
      return this.$store.getters.getmarks
    },
    getwords(){
      let word =  [...this.$store.getters.getwords_search]
      return `${word}`
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
      this.$store.dispatch('setFirstIndexsFromApi',input)
    }

  },
   watch: {
    search__pageindex (val) {
      if (val.length > 5) {
        this.$nextTick(() => this.model.pop())
      }
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


<template>
  <div class="indexs">
     <v-container fluid >
       <v-row>
        <v-col cols="12">
          <div v-for="(index,i) in indexs" :key="i" :value="index">
            <v-card height="" flat>

              <v-card-title>
                <v-col cols="12">
                  <v-card-item-content >
                    <v-list-item-title class="headline" v-text="index.search_index"></v-list-item-title>
                    <v-list-item-title class="grey--text">Book {{index.search_heading}}</v-list-item-title>
                    <p>{{text_render(index.search_details)}}</p>
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
          <v-overlay :value="overlay">
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
        overlay: false,
      }
    },
  computed:{
    setoverlay(){
     return this.overlay === this.$store.getters.getoverlay
    },
    indexs(){
      return this.$store.getters.getIndexs
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
       
    }

  }
  
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


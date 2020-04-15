<template>
  <div class="home">
     <v-container fluid >
       <v-row>
        <v-col cols="12">
          <div v-for="(index,i) in indexs" :key="i" :value="index">
            <v-card height="" flat>

              <v-list-item style="background-color:blue;">
                <v-list-item-content>
                  <v-list-item-title class="headline" style="color:white">{{index.search_index}}</v-list-item-title>
              <!-- <v-list-item-subtitle>by Kurt Wagner</v-list-item-subtitle> -->
                </v-list-item-content>
              </v-list-item>

              <v-card-title>
                <v-col cols="12">
                  <div>
                    <span class="grey--text">Book {{index.search_heading}}</span><br>
                    <v-list two-line class="text-truncate">{{index.search_details}}</v-list>

                  </div>
                </v-col>
                <v-col  cols="12">
                  <v-card-actions>
                    <v-btn flat color="orange" style="margin-right:10px;" ><a :href="index.link_pdf">Share</a></v-btn>
                         <v-btn color="red lighten-2" @click="dialogs(index.search_heading,index.search_details)">Read All</v-btn>
                    
                  </v-card-actions>
                </v-col>
              </v-card-title>

            </v-card><br>
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
        </v-col>
      </v-row><br>
    </v-container>

  </div>
</template>

<script>
export default {
  created(){
    this.$store.dispatch('getFirstIndexsFromApi')
  },
 
  data () {
      return {
        dialog: false,
        content:"",
        head_content:"",
      }
    },
  computed:{
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

</style>


<template>
  <div>
    <v-container>
      <!-- <h1>this is sarabun modal</h1> -->
      <v-row justify="center">
        <v-dialog 
          v-model="dialog" 
          max-width="100%" 
          style="margin:0;"
          persistent
          >
          <v-card>
            <v-row class="headline" justify="center">{{bookSelected.book_name}}</v-row>
            <v-row justify="center"><img :src="bookSelected.book_link_jpg" alt=""></v-row>               
            <v-row class="btn" justify="center">
              <v-btn color="primary" :href="bookSelected.book_link_pdf">
                อ่านทั้งเล่มแบบ PDF
                <v-icon>mdi-file-pdf</v-icon>
              </v-btn>
              <v-btn margin-left="10px" color="primary">TEXT<v-icon>mdi-format-text</v-icon></v-btn>
            </v-row>
            
            <v-card-text>
              <div>
                <v-data-table
                  :headers="headers"
                  :items="sarabunSelected"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  hide-default-footer
                  class="elevation-1"
                  @page-count="pageCount = $event"
                  >

                  <template v-slot:item.actions="{ item }">
                    <v-btn :href="item.link_pdf">
                      <v-icon
                        color="red"
                        :href="item.link_pdf"
                      >
                        mdi-file-pdf
                      </v-icon>
                    </v-btn>
                    <v-btn :href="item.search_details">
                      <v-icon
                        color="blue"
                        @click="deleteItem(item)"
                      >
                        mdi-format-text
                      </v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:item.search_heading="{ item }">
                    <div class="title">
                      {{indexOn(item)}}                     
                    </div>
                  </template>

                </v-data-table>
                <div class="text-center pt-2">
                  <v-pagination v-model="page" :length="pages"></v-pagination>
                  <!-- <v-text-field
                    :value="itemsPerPage"
                    label="กำหนดจำนวนสารัญต่อหน้า"
                    type="number"
                    min="-1"
                    max="50"
                    @input="itemsPerPage = parseInt($event, 10)"
                  ></v-text-field> -->
                </div>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="closeDialog">กลับ</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'Sarabun',
    props: {
      dialog: {
        type:Boolean,
        default:false
      },
      bookName: String,
      linkPdfBook: String
    },
    data(){
      return {
        page: 1,
        pageCount: 0,
        itemsPerPage: 50,
        headers: [
          {
            text: 'ที่',
            align: 'start',
            value: 'search_heading',
          },
          { text: 'ชื่อสารบัญ', value: 'search_index' },
          { text: 'อ่าน', value: 'actions'},
          
        ],
      }
    },
    methods: {
      closeDialog(){
        this.$emit('emitFalse',false)
        this.$store.dispatch('setBookSelected', [])
      },
      indexOn(obj){
        let no =  obj[" "]
        return this.sarabunSelected.map(x=> x[" "]).indexOf(no)+1
      }
    },
    computed: {
      bookSelected(){
        return this.$store.getters.getBookSelected
      },
      sarabunSelected(){
        return this.$store.getters.getSarabun
      },
      sarabunTotal(){
        return this.$store.getters.getTotalSarabun
      },
      pages(){
        return Math.ceil(this.sarabunTotal/this.itemsPerPage)
      }
      
    },
  }
</script>

<style scoped>
  .v-simple-table thead tr th {
    /* font-size: "subtitle-1"; */
    font-weight: bold;
  }

  img {
    max-width: 20%;
  }
 
  /* .headline {
    text-align: center;
  } */

  tr a {
    text-decoration: none;
  }

  .btn {
    padding-top: 15px;
    padding-bottom: 20px;
  }
</style>
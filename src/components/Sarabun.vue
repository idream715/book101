<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-dialog 
          v-model="dialog" 
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          @keydown.esc="closeDialog"
          >
          <v-card tile>
            <v-toolbar
              flat
              dark
              color="primary"
              height="200px"
              
              >
              <v-btn
                icon
                dark
                @click="closeDialog"
                >
                <v-icon>mdi-close</v-icon>
              </v-btn>
                <div class="mr-5" v-if="$vuetify.breakpoint.mdAndUp">
                  <v-img :src="bookSelected.book_link_jpg" max-width="125"></v-img>
                </div>
                <v-toolbar-title>
                  {{bookSelected.book_name}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <span>อ่านทั้งเล่ม</span>
                <v-toolbar-items>
                  <v-btn
                    dark
                    text
                    :href="bookSelected.book_link_pdf"
                    target="_blank"
                  >
                    PDF
                    <v-icon>mdi-file-pdf</v-icon>
                  </v-btn>
                  <v-btn
                    dark
                    text
                    :href="bookSelected.book_link_text"
                    target="_blank"
                  >
                    TEXT
                    <v-icon>mdi-format-text</v-icon>
                  </v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-text>
              <div>
                <v-data-table
                  :loading="loading" 
                  loading-text="Loading... Please wait"
                  :headers="headers"
                  :items="sarabunSelected"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  hide-default-footer
                  class="elevation-1"
                  @page-count="pages = $event"
                  dense
                  >
                  <template v-slot:top>
                    <div class="title">{{sarabunTotal}} สารบัญ</div> 
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn :href="item.link_pdf" target="_blank" text>
                      <v-icon color="red">
                        mdi-file-pdf
                      </v-icon>
                      <span>PDF</span>
                    </v-btn>
                    <v-btn
                      @click="readText(item.search_index,item.search_details)"
                      text
                      >
                      <v-icon color="blue">
                        mdi-book-open-page-variant
                      </v-icon>
                      <span>TEXT</span>
                    </v-btn>
                  </template>
                </v-data-table>
                
                <div class="text-center pt-2">
                  <v-pagination 
                    v-model="page" 
                    :length="pages"
                    circle
                    ></v-pagination>
                  <v-text-field
                    :value="itemsPerPage"
                    label="กำหนดจำนวนสารบัญต่อหน้า"
                    type="number"
                    min="5"
                    max="50"
                    @input="itemsPerPage = parseInt($event)"
                  ></v-text-field>
                </div>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="closeDialog"><div class="title">กลับ</div> </v-btn>
            </v-card-actions>

          </v-card>
        </v-dialog>
        
        <v-dialog
          v-model="dialogReadText"
          >
          <v-card>
            <v-card-title>
              {{textSarabun}}
            </v-card-title>
            <v-card-text>
              {{textDetail}}
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                text
                @click.stop.prevent="copyTextDetail"
              >
                คัดลอก
              </v-btn>
              <input type="hidden" id="textDetail" :value="textDetail">
              <v-btn
                color="primary"
                text
              >
                Close
              </v-btn>
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
        dialogReadText: false,
        page: 1,
        itemsPerPage: 10,
        page_count:0,
        headers: [
          {
            text: 'ชื่อสารบัญ',
            align: 'start',
            value: 'search_index',
            sortable: false,
          },
          { text: 'อ่าน', value: 'actions',sortable: false,},
          
        ],
        textSarabun:"",
        textDetail:"",
      }
    },
    watch: {
      page(val){
        let offset = 0
        if(val===1)
          offset =0
        else 
          offset = val*this.itemsPerPage-this.itemsPerPage;

        this.$store.dispatch('clearSarabun')
        this.$store.dispatch('setPagenation', {limit:this.itemsPerPage, offset:offset})
        console.log('offset'+offset)
      },
    },
    methods: {
      closeDialog(){
        this.$emit('emitFalse',false)
        this.$store.dispatch('clearSarabun')
        this.$store.dispatch('clearTotalsSarabun')
      },
      readText(sarabun,detail){
        this.dialogReadText = !this.dialogReadText
        this.textSarabun = sarabun
        this.textDetail = detail
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
      pages:{
        get: function (){
          return Math.ceil(this.sarabunTotal/this.itemsPerPage)
        },
        set: function (newValue) {
          console.log('nv'+newValue)
        }
      },
      loading(){
        return this.$store.getters.getCheckLoadSarabun     
      }
    }
  }
</script>

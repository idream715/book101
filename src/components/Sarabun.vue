<template>
  <div>
    <v-container>
      <v-row>
        <v-dialog 
          v-model="dialog" 
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          @keydown.esc="closeDialog"
          >
          <v-card tile>
              <!-- :src="bookSelected.book_link_jpg" -->
            <v-toolbar
              dark
              color="primary"
              dense
              >
              <v-btn
                icon
                @click="closeDialog"
                >
                <v-icon>mdi-close</v-icon>
              </v-btn>
                <v-toolbar-title>
                  {{bookSelected.book_name}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <span v-if="$vuetify.breakpoint.smAndUp">อ่านทั้งเล่ม</span>
                <v-toolbar-items>
                  <v-btn
                    text
                    :href="bookSelected.book_link_pdf"
                    target="_blank"
                  >
                    <v-icon>mdi-file-pdf</v-icon>
                    <div v-if="$vuetify.breakpoint.smAndUp">PDF</div> 
                  </v-btn>
                  <v-btn
                    text
                    :href="bookSelected.book_link_text"
                    target="_blank"
                  >
                    <v-icon class="mr-1">mdi-book-open-page-variant</v-icon>
                    <div v-if="$vuetify.breakpoint.smAndUp">TEXT</div> 
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
                    class="elevation-1 mt-3"
                    dense
                    >
                    <template v-slot:top>
                      <div class="title ml-2">จำนวนสารบัญ {{sarabunTotal}} </div> 
                    </template> 

                    <template v-slot:item.actions="{ item }">
                      <v-btn 
                        :href="item.link_pdf" 
                        target="_blank" text icon>
                        <v-icon color="red">
                          mdi-file-pdf
                        </v-icon>
                        <!-- <span>PDF</span> -->
                      </v-btn>
                      <v-btn
                        @click="readText(item.search_index,item.search_details)"
                        text icon
                        >
                        <v-icon color="blue">
                          mdi-book-open-page-variant
                        </v-icon>
                        <!-- <span>TEXT</span> -->
                      </v-btn>
                    </template>
                  </v-data-table>
                
                <div class="text-center pt-2">
                  <v-pagination 
                    v-model="page" 
                    :length="pages"
                  ></v-pagination>
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
            <v-card-text style="white-space: pre-wrap;">
              {{textDetail}}
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                color="primary"
                text
                @click.stop.prevent="copyTextDetail"
              >
                {{word_copy}}
              </v-btn>
              <input type="hidden" id="textDetail" :value="textSarabun+' '+textDetail">
              <v-btn
                color="primary"
                text
                @click="dialogReadText = false"
              >
                ออก
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
        itemsPerPage: 12,
        page_count:0,
        headers: [
          {
            text: 'สารบัญ',
            align: 'start',
            value: 'search_index',
            sortable: false,
          },
          {
            text: 'อ่าน', 
            value: 'actions',
            align: 'end',
            sortable: false,
          },
        ],
        textSarabun:"",
        textDetail:``,
        word_copy:'คัดลอก'
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
        // console.log('offset'+offset)
      },
    },
    methods: {
      closeDialog(){
        this.$emit('emitFalse',false)
        this.page = 1
        this.$store.dispatch('clearSarabun')
        this.$store.dispatch('clearTotalsSarabun')
      },
      readText(sarabun,detail){
        this.dialogReadText = !this.dialogReadText
        this.textSarabun = sarabun
        this.textDetail = detail
        this.word_copy = 'คัดลอก'
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
      },
      loading(){
        return this.$store.getters.getoverlay     
      }
    }
  }
</script>

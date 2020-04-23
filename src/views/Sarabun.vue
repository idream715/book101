<template>
  <div name="sarabun">
    <v-card mx-width="100">
      <v-card-title class="justify-center">
        <div class="display-1 font-weight-bold">
          {{book_name}}
        </div>
      </v-card-title>
      <v-card-text class="justify-center">
        <v-row class="justify-center">
          <v-col 
            cols="12" 
            sm="12" 
            md="6" 
            class="
              d-flex 
              align-center 
              align-sm-center 
              align-md-end 
              flex-column
            "
            >
            <v-img
              width="250"
              :src="bookSelected.book_link_jpg"
              ></v-img>
          </v-col>
          <v-col 
            cols="12" 
            sm="12"
            md="6" 
            class="
              align-center 
              align-sm-center 
              align-md-start 
              flex-column
            "
            >
            <div class="subtitle-2">
              <p>สารบัญ<span class="pink--text subtitle-2"> {{sarabunTotal}}</span></p>
              <p>ชุดหนังสือ <span class="pink--text subtitle-2">{{bookSelected.book_category}}</span></p>
            </div>
            <v-btn
              :href="bookSelected.book_link_pdf"
              target="_blank"
              class="mr-3"
              color="primary"
              >
              <v-icon>mdi-file-pdf</v-icon>
              <div>PDF</div> 
            </v-btn>
            <v-btn
              :href="bookSelected.book_link_text"
              target="_blank"
              color="primary"
              >
              <v-icon class="mr-1">mdi-book-open-page-variant</v-icon>
              <div>TEXT</div> 
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      
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
            mx-width="500"
            >
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
    </v-card>
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
  </div>
</template>

<script>
export default {
  props: {
    book_name: String
  },
  data() {
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
      word_copy:'คัดลอก',
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
      this.$store.dispatch('setPagenation', {limit:this.itemsPerPage, offset:offset, book_name: this.book_name})
      // console.log('offset'+offset)
    },
  },
   methods: {
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
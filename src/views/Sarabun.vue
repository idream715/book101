<template>
  <div name="sarabun" class="all">
    <v-card flat>
      <v-card-title class="justify-center">
        <div class="font-weight-bold">
          {{bookSelected.book_name}}
        </div>
      </v-card-title>
      <v-card-text >
        <v-row>
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
              v-if="loading===true"
              width="250"
              height="350"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <v-img
              v-else
              width="250"
              :src="bookSelected.book_link_jpg"
              class="elevation-10"
            ></v-img>
          </v-col>
          <v-col 
            cols="12" 
            sm="12"
            md="6" 
            class="
              d-flex 
              align-center 
              align-md-start 
              flex-column
            "
          >
            <div v-if="loading===true">
              <p v-for="(n,i) in 2" :key="i">
                <v-skeleton-loader
                  type="text"
                  max-width="200"
                ></v-skeleton-loader>
              </p>
              <v-skeleton-loader
                type="actions"
                class="d-flex justify-start"
              ></v-skeleton-loader>
            </div>
            <div class="subtitle-1 justify-md-center" v-else>
              <p v-if="sarabunTotal">จำนวนสารบัญ 
                <span class="pink--text subtitle-1 font-weight-bold" v-text="sarabunTotal"></span>
              </p>
              <p>ชุดหนังสือ 
                <span class="pink--text subtitle-1 font-weight-bold" v-text="bookSelected.book_category"></span>
              </p>
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
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card
        max-width="800"
        class="mx-auto elevation-10"
        v-if="sarabunTotal"
      >
        <v-list>
          <v-subheader 
            class="primary--text title d-flex justify-center font-weight-bold"
          ><h4 class="sara">สารบัญ</h4></v-subheader>
          <div v-if="loading===true">
            <v-skeleton-loader
              v-for="(n,i) in 10" :key="i"
              type="list-item"
              transition="scale-transition"
              class="mx-auto"
            ></v-skeleton-loader>
          </div>
          
            
          <v-list-item-group
            active-class="primary--text"
          >
            <template v-for="(item, i) in sarabunSelected">
              <v-list-item :key="item.search_index">
                <template v-slot:default="{ active }">
                  <v-list-item-avatar>
                    <v-list-item-title
                      v-text="i+1+'.'"
                    ></v-list-item-title>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-text="item.search_index"></v-list-item-title>
                  </v-list-item-content>
                  
                  <v-list-item-action v-if="active">
                    <v-btn :href="item.link_pdf" target="_blank" icon>
                      <v-icon :color="item.link_pdf ? 'red' : 'grey'">mdi-file-pdf</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-action v-if="active">
                  <v-btn
                      @click="readText(item.search_index,item.search_details)"
                      text icon
                      >
                      <v-icon :color="item.search_details ? 'blue': 'grey'">
                        mdi-book-open-page-variant
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider
                v-if="i + 1 < sarabunSelected.length"
                :key="i"
              ></v-divider>
            </template>
          </v-list-item-group>
          <v-row>
            <v-col cols="12" v-if="sarabunSelected.length>0 && sarabunSelected.length < sarabunTotal">
              <v-skeleton-loader
                v-for="n in 3"
                :key="n"
                type="list-item"
                class="mx-auto"
                v-intersect="nextLoading"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
           
        </v-list>
      </v-card>
    </v-card>
    <v-dialog
      v-model="dialogReadText"
      max-width="800" 
      class="elevation-10"
    >
      <v-card >
        <v-card-title class="d-flex justify-center" v-html="textSarabun">
        </v-card-title>
        <v-card-text style="white-space: pre-wrap;" class="d-flex justify-center" v-html="textDetail">
        </v-card-text>
        <input type="hidden" id="textDetail" style="white-space: pre-wrap; " :value="textDetail">
        <v-card-actions class="justify-end">
          <v-btn
            color="primary"
            text
            @click.stop.prevent="copyTextDetail"
          >
            {{word_copy}}
          </v-btn>
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
    id: String
  },
  data() {
    return {
      dialogReadText: false,
      itemsPerPage: 50,
      textSarabun:"",
      textDetail:``,
      word_copy:'คัดลอก',
    }
  },
  created() {
    this.$store.dispatch('setbook_index',this.id)
    this.$store.dispatch('setPagenation', {limit:this.itemsPerPage, offset:0, book_id: this.id})
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
    nextLoading(){
      let timesLoaded = Math.ceil(this.$store.getters.getSarabun.length/this.itemsPerPage) 
      if(timesLoaded<this.pages){
        timesLoaded += 1
        let offset = 0
        offset = timesLoaded*this.itemsPerPage-this.itemsPerPage;
        this.$store.dispatch('setContinueToLoad', {limit:this.itemsPerPage, offset:offset, book_id : this.id})
        console.log('offset'+offset)
      }
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
      },
    }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

  .v-application .font-weight-bold {  
    font-family: 'Sarabun', sans-serif;
    font-size: 1.5rem;
  }

  .all {
    font-family: 'Sarabun', sans-serif;
  }

  p {
    font-family: 'Sarabun', sans-serif;
  }
  
  .sara {
    font-family: 'Sarabun', sans-serif;
  }
  
  .v-application .subtitle-1 {
    font-family: 'Sarabun', sans-serif !important;
  }
</style>

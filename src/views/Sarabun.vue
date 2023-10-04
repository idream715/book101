<template>
  <div name="sarabun" class="all">
    <v-card flat max-width="800" class="mx-auto">
      <v-skeleton-loader
        v-if="loading===true"
        max-width="600"
        type="heading"
        class="mx-auto d-flex justify-center mt-5"
      ></v-skeleton-loader>
      <v-card-title class="justify-center">
        <div class="font-weight-bold">
          {{ bookSelected.bookName }}
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
              :src="bookSelected.bookCover"
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
              <p>จำนวนสารบัญ
                <span class="pink--text subtitle-1 font-weight-bold" v-text="sarabunTotal"></span>
              </p>
              <p>ชุดหนังสือ
                <span class="pink--text subtitle-1 font-weight-bold" v-text="bookSelected.categoryName"></span>
              </p>
              <v-btn
                :href="bookSelected.bookPdf"
                target="_blank"
                class="mr-3"
                color="primary"
                >
                <v-icon>mdi-file-pdf</v-icon>
                <div>PDF</div>
              </v-btn>
              <v-btn
                v-show="bookSelected.bookText.includes('.txt')"
                class="mr-3"
                :href="bookSelected.bookText"
                target="_blank"
                color="primary"
                >
                <v-icon class="mr-1">mdi-book-open-page-variant</v-icon>
                <div>TEXT</div>
              </v-btn>
              <!-- <v-btn
                color="primary"
                @click.prevent="downloadItem({
                  url: bookSelected.bookPdf,
                  label: bookSelected.bookName
                })"
              >
                <v-icon class="mr-1">mdi-download</v-icon>
                DOWNLOAD
              </v-btn> -->
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card
        class="mx-auto elevation-10"
      >
        <v-list>
          <v-subheader
            class="primary--text title d-flex justify-center font-weight-bold"
          >
            <h4 class="sara">สารบัญ</h4>
          </v-subheader>
          <div v-for="(n,i) in 5" :key="i">
            <v-skeleton-loader
              v-if="loading"
              type="list-item"
              :loading="loading"
              transition="fade-transition"
              class="mx-auto"
            ></v-skeleton-loader>
          </div>

          <v-list-item-group
            active-class="primary--text"
          >
            <v-list-item v-for="(item, i) in sarabunSelected" :key="item.chapterId">
              <template>
                <v-list-item-avatar>
                  <v-list-item-title
                    v-text="i+1+'.'"
                  ></v-list-item-title>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.chapterHeading" style="line-height: unset;"></v-list-item-title>
                </v-list-item-content>
                <v-btn
                  v-show="item.chapterLinkYouTube.length > 0"
                  icon
                  @click="showDialogYoutube(item.chapterLinkYouTube)"
                >
                  <v-icon color="red">mdi-youtube</v-icon>
                </v-btn>


                <v-list-item-action>
                </v-list-item-action>
                <v-list-item-action>
                  <v-btn :href="item.chapterLinkPdf" target="_blank" icon>
                    <v-icon :color="item.chapterLinkPdf.length > 0 ? 'red' : 'grey'">mdi-file-pdf</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                <v-btn
                    @click="readText(item.chapterHeading,item.chapterDetail)"
                    text icon
                    >
                    <v-icon :color="item.chapterDetail ? 'blue': 'grey'">
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
    <v-row justify="center">
      <v-dialog persistent v-model="dialogYoutube" max-width="640">
        <v-card class="max-width-auto info" flat>
          <youtube
            class="d-flex justify-center"
            :video-id="videoId"
            :player-vars="{ autoplay: 1 }"
          ></youtube>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent lighten-1" text target="_blank" :href="videoURL">เข้าสู่เว็บหลักYoutube</v-btn>
            <v-btn color="accent lighten-1" text @click="closeDialogYoutube">ออก</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialogReadText"
        max-width="800"
        class="elevation-10"
      >
        <v-card >
          <v-card-title class="d-flex justify-center" v-html="textSarabun">
          </v-card-title>
          <v-card-text style="white-space: pre-wrap;" class="d-flex justify-center" ref="textCopy" v-html="textDetail">
          </v-card-text>
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
    </v-row>
  </div>
</template>

<script>
  import Axios from 'axios'
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
        dialogYoutube: false,
        videoId: '',
        videoURL: ''
      }
    },
    created() {
      this.$gtag.event('page_view', {
          'page_title': 'Book101 Sarabun',
          'page_path': `/${this.$route.params.id}`,
        })

      this.$store.dispatch('setbook_index',this.id)
      this.$store.dispatch('setFirstSarabun', {limit:this.itemsPerPage, offset:0, book_id: this.id})
    },
    methods: {
      showDialogYoutube (url) {

        this.dialogYoutube = !this.dialogYoutube
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        const match = url.match(regExp)

        let vid = (match && match[7].length == 11) ? match[7] : false

        this.videoURL = url
        this.videoId = vid
      },
      closeDialogYoutube () {
        this.dialogYoutube = !this.dialogYoutube
        this.videoURL = ''
        this.videoId = ''
      },
      readText(sarabun,detail){
        this.dialogReadText = !this.dialogReadText
        window.getSelection().removeAllRanges()
        this.textSarabun = sarabun
        this.textDetail = detail
        this.word_copy = 'คัดลอก'
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
      nextLoading(){
        let timesLoaded = Math.ceil(this.$store.getters.getSarabun.length/this.itemsPerPage)
        if(timesLoaded<this.pages){
          timesLoaded += 1
          let offset = 0
          offset = timesLoaded*this.itemsPerPage-this.itemsPerPage;
          this.$store.dispatch('setContinueToLoad', {limit:this.itemsPerPage, offset:offset, book_id : this.id})
        }
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
      downloadItem ({ url, label }) {
        Axios.get(url, { responseType: 'blob' })
          .then(response => {
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = label
            link.click()
            URL.revokeObjectURL(link.href)
          }).catch(console.error)
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

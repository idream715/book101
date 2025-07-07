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
          {{ bookSelected?.bookName || 'Loading...' }}
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
              :src="bookSelected?.bookCover"
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
                <span class="pink--text subtitle-1 font-weight-bold" v-text="bookSelected?.categoryName"></span>
              </p>
              <v-btn
                :href="bookSelected?.bookPdf"
                target="_blank"
                class="mr-3"
                color="primary"
                >
                <v-icon>mdi-file-pdf</v-icon>
                <div>PDF</div>
              </v-btn>
              <v-btn
                v-show="bookSelected.bookText && bookSelected.bookText.includes('.txt')"
                class="mr-3"
                :href="bookSelected?.bookText"
                target="_blank"
                color="primary"
                >
                <v-icon class="mr-1">mdi-book-open-page-variant</v-icon>
                <div>TEXT</div>
              </v-btn>
              <v-btn
                color="primary"
                @click.prevent="downloadItem({
                  url: bookSelected?.bookPdf,
                  label: bookSelected?.bookName
                })"
              >
                <v-icon class="mr-1">mdi-download</v-icon>
                DOWNLOAD
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card
        class="mx-auto elevation-10"
      >
        <v-list>
          <v-list-subheader
            class="primary--text title d-flex justify-center font-weight-bold"
          >
            <h4 class="sara">สารบัญ</h4>
          </v-list-subheader>
          <div v-for="(n,i) in 5" :key="i">
            <v-skeleton-loader
              v-if="loading"
              type="list-item"
              :loading="loading"
              transition="fade-transition"
              class="mx-auto"
            ></v-skeleton-loader>
          </div>

          <v-list>
            <template v-for="(item, i) in sarabunSelected" :key="item.chapterId">
              <v-list-item>
                <template v-slot:prepend>
                  <v-avatar color="grey-lighten-1">
                    <span>{{ i + 1 }}.</span>
                  </v-avatar>
                </template>

                <v-list-item-title style="line-height: unset;">{{ item.chapterHeading }}</v-list-item-title>

                <template v-slot:append>
                  <v-btn
                    v-show="item.chapterLinkYouTube && item.chapterLinkYouTube.length > 0"
                    variant="text"
                    icon
                    @click="showDialogYoutube(item.chapterLinkYouTube)"
                  >
                    <v-icon color="red">mdi-youtube</v-icon>
                  </v-btn>

                  <v-btn :href="item.chapterLinkPdf" target="_blank" icon variant="text">
                    <v-icon :color="item.chapterLinkPdf && item.chapterLinkPdf.length > 0 ? 'red' : 'grey'">mdi-file-pdf-box</v-icon>
                  </v-btn>

                  <v-dialog max-width="800" v-if="item.chapterDetail">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                        v-bind="activatorProps"
                        variant="text" icon
                      >
                        <v-icon color="blue">
                          mdi-book-open-page-variant
                        </v-icon>
                      </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                      <v-card>
                        <v-card-title class="d-flex justify-center">
                          {{ item.chapterHeading }}
                        </v-card-title>
                        <v-card-text style="white-space: pre-wrap;" class="d-flex justify-center">
                          {{ item.chapterDetail }}
                        </v-card-text>
                        <v-card-actions>
                          <v-btn
                            color="primary"
                            variant="text"
                            @click="copyTextDetail(item.chapterDetail)"
                          >
                            คัดลอก
                          </v-btn>
                          <v-btn
                            color="primary"
                            variant="text"
                            @click="isActive.value = false"
                          >
                            ออก
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                  <v-btn
                    v-else
                    variant="text" icon
                    disabled
                  >
                    <v-icon color="grey">
                      mdi-book-open-page-variant
                    </v-icon>
                  </v-btn>
                </template>
              </v-list-item>
              <v-divider
                v-if="i + 1 < (sarabunSelected || []).length"
              ></v-divider>
            </template>
          </v-list>
          <v-row>
            <v-col cols="12" v-if="(sarabunSelected || []).length>0 && (sarabunSelected || []).length < sarabunTotal">
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
            <v-btn color="accent lighten-1" variant="text" target="_blank" :href="videoURL">เข้าสู่เว็บหลักYoutube</v-btn>
            <v-btn color="accent lighten-1" variant="text" @click="closeDialogYoutube">ออก</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
  import Axios from 'axios'
  import { useBooksStore } from '@/stores/books'
  import { useSearchStore } from '@/stores/search'

  export default {
    setup() {
      const booksStore = useBooksStore()
      const searchStore = useSearchStore()
      return { booksStore, searchStore }
    },
    props: {
      id: String
    },
    data() {
      return {
        itemsPerPage: 50,
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

      this.booksStore.setbook(this.id)
      this.booksStore.setSarabun({bookId: this.id, offset: 0})
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
      copyTextDetail (text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        } else {
          // Fallback for older browsers
          try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            console.log('Text copied using fallback method');
          } catch (err) {
            console.error('Failed to copy text: ', err);
          }
        }
      },
      nextLoading(){
        let timesLoaded = Math.ceil(this.booksStore.getSarabuns.length/this.itemsPerPage)
        if(timesLoaded<this.pages){
          timesLoaded += 1
          let offset = 0
          offset = timesLoaded*this.itemsPerPage-this.itemsPerPage;
          this.booksStore.setSarabun({bookId: this.id, offset: offset})
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
        const namepdf = this.extractPdfFileName(url)
        Axios({
          url: `https://one.rgtcenter.com/dm01/api/download/book/${namepdf}`,
          method: 'GET',
          responseType: 'blob',
        })
          .then(response => {
            const blob = new Blob([response.data], { type: 'application/pdf' })
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.setAttribute('download', `${label}.pdf`)
            document.body.appendChild(link)
            // link.download = label
            link.click()
            // URL.revokeObjectURL(link.href)
            link.parentNode.removeChild(link);
          }).catch(console.error)
      },
      extractPdfFileName(x) {
        // Split the URL by '/' and get the last part
        const parts = x.split('/');
        const lastPart = parts[parts.length - 1];

        // Optional: Check if the last part ends with '.pdf'
        if (lastPart.endsWith('.pdf')) {
            return lastPart;
        } else {
            return null; // or handle this case as you see fit
        }
      }
    },
    computed: {
        bookSelected(){
          return this.booksStore.getbook || {}
        },
        sarabunSelected(){
          return this.booksStore.getSarabuns || []
        },
        sarabunTotal(){
          return this.booksStore.getTotalSarabun || 0
        },
        pages(){
          return Math.ceil(this.sarabunTotal/this.itemsPerPage)
        },
        loading(){
          return this.searchStore.getoverlay
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

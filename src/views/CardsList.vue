<template>
  <div class="cards-list">
    <v-container>
      <v-overlay v-model="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card shaped class="my-6" color="info">
        <v-card-text v-show="show">
          <v-row>
            <v-col cols="10">
              <v-autocomplete
                v-model="filterTags"
                :items="tagItems"
                outlined
                multiple
                dense
                label="เลือก Tag ของการ์ด"
              ></v-autocomplete>
            </v-col>
            <v-col v-if="checkMobile" cols="2" class="mb-8">
              <!-- <v-btn
                color="accent"
                rounded
                @click="clickedFilter"
              >
                FILTER
              </v-btn> -->
              <v-btn
                color="accent"
                text
                rounded
                @click="filterTags = []"
              >
                CLEAR
              </v-btn>
            </v-col>
            <v-col v-else cols="2" class="mb-8">
              <!-- <v-btn
                color="accent"
                large
                icon
                @click="clickedFilter"
              >
                <v-icon>
                  mdi-filter
                </v-icon>
              </v-btn> -->
              <v-btn
                color="accent"
                large
                icon
                @click="filterTags = []"
              >
                <v-icon>
                  mdi-filter-remove-outline
                </v-icon>
              </v-btn>
            </v-col>
            <!-- <v-combobox
                v-model="searchingWords"
                outlined
                multiple
                :items="items"
                dense
                clearable
                label="ค้นหาคำในการ์ด"
                :delimiters="space"
              ></v-combobox> -->
            <v-col col="12">
              <v-combobox
                v-model="model"
                :filter="filter"
                :hide-no-data="!search"
                :search-input.sync="search"
                hide-selected
                label="ค้นหาคำในการ์ด"
                :delimiters="space"
                multiple
                small-chips
                dense
                outlined
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <span class="subheading">ค้นหา</span>
                    <v-chip
                      :color="`${colors[nonce - 1]} lighten-3`"
                      label
                      small
                    >
                      {{ search }}
                    </v-chip>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ attrs, item, parent, selected }">
                  <v-chip
                    v-if="item === Object(item)"
                    v-bind="attrs"
                    :color="`${item.color} lighten-3`"
                    :input-value="selected"
                    label
                    small
                  >
                    <span class="pr-2">
                      {{ item.text }}
                    </span>
                    <v-icon
                      x-small
                      @click="parent.selectItem(item)"
                    >
                      $delete
                    </v-icon>
                  </v-chip>
                </template>
                <template v-slot:item="{ index, item }">
                  <v-text-field
                    v-if="editing === item"
                    v-model="editing.text"
                    autofocus
                    flat
                    background-color="transparent"
                    hide-details
                    solo
                    @keyup.enter="edit(index, item)"
                  ></v-text-field>
                  <v-chip
                    v-else
                    :color="`${item.color} lighten-3`"
                    dark
                    label
                    x-small
                  >
                    {{ item.text }}
                  </v-chip>
                  <v-spacer></v-spacer>
                  <v-list-item-action @click.stop>
                    <v-btn
                      icon
                      @click.stop.prevent="edit(index, item)"
                    >
                      <v-icon>{{ editing !== item ? 'mdi-pencil' : 'mdi-check' }}</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </template>
              </v-combobox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            class="ml-2"
            color="accent"
            @click="show = !show"
          >
            {{ show ? 'HIDE TOOLBAR' : 'SHOW TOOLBAR' }}
            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="show"
            class="mr-3 white--text"
            color="#AF2743"
            rounded
            @click="clickedSearch"
          >
            <v-icon>mdi-magnify</v-icon>
            SEARCH&nbsp;
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-if="!emptyCards" shaped>
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="accent--text">
            ผลลัพธ์ของการ์ดจำนวน {{ itemsAmount }} การ์ด
          </span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-for="card in listOfCards"
              :key="card.cardId"
              cols="6"
              sm="4"
              md="3"
            >
              <v-card max-width="300px">
                <v-img
                  :src="card.cardPicThumbnails"
                  class="white--text align-end"
                  height="200px"
                  @click="popDialogCard(card)"
                >
                </v-img>
                <v-card-actions>
                  <span class="card-title">
                    {{ card.cardDetail }}
                  </span>

                  <v-spacer></v-spacer>

                  <v-btn
                    icon
                    @click="popDialogCard(card)"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-card-actions>

              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-row v-if="loading===false">
          <v-card
            class="mx-auto"
            max-width="100%"
            flat
            v-if="emptyCards"
          >
            <v-card-text  class="headline">
              <div class="mb-3">คำค้นหาหรือ Tag ของคุณไม่ตรงกับเอกสารใดๆ</div>
              <p v-for="(w,i) in model" :key="i" :value="w" class="headline" style="color:red;">
                - คำค้น: {{ w.text }} Tags: {{ filterTags }}
              </p>
              <div >
                <span>คำแนะนำ :</span><br>
                <p></p>
                <p>- ตรวจดูให้แน่ใจว่าสะกดถูกต้องทุกคำ</p>
                <p>- ลองใช้คำอื่นๆ</p>
                <p>- ลองใช้คำที่กว้างขึ้น</p>
                <p>- ลองใช้คำที่น้อยลง</p>
              </div>
            </v-card-text>
          </v-card>
       </v-row>

      <v-row justify="center">
        <v-dialog persistent v-model="dialogCard" max-width="640" max-height="480">
          <v-card class="max-width-auto info" flat>
            <img :src="picCard" style="width: 100%;">
            <!-- <v-img
              :lazy-src="thumbnailCard"
              max-width="640"
              :src="picCard"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img> -->
            <v-card-title v-show="showText">
              <v-spacer></v-spacer>
              <v-btn color="accent lighten-1" text @click="copyTextDetail">คัดลอกเนื้อหา</v-btn>
            </v-card-title>
            <v-card-text v-show="showText" ref="text" v-html="textCard" style="font-size: 17px; white-space: pre-wrap;">
            </v-card-text>
            <v-card-text>
              <div class="pa-4">
                <v-chip-group
                >
                  <v-chip
                    color="primary"
                    v-for="tag in tagsCard"
                    :key="tag"
                    small
                  >
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                class="ml-2"
                color="accent lighten-1"
                @click="showText = !showText"
              >
                {{ showText ? 'ซ่อนเนื้อหา' : 'แสดงเนื้อหา' }}
                <v-icon>{{ showText ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <!-- <v-btn color="accent lighten-1" text @click="downloadItem({ url: picCard, label: 'downloadImg' })">บันทึกภาพ</v-btn> -->
              <v-btn color="accent lighten-1" text @click="closeDialog">ออก</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
    <v-col cols="12" v-if="listOfCards.length < itemsAmount">
      <v-card flat v-intersect.quiet="infiniteScrolled">
      </v-card>
    </v-col>
  </div>
</template>

<script>
export default {
  data () {
      return {
        src: 'https://s3.ap-southeast-1.amazonaws.com/book.dhamma01.com/cards/luangpu.jpg',
        title: '',
        show: true,
        page: 1,
        filterTags: [],
        model: [],
        space:[' '],
        limit: 48,
        dialogCard: false,
        picCard: '',
        thumbnailCard: '',
        textCard: '',
        tagsCard: [],
        showText: false,
        activator: null,
        attach: null,
        colors: [ 'pink', 'purple', 'indigo', 'teal', 'primary', 'accent' ],
        editing: null,
        editingIndex: -1,
        items: [
        ],
        nonce: 1,
        menu: false,
        x: 0,
        search: null,
        y: 0,
      }
    },
  created () {
    this.$store.dispatch('clear')
    this.$store.dispatch('getTagOfCards', this.$route.query.t)
    this.$store.dispatch('getCardFromApi', this.$route.query.t)

  },
  // beforeMount () {
  // },
  watch: {
    model (val, prev) {
      if (val.length === prev.length) return

      this.model = val.map(v => {
        if (typeof v === 'string') {
          v = {
            text: v,
            color: this.colors[this.nonce - 1],
          }

          this.items.push(v)

          this.nonce++
        }

        return v
      })
    },
  },
  computed: {
    listOfCards () {
      return this.$store.getters.getCards
    },
    loading(){
      return this.$store.getters.getoverlay
    },
    emptyCards () {
      return this.$store.getters.getnotfound
    },
    tagItems () {
      return this.$store.getters.getTags
    },
    itemsAmount () {
      return this.$store.getters.getTotalCards
    },
    checkToolbarFlag () {
      return this.$store.getters.getCheckToolbar
    },
    checkMobile () {
      return !this.$vuetify.breakpoint.mobile
    },
  },
  methods: {
    edit (index, item) {
      if (!this.editing) {
        this.editing = item
        this.editingIndex = index
      } else {
        this.editing = null
        this.editingIndex = -1
      }
    },
    filter (item, queryText, itemText) {
      if (item.header) return false

      const hasValue = val => val != null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    },
    clickedFilter () {
      let words =this.filterTags

      if (words.length > 0) {
        this.$store.dispatch('setFilteredCards',{
          words: words,
          offset: this.limit,
          creator: this.$route.query.t
        })
      }
    },
    clickedSearch () {

      let words = []

      if(this.model.length > 0) {
        words = this.model.map(x => x.text)
      } else if (this.model.length === 0 && this.search !== null) {
        words.push(this.search)
      }

      let tags = this.filterTags

      if (words.length > 0 && tags.length > 0) {
        this.$store.dispatch('setSearchedCards',{
          words: words,
          creator: this.$route.query.t,
          tags: tags
        })

      } else if (words.length === 0 && tags.length > 0) {

        this.$store.dispatch('setFilteredCards',{
          words: tags,
          offset: this.limit,
          creator: this.$route.query.t
        })

      } else if (words.length > 0 && tags.length === 0) {

        this.$store.dispatch('setSearchedCards',{
          words: words,
          creator: this.$route.query.t,
          tags: tags
        })

      } else if (words.length === 0 && tags.length === 0) {
        this.$store.dispatch('clear')
        this.$store.dispatch('getCardFromApi', this.$route.query.t)
      }
    },
    infiniteScrolled () {
      setTimeout(() => {
      const words = this.model.map(x => x.text)
      let lastCardsIndex = this.listOfCards.length
        switch (this.checkToolbarFlag) {
          case '':
            this.$store.dispatch('setCardInfiniteScrolled',{
              offset: lastCardsIndex,
              creator: this.$route.query.t
            })
            break;
          case 'filter':
            this.$store.dispatch('setFilteredCardsContinue',{
              words: this.filterTags,
              offset: lastCardsIndex,
              creator: this.$route.query.t
            })
            break;
          case 'search':
            this.$store.dispatch('setSearchedCardsContinue',{
              words: words,
              offset: lastCardsIndex,
              creator: this.$route.query.t,
              tags: this.filterTags
            })
            break;
        }
      }, 500);
    },
    popDialogCard (element) {
      this.dialogCard = !this.dialogCard
      this.picCard = element.cardPic
      this.thumbnailCard = element.cardPicThumbnails
      this.textCard = element.cardDetail
      this.tagsCard = element.cardTags
    },
    closeDialog () {
      this.picCard = ''
      this.thumbnailCard = ''
      this.textCard = ''
      this.tagsCard = []
      this.dialogCard = !this.dialogCard
    },
    copyTextDetail () {
      this.selectText(this.$refs.text); // e.g. <div ref="text">
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
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

.cards-list {
  font-family: 'Sarabun', sans-serif;
}


.card-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #616161;
  font-family: 'Sarabun', sans-serif;
}
</style>
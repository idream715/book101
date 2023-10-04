<template>
  <div class="shorts-story">
    <v-container>
      <!-- <v-overlay v-model="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay> -->

      <v-card shaped class="my-6" color="info">
        <v-card-text v-show="show">
          <v-row>
            <!-- <v-col cols="10">
              <v-autocomplete
                outlined
                multiple
                dense
                label="Tags ของ ปกิณกะ"
              ></v-autocomplete>
            </v-col>
            <v-col v-if="checkMobile" cols="2" class="mb-8">
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
            </v-col> -->
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
                label="ค้นหาข้อความปกิณกะ"
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
          <!-- <v-btn
            v-if="show"
            class="mr-3 white--text"
            color="#AF2743"
            rounded
            @click="clickedSearch"
          >
            <v-icon>mdi-magnify</v-icon>
            SEARCH&nbsp;
          </v-btn> -->
        </v-card-actions>
      </v-card>

      <v-card flat>
        <v-card-title>
          ปกิณกะ
        </v-card-title>
      </v-card>


       <v-row v-if="loading===false">
          <v-card
            class="mx-auto"
            max-width="100%"
            flat
            v-if="notfound===true"
          >
            <v-card-text  class="headline">
              <div class="mb-3">คำค้นหาของคุณไม่ตรงกับเอกสารใดๆ</div>
              <p v-for="(w,i) in model" :key="i" :value="w" class="headline" style="color:red;">
                - {{w.text}}
              </p>
              <div >
                 คำแนะนำ :<br>
                <p>- ตรวจดูให้แน่ใจว่าสะกดถูกต้องทุกคำ</p>
                <p>- ลองใช้คำอื่นๆ</p>
                <p>- ลองใช้คำที่กว้างขึ้น</p>
                <p>- ลองใช้คำที่น้อยลง</p>
              </div>
            </v-card-text>
          </v-card>
       </v-row>

      <v-row id="top" v-if="loading===false">
        <v-col cols="12" >
          <v-timeline
            align-top
            dense
          >
            <v-timeline-item
              v-for="(item,i) in indexs"
              :key="i"
              dot-color="pink"
              size="small"
            >
              <div class="d-flex">
                <strong class="me-4 pink--text">{{ item.year }}</strong>
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-card
                      class="px-5"
                      elevation="0"
                      v-bind="props"
                      :color="isHovering ? 'pink' : 'transparent'"
                      @click="dialogs(item.chapterHeading, item.chapterDetail, item.chapterDetail, item.bookName, item.chapterId)"
                    >
                      <strong>{{ item.chapterHeading }}</strong>
                      <div class="text-caption">
                        {{ item.situation }}
                      </div>
                    </v-card>
                  </template>
                </v-hover>
              </div>
            </v-timeline-item>
          </v-timeline>


          <v-dialog v-model="dialog" max-width="1100" align="center"   >
            <v-card>
              <v-card class="d-flex justify-center" flat>
                <v-card class="max-width-auto"  flat>
                  <v-card-text class=" lighten-2 " style="line-height:2;font-size:24px;">{{ head_content }}</v-card-text>
                  <v-list-item-title class="grey--text "><v-btn text color="primary lighten-1"><v-icon small class="mr-2">mdi-book-open-page-variant</v-icon>จากหนังสือ:{{frombook}}</v-btn></v-list-item-title>
                <div >
                  <v-card-text ref="textCopy" style="font-size: 17px; white-space: pre-wrap;" >{{ content_copy }}</v-card-text>
                </div>
                </v-card>

              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary lighten-1" text @click="copyTextDetail">{{word_copy}}</v-btn>
                <v-btn color="primary lighten-1" text @click="close">ออก</v-btn>

              </v-card-actions>
              </v-card>
          </v-dialog>

        </v-col>
      </v-row><br>

      <div v-if="loading===true">
        <v-col cols="12" v-for="(item,i) in 10" :key="i">
          <v-card >

              <v-skeleton-loader
                ref="skeleton"
                type= "list-item-avatar"
                class="mx-auto"
              ></v-skeleton-loader>

          </v-card><br>
        </v-col>
      </div>

      <v-col cols="12" v-if=" indexs.length<getTotalIndexs">
        <v-card >

          <v-skeleton-loader
            ref="skeleton"
            type= "list-item-avatar"
            class="mx-auto"
            v-intersect="infiniteRow"
          ></v-skeleton-loader>

        </v-card><br>
      </v-col>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    show: false,
    content:"",
    content_copy:"",
    head_content:"",
    frombook:"",
    book_id:"",
    word_copy:'คัดลอก',
    activator: null,
    attach: null,
    colors: [ 'pink', 'purple', 'indigo', 'teal', 'primary', 'accent' ],
    items: [],
    nonce: 1,
    search: null,
    space:[' '],
    editing: null,
    editingIndex: -1,
    filterTags: [],
    model: [],
    dialogYoutube: false,
    videoId: '',
    videoURL: '',
    startTime: 0
  }),
  watch: {
    model (val, prev) {
      if (val.length === prev.length) return

      if (val.length > 5) {
        this.$nextTick(() =>this.model.pop())
      }

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
    loading(){
      return this.$store.getters.getoverlay
    },
    indexs(){
      const list = this.$store.getters.getIndexs
      if (this.model.length > 0) {
        return list.filter(x => x.chapterDetail.includes(this.model.map(x => x.text).join(' ')))
      }
      return list
    },
    getTotalIndexs(){
      return this.$store.getters.getTotalIndexs
    },
    checkMobile () {
      return !this.$vuetify.breakpoint.mobile
    },
    notfound(){
      return (this.indexs.length===0 && this.$store.getters.getTotalIndexs!==0)
    },
  },
  created () {
    this.$store.dispatch('clear')
    this.$store.dispatch('getShortsFromApi', this.$route.query.t)
  },
  beforeDestroy () {
    this.$store.dispatch('clear')
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
    text_render(input){
      if(!input.includes("<mark>")) return input

       let text = input.split("html")
       if(text.length>1){
        let t = input.split("html").slice(1).join(' ')
        let b = t.replace('<mark>',`$<mark>`)
        let s = b.split("$")
        let x = s[0].split(" ")
        let value =`${x[x.length-1]}${s[1]}`
        return value
       }else{
        let b = input.replace('<mark>',`$<mark>`)
        let s = b.split("$")
        let x = s[0].split(" ")
        let value =`${x[x.length-1]}${s[1]}`
        return value
       }
    },
    dialogs(head,content,content_copy,book,id){
      this.dialog=!this.dialog
      this.content=content
      this.content_copy=content_copy
      this.head_content=head
      this.frombook=book
      this.book_id=id
    },
    close(){
      this.dialog=!this.dialog
      window.getSelection().removeAllRanges()
      this.word_copy = 'คัดลอก'
      this.content=""
      this.head_content=""
    },
    infiniteRow(){
      let offset = this.$store.getters.getIndexs.length

      if (this.model.length > 0) {
        this.$store.dispatch('searchShortFromApiContinue',{ words:this.model, page:offset, creator: this.$route.query.t })
      } else {
        this.$store.dispatch('setShortFromApiContinue',{ page: offset, creator: this.$route.query.t })
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
  }
}
</script>

<style>
/* @media (min-width: 320px) {
  h5.heading {
    font-size: 0.8em;
  }
} */
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

p{
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  font-family: 'Sarabun', sans-serif;
}
.shorts-story{
  font-family: 'Sarabun', sans-serif;
}
.headline{
  font-family: 'Sarabun', sans-serif;
}


</style>
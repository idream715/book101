<template>
  <div class="shorts-story">
    <v-container>
      <!-- <v-overlay v-model="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay> -->

      <v-card variant="elevated" class="my-6" color="info">
        <v-card-text v-show="show">
          <v-row>
            <v-col col="12">
              <v-combobox
                v-model="model"
                :filter="filter"
                :hide-no-data="!search"
                v-model:search="search"
                hide-selected
                label="ค้นหาข้อความปกิณกะ"
                :delimiters="space"
                multiple
                chips
                density="compact"
                variant="outlined"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <span class="subheading">ค้นหา</span>
                    <v-chip
                      :color="`${colors[nonce - 1]}-lighten-3`"
                      label
                      size="small"
                    >
                      {{ search }}
                    </v-chip>
                  </v-list-item>
                </template>
                <template v-slot:selection="{ attrs, item, parent, selected }">
                  <v-chip
                    v-bind="attrs"
                    v-if="item === Object(item)"
                    :color="`${item.color}-lighten-3`"
                    :selected="selected"
                    label
                    size="small"
                  >
                    <span class="pr-2">
                      {{ item.text }}
                    </span>
                    <v-icon
                      size="x-small"
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
                    variant="solo"
                    @keyup.enter="edit(index, item)"
                  ></v-text-field>
                  <v-chip
                    v-else
                    :color="`${item.color}-lighten-3`"
                    dark
                    label
                    size="x-small"
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
            density="compact"
          >
            <v-timeline-item
              v-for="(item,i) in indexs"
              :key="i"
              dot-color="pink"
              size="small"
            >
              <div class="d-flex">
                <strong class="me-4 pink-text">{{ item.year }}</strong>
                <v-hover>
                  <template v-slot:default="{ isHovering, props }">
                    <v-card
                      class="px-5"
                      v-bind="props"
                      elevation="0"
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
                  <v-list-item-title class="grey-text "><v-btn variant="text" color="primary-lighten-1"><v-icon size="small" class="mr-2">mdi-book-open-page-variant</v-icon>จากหนังสือ:{{frombook}}</v-btn></v-list-item-title>
                <div >
                  <v-card-text ref="textCopyRef" style="font-size: 17px; white-space: pre-wrap;" >{{ content_copy }}</v-card-text>
                </div>
                </v-card>

              </v-card>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary-lighten-1" variant="text" @click="copyTextDetail">{{word_copy}}</v-btn>
                <v-btn color="primary-lighten-1" variant="text" @click="close">ออก</v-btn>

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

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '@/stores/search'

const route = useRoute()
const searchStore = useSearchStore()

const dialog = ref(false)
const show = ref(false)
const content = ref('')
const content_copy = ref('')
const head_content = ref('')
const frombook = ref('')
const book_id = ref('')
const word_copy = ref('คัดลอก')
const activator = ref(null)
const attach = ref(null)
const colors = ref(['pink', 'purple', 'indigo', 'teal', 'primary', 'accent'])
const items = ref([])
const nonce = ref(1)
const search = ref("")
const space = ref([' '])
const editing = ref(null)
const editingIndex = ref(-1)
const filterTags = ref([])
const model = ref([])
const dialogYoutube = ref(false)
const videoId = ref('')
const videoURL = ref('')
const startTime = ref(0)
const loading = computed(() => searchStore.overlay)

const indexs = computed(() => {
  const list = searchStore.indexs
  if (model.value.length > 0) {
    return list.filter(x => x.chapterDetail.includes(model.value.map(x => x.text).join(' ')))
  }
  return list
})

const getTotalIndexs = computed(() => searchStore.totalsIndexs)

const checkMobile = computed(() => {
  const { $vuetify } = getCurrentInstance().appContext.config.globalProperties
  return !$vuetify.display.mobile
})

const notfound = computed(() => {
  return (indexs.value.length === 0 && searchStore.totalsIndexs !== 0)
})
const edit = (index, item) => {
  if (!editing.value) {
    editing.value = item
    editingIndex.value = index
  } else {
    editing.value = null
    editingIndex.value = -1
  }
}

const filter = (item, queryText, itemText) => {
  if (item.header) return false

  const hasValue = val => val != null ? val : ''

  const text = hasValue(itemText)
  const query = hasValue(queryText)

  return text.toString()
    .toLowerCase()
    .indexOf(query.toString().toLowerCase()) > -1
}

const text_render = (input) => {
  if (!input.includes("<mark>")) return input

  let text = input.split("html")
  if (text.length > 1) {
    let t = input.split("html").slice(1).join(' ')
    let b = t.replace('<mark>', `$<mark>`)
    let s = b.split("$")
    let x = s[0].split(" ")
    let value = `${x[x.length - 1]}${s[1]}`
    return value
  } else {
    let b = input.replace('<mark>', `$<mark>`)
    let s = b.split("$")
    let x = s[0].split(" ")
    let value = `${x[x.length - 1]}${s[1]}`
    return value
  }
}

const dialogs = (head, content_param, content_copy_param, book, id) => {
  dialog.value = !dialog.value
  content.value = content_param
  content_copy.value = content_copy_param
  head_content.value = head
  frombook.value = book
  book_id.value = id
}

const close = () => {
  dialog.value = !dialog.value
  window.getSelection().removeAllRanges()
  word_copy.value = 'คัดลอก'
  content.value = ""
  head_content.value = ""
}

const infiniteRow = () => {
  let offset = searchStore.indexs.length

  if (model.value.length > 0) {
    searchStore.searchShortFromApiContinue({ words: model.value, page: offset, creator: route.query.t })
  } else {
    searchStore.setShortFromApiContinue({ page: offset, creator: route.query.t })
  }
}

const textCopyRef = ref(null)

const selectText = (element) => {
  var range
  if (document.selection) {
    // IE
    range = document.body.createTextRange()
    range.moveToElementText(element)
    range.select()
  } else if (window.getSelection) {
    range = document.createRange()
    range.selectNode(element)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
  }
}

const copyTextDetail = () => {
  selectText(textCopyRef.value)

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'คัดลอกแล้ว' : 'คัดลอกไม่สำเร็จ'
    word_copy.value = `${msg}`
  } catch (err) {
    alert('Oops, unable to copy')
  }
}

// Watchers and lifecycle
watch(model, (val, prev) => {
  if (val.length === prev.length) return

  if (val.length > 5) {
    model.value.pop()
  }

  model.value = val.map(v => {
    if (typeof v === 'string') {
      v = {
        text: v,
        color: colors.value[nonce.value - 1],
      }

      items.value.push(v)
      nonce.value++
    }

    return v
  })
}, { deep: true })

onMounted(() => {
  searchStore.clear()
  searchStore.getShortsFromApi(route.query.t)
})

onBeforeUnmount(() => {
  searchStore.clear()
})
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
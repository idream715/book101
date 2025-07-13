<template>
  <div class="cards-list">
    <v-container>
      <v-overlay v-model="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card variant="elevated" class="my-6" color="info">
        <v-card-text v-show="show">
          <v-row>
            <v-col cols="10">
              <v-autocomplete
                v-model="filterTags"
                :items="tagItems"
                variant="outlined"
                multiple
                density="compact"
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
                variant="text"
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
                size="large"
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
                v-model:search="search"
                hide-selected
                label="ค้นหาคำในการ์ด"
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
                    theme="dark"
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
          <v-btn
            v-if="show"
            class="mr-3 white-text"
            color="#AF2743"
            rounded
            @click="clickedSearch"
          >
            <v-icon>mdi-magnify</v-icon>
            SEARCH&nbsp;
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-if="!emptyCards" variant="elevated">
        <v-card-title>
          <v-spacer></v-spacer>
          <span class="accent--text">
            ผลลัพธ์ของการ์ดจำนวน {{ itemsAmount }} การ์ด
          </span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              v-for="(card, index) in listOfCards"
              :key="index"
              cols="6"
              sm="4"
              md="3"
            >
              <v-card max-width="300px">
                <v-img
                  :src="card.cardPicThumbnails"
                  class="white-text align-end"
                  height="200px"
                  @click="popDialogCard(card, index)"
                >
                </v-img>
                <v-card-actions>
                  <span class="card-title">
                    {{ card.cardDetail }}
                  </span>

                  <v-spacer></v-spacer>

                  <v-btn
                    icon
                    @click="popDialogCard(card, index)"
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
        <v-dialog persistent v-model="dialogCard" max-width="640">
          <v-card class="max-width-auto info" flat>
            <div style="background: red; color: white; padding: 10px;">
              DEBUG: picCard = {{ picCard }}
            </div>
            <img v-if="picCard" :src="picCard" style="width: 100%;" alt="Card image">
            <div v-else style="background: yellow; color: black; padding: 20px;">
              No image to display
            </div>
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
              <v-btn color="accent-lighten-1" variant="text" @click="copyTextDetail">คัดลอกเนื้อหา</v-btn>
            </v-card-title>
            <v-card-text v-show="showText" ref="textRef" style="font-size: 17px; white-space: pre-wrap;">
              DEBUG: textCard = {{ textCard }}
              <br><br>
              {{ textCard }}
            </v-card-text>
            <v-card-text>
              <div class="pa-4">
                <v-chip-group
                >
                  <v-chip
                    color="primary"
                    v-for="tag in tagsCard"
                    :key="tag"
                    size="small"
                  >
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                variant="text"
                class="ml-2"
                color="accent-lighten-1"
                @click="showText = !showText"
              >
                {{ showText ? 'ซ่อนเนื้อหา' : 'แสดงเนื้อหา' }}
                <v-icon>{{ showText ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="accent-lighten-1" variant="text" :disabled="btnDisabled" :loading="btnLoading" @click="handleClick('prev')">ก่อนหน้า</v-btn>
              <v-btn color="accent-lighten-1" variant="text" :disabled="btnDisabled" :loading="btnLoading" @click="handleClick('next')">ถัดไป</v-btn>
              <!-- <v-btn color="accent-lighten-1" variant="text" @click="downloadItem({ url: picCard, label: 'downloadImg' })">บันทึกภาพ</v-btn> -->
              <v-btn color="accent-lighten-1" variant="text" @click="closeDialog">ออก</v-btn>
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

<script setup>
import { ref, computed, onMounted, watch, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useCardsStore } from '@/stores/cards'

const route = useRoute()
const cardsStore = useCardsStore()
const show = ref(true)
const filterTags = ref([])
const model = ref([])
const space = ref([' '])
const dialogCard = ref(false)
const picCard = ref('')
const thumbnailCard = ref('')
const textCard = ref('')
const tagsCard = ref([])
const showText = ref(false)
const colors = ref(['pink', 'purple', 'indigo', 'teal', 'primary', 'accent'])
const editing = ref(null)
const editingIndex = ref(-1)
const selectedIndex = ref(-1)
const btnDisabled = ref(false)
const btnLoading = ref(false)
const items = ref([])
const nonce = ref(1)
const search = ref("")
const listOfCards = computed(() => cardsStore.cards)
const loading = computed(() => cardsStore.overlay)
const emptyCards = computed(() => cardsStore.notfound)
const tagItems = computed(() => cardsStore.cardTags)
const itemsAmount = computed(() => cardsStore.totalsCards)
const checkToolbarFlag = computed(() => cardsStore.cardToolbarFlag)
const checkMobile = computed(() => {
  const { $vuetify } = getCurrentInstance().appContext.config.globalProperties
  return !$vuetify.display.mobile
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
const clickedSearch = () => {
  let words = []

  if (model.value.length > 0) {
    words = model.value.map(x => x.text)
  } else if (model.value.length === 0 && search.value !== "") {
    words.push(search.value)
  }

  let tags = filterTags.value

  if (words.length > 0 && tags.length > 0) {
    cardsStore.setSearchedCards({
      words: words,
      creator: route.query.t,
      tags: tags
    })

  } else if (words.length === 0 && tags.length > 0) {

    cardsStore.setFilteredCards({
      words: tags,
      creator: route.query.t
    })

  } else if (words.length > 0 && tags.length === 0) {

    cardsStore.setSearchedCards({
      words: words,
      creator: route.query.t,
      tags: tags
    })

  } else if (words.length === 0 && tags.length === 0) {
    cardsStore.clear()
    cardsStore.getCardFromApi(route.query.t)
  }
}
const handleClick = (direction) => {
  btnDisabled.value = true
  
  if (direction === 'prev' && selectedIndex.value > 0) {
    selectedIndex.value--
    showPreviousCard()
  } else if (direction === 'next' && selectedIndex.value < listOfCards.value.length - 1) {
    selectedIndex.value++
    showNextCard()
  }
  
  setTimeout(() => {
    btnDisabled.value = false
  }, 1000)
}

const showPreviousCard = () => {
  const prevCard = listOfCards.value[selectedIndex.value]
  if (prevCard) {
    picCard.value = prevCard.cardPic
    thumbnailCard.value = prevCard.cardPicThumbnails
    textCard.value = prevCard.cardDetail
    // Ensure cardTags is an array
    if (Array.isArray(prevCard.cardTags)) {
      tagsCard.value = prevCard.cardTags
    } else if (typeof prevCard.cardTags === 'string') {
      tagsCard.value = prevCard.cardTags.split(',').map(tag => tag.trim())
    } else {
      tagsCard.value = []
    }
  }
}

const showNextCard = () => {
  const nextCard = listOfCards.value[selectedIndex.value]
  if (nextCard) {
    picCard.value = nextCard.cardPic
    thumbnailCard.value = nextCard.cardPicThumbnails
    textCard.value = nextCard.cardDetail
    // Ensure cardTags is an array
    if (Array.isArray(nextCard.cardTags)) {
      tagsCard.value = nextCard.cardTags
    } else if (typeof nextCard.cardTags === 'string') {
      tagsCard.value = nextCard.cardTags.split(',').map(tag => tag.trim())
    } else {
      tagsCard.value = []
    }
  }
}

const infiniteScrolled = () => {
  setTimeout(() => {
    const words = model.value.map(x => x.text)
    let lastCardsIndex = listOfCards.value.length
    switch (checkToolbarFlag.value) {
      case '':
        cardsStore.setCardInfiniteScrolled({
          offset: lastCardsIndex,
          creator: route.query.t
        })
        break
      case 'filter':
        cardsStore.setFilteredCardsContinue({
          words: filterTags.value,
          offset: lastCardsIndex,
          creator: route.query.t
        })
        break
      case 'search':
        cardsStore.setSearchedCardsContinue({
          words: words,
          offset: lastCardsIndex,
          creator: route.query.t,
          tags: filterTags.value
        })
        break
    }
  }, 500)
}

const popDialogCard = (element, index) => {
  console.log('popDialogCard called with:', element)
  selectedIndex.value = index
  dialogCard.value = !dialogCard.value
  picCard.value = element.cardPic
  thumbnailCard.value = element.cardPicThumbnails
  textCard.value = element.cardDetail
  console.log('Setting picCard to:', element.cardPic)
  console.log('Setting textCard to:', element.cardDetail)
  // Ensure cardTags is an array
  if (Array.isArray(element.cardTags)) {
    tagsCard.value = element.cardTags
  } else if (typeof element.cardTags === 'string') {
    tagsCard.value = element.cardTags.split(',').map(tag => tag.trim())
  } else {
    tagsCard.value = []
  }
}

const closeDialog = () => {
  picCard.value = ''
  thumbnailCard.value = ''
  textCard.value = ''
  tagsCard.value = []
  dialogCard.value = !dialogCard.value
}

const textRef = ref(null)
const copyTextDetail = () => {
  selectText(textRef.value)
}

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

// Watchers and lifecycle
watch(model, (val, prev) => {
  if (val.length === prev.length) return

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
  cardsStore.clear()
  cardsStore.getTagOfCards(route.query.t)
  cardsStore.getCardFromApi(route.query.t)
})
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
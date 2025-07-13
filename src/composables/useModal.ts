import { ref, computed } from 'vue'

export interface ModalConfig {
  title?: string
  width?: string | number
  height?: string | number
  closable?: boolean
  maskClosable?: boolean
  showIcon?: boolean
  type?: 'info' | 'success' | 'warning' | 'error'
}

export interface ModalReturn {
  visible: Ref<boolean>
  title: Ref<string>
  content: Ref<any>
  config: Ref<ModalConfig>
  open: (content?: any, options?: ModalConfig) => void
  close: () => void
  toggle: () => void
}

export function useModal(defaultConfig: ModalConfig = {}): ModalReturn {
  const visible = ref<boolean>(false)
  const title = ref<string>('')
  const content = ref<any>(null)
  const config = ref<ModalConfig>({
    width: '600px',
    closable: true,
    maskClosable: true,
    showIcon: false,
    ...defaultConfig
  })

  const open = (newContent?: any, options?: ModalConfig): void => {
    if (newContent !== undefined) {
      content.value = newContent
    }
    
    if (options) {
      config.value = { ...config.value, ...options }
      if (options.title) {
        title.value = options.title
      }
    }
    
    visible.value = true
  }

  const close = (): void => {
    visible.value = false
  }

  const toggle = (): void => {
    visible.value = !visible.value
  }

  return {
    visible,
    title,
    content,
    config,
    open,
    close,
    toggle
  }
}

// Specialized modal for image viewing
export function useImageModal() {
  const modal = useModal({
    width: '80vw',
    height: '80vh',
    maskClosable: true
  })

  const currentImage = ref<string>('')
  const imageList = ref<string[]>([])
  const currentIndex = ref<number>(0)

  const canGoPrevious = computed(() => currentIndex.value > 0)
  const canGoNext = computed(() => currentIndex.value < imageList.value.length - 1)

  const openImage = (src: string, images?: string[]): void => {
    currentImage.value = src
    
    if (images) {
      imageList.value = images
      currentIndex.value = images.indexOf(src)
    } else {
      imageList.value = [src]
      currentIndex.value = 0
    }
    
    modal.open(src, {
      title: `รูปภาพ ${currentIndex.value + 1} จาก ${imageList.value.length}`,
      width: '90vw',
      height: '90vh'
    })
  }

  const goToPrevious = (): void => {
    if (canGoPrevious.value) {
      currentIndex.value -= 1
      currentImage.value = imageList.value[currentIndex.value]
      modal.title.value = `รูปภาพ ${currentIndex.value + 1} จาก ${imageList.value.length}`
    }
  }

  const goToNext = (): void => {
    if (canGoNext.value) {
      currentIndex.value += 1
      currentImage.value = imageList.value[currentIndex.value]
      modal.title.value = `รูปภาพ ${currentIndex.value + 1} จาก ${imageList.value.length}`
    }
  }

  return {
    ...modal,
    currentImage,
    imageList,
    currentIndex,
    canGoPrevious,
    canGoNext,
    openImage,
    goToPrevious,
    goToNext
  }
}

// Specialized modal for card viewing with navigation
export function useCardModal() {
  const modal = useModal({
    width: '80vw',
    height: '80vh',
    maskClosable: true
  })

  const currentCard = ref<any>(null)
  const cardList = ref<any[]>([])
  const currentIndex = ref<number>(0)

  const canGoPrevious = computed(() => currentIndex.value > 0)
  const canGoNext = computed(() => currentIndex.value < cardList.value.length - 1)

  const openCard = (card: any, cards?: any[]): void => {
    currentCard.value = card
    
    if (cards) {
      cardList.value = cards
      currentIndex.value = cards.findIndex(c => c.cardId === card.cardId)
    } else {
      cardList.value = [card]
      currentIndex.value = 0
    }
    
    modal.open(card, {
      title: `การ์ด ${currentIndex.value + 1} จาก ${cardList.value.length}`,
      width: '90vw',
      height: '90vh'
    })
  }

  const goToPrevious = (): void => {
    if (canGoPrevious.value) {
      currentIndex.value -= 1
      currentCard.value = cardList.value[currentIndex.value]
      modal.title.value = `การ์ด ${currentIndex.value + 1} จาก ${cardList.value.length}`
    }
  }

  const goToNext = (): void => {
    if (canGoNext.value) {
      currentIndex.value += 1
      currentCard.value = cardList.value[currentIndex.value]
      modal.title.value = `การ์ด ${currentIndex.value + 1} จาก ${cardList.value.length}`
    }
  }

  const copyCardText = (): void => {
    if (currentCard.value?.text) {
      navigator.clipboard.writeText(currentCard.value.text)
        .then(() => {
          console.log('Card text copied to clipboard')
        })
        .catch(err => {
          console.error('Failed to copy card text:', err)
        })
    }
  }

  return {
    ...modal,
    currentCard,
    cardList,
    currentIndex,
    canGoPrevious,
    canGoNext,
    openCard,
    goToPrevious,
    goToNext,
    copyCardText
  }
}
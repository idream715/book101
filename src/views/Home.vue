<template>
  <div class="home" align="center" justify="center">
    <section id="hero">
      <v-parallax dark src="@/assets/blackground_search.jpg" height="800">
        <v-row align="center" justify="center">
          <v-col cols="10">
            <v-row align="center" justify="center">
              <v-col cols="12" md="5" lg="6" xl="7">
                <v-img alt="logo" contain max-height="100"
                src="@/assets/logo1.png" />
                <h1 class="hot-head">
                  {{ title }}
                </h1>
                <h1 class="hot-head mb-4">
                  (คุณครูไม่ใหญ่)
                </h1>
                <h1 class="font-weight-light">
                  <small>เป็นธรรมะที่ง่ายแต่ลึกซึ้งและทรงคุณค่า </small><br />
                  <small>เป็นสิ่งที่ท่านศึกษามาจากคำสอนของ<br />พระสัมมาสัมพุทธเจ้าและผลของธรรมปฏิบัติ</small>
                </h1>

                <!-- <div class="video d-flex align-center py-4">
                  <a @click.stop="dialog = true" class="playBut">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
                      x="0px"
                      y="0px"
                      width="60px"
                      height="60px"
                      viewBox="0 0 213.7 213.7"
                      enable-background="new 0 0 213.7 213.7"
                      xml:space="preserve"
                    >
                      <polygon
                        class="triangle"
                        id="XMLID_18_"
                        fill="none"
                        stroke-width="7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        points="73.5,62.5 148.5,105.8 73.5,149.1 "
                      />

                      <circle
                        class="circle"
                        id="XMLID_17_"
                        fill="none"
                        stroke-width="7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-miterlimit="10"
                        cx="106.8"
                        cy="106.8"
                        r="103.3"
                      />
                    </svg>
                  </a>
                  <p class="subheading ml-2 mb-0">เล่น Video</p>
                </div> -->

              </v-col>
              <v-col cols="12" md="7" lg="6" xl="5">
                <!-- <v-col class="d-flex flex-column align-sm-end align-md-center"> -->
                  <v-item-group color="transparent">
                    <v-row
                    >
                      <v-col
                        cols="12"
                        lg="6"
                        xl="4"
                        class="text-center py-4"
                        v-for="(feature, i) in menuLuangpor"
                        :key="i"
                      >
                        <v-item>
                          <v-hover v-slot:default="{ hover }">
                            <v-card
                              class="card"
                              shaped
                              :elevation="hover ? 10 : 4"
                              :class="{ up: hover }"
                              @click.stop="routingTo(feature.routeTo, feature.creator)"
                            >
                              <v-card-title>
                                  <v-icon
                                    left
                                    color="primary lighten-4"
                                    :class="{ 'zoom-efect': hover }"
                                  >
                                    {{ feature.logo }}
                                  </v-icon>
                                <span>
                                  {{ feature.title }}
                                </span>
                              </v-card-title>
                            </v-card>
                          </v-hover>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-item-group >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div class="svg-border-waves text-white">
          <v-img src="@/assets/borderWaves.svg" />
        </div>
      </v-parallax>
      <section id="yay">
        <v-container fluid id="features">
          <v-row class="align-center justify-center">
              <v-col
                  cols="10"
                >
                  <v-row align="center" justify="center">
                      <v-col cols="12" md="5" lg="6" xl="7">
                        <!-- <v-img alt="logo" contain max-height="100"
                        src="@/assets/khunyay.png" /> -->
                        <h1 class="font-title">
                          คำสอนคุณยายอาจารย์
                        </h1>
                        <h1 class="font-title mb-4">
                          มหารัตนอุบาสิกาจันทร์ ขนนกยูง
                        </h1>
                        <!-- <h1 class="font-weight-light">
                          <small>เป็นธรรมะที่ง่ายแต่ลึกซึ้งและทรงคุณค่า </small><br />
                          <small>เป็นสิ่งที่ท่านศึกษามาจากคำสอนของ<br />พระสัมมาสัมพุทธเจ้า และ ผลของธรรมปฏิบัติ</small>
                        </h1> -->

                        <!-- <div class="video d-flex align-center py-4">
                          <a @click.stop="dialog = true" class="playBut">
                            <svg
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
                              x="0px"
                              y="0px"
                              width="60px"
                              height="60px"
                              viewBox="0 0 213.7 213.7"
                              enable-background="new 0 0 213.7 213.7"
                              xml:space="preserve"
                            >
                              <polygon
                                class="triangle"
                                id="XMLID_18_"
                                fill="none"
                                stroke-width="7"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-miterlimit="10"
                                points="73.5,62.5 148.5,105.8 73.5,149.1 "
                              />

                              <circle
                                class="circle"
                                id="XMLID_17_"
                                fill="none"
                                stroke-width="7"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-miterlimit="10"
                                cx="106.8"
                                cy="106.8"
                                r="103.3"
                              />
                            </svg>
                          </a>
                          <p class="subheading ml-2 mb-0">เล่น Video</p>
                        </div> -->

                      </v-col>
                      <v-col cols="12" md="7" lg="6" xl="5">
                        <!-- <v-col class="d-flex flex-column align-sm-end align-md-center"> -->
                          <v-item-group color="transparent">
                            <v-row
                            >
                              <v-col
                                cols="12"
                                lg="6"
                                xl="4"
                                class="text-center py-4"
                                v-for="(feature, i) in menuYay"
                                :key="i"
                              >
                                <v-item>
                                  <v-hover v-slot:default="{ hover }">
                                    <v-card
                                      class="card"
                                      shaped
                                      color="white"
                                      :elevation="hover ? 10 : 4"
                                      :class="{ up: hover }"
                                      @click.stop="routingTo(feature.routeTo, feature.creator)"
                                    >
                                      <v-card-title>
                                          <v-icon
                                            left
                                            color="primary lighten-4"
                                            :class="{ 'zoom-efect': hover }"
                                          >
                                            {{ feature.logo }}
                                          </v-icon>
                                        <span>
                                          {{ feature.title }}
                                        </span>
                                      </v-card-title>
                                    </v-card>
                                  </v-hover>
                                </v-item>
                              </v-col>
                            </v-row>
                          </v-item-group >
                      </v-col>
                  </v-row>
              </v-col>
          </v-row>
        </v-container>
        <div class="svg-border-waves text-white">
          <v-img src="@/assets/borderWaves.svg" />
        </div>
        <!-- <div class="svg-border-waves text-white">
          <v-img src="~@/assets/borderWavesFill.svg"/>
        </div> -->
      </section>
      <section>
        <v-container fluid class="mt-8">
          <v-row align="center" justify="center">
            <v-col cols="10">
              <v-card color="transparent" flat class="mx-auto mb-5" max-width="1200">
                <v-card-text>
                    <h2 class="font-weight-black">คำนำจากใจคณะผู้จัดทำ</h2>
                    <br>
                    <p class="subtitle-1" >
                        คำสอนของหลวงพ่อธัมมชโย (คุณครูไม่ใหญ่) เป็นธรรมะที่ง่ายแต่ลึกซึ้งและทรงคุณค่า เป็นสิ่งที่ท่านศึกษามาจากคำสอนของพระสัมมาสัมพุทธเจ้าและจากผลของธรรมปฏิบัติ ท่านได้เมตตากลั่นกรองถ่ายทอดออกมาด้วยถ้อยคำที่เข้าใจได้ง่าย ชัดเจน แจ่มแจ้ง และเปี่ยมไปด้วยข้อคิดที่เกิดกำลังใจในการปฏิบัติตาม ทั้งยังช่วยตอกย้ำสัมมาทิฐิให้มั่นคงยิ่งขึ้น หากใครได้นำคำสอนเหล่านี้ไปใช้ในการดำเนินชีวิตก็จะเกิดประโยชน์อย่างยิ่งแก่ตนเองทั้งในโลกนี้และโลกหน้าอย่างแน่นอน
                    </p>
                    <p class="subtitle-1">
                      อาสาสมัครเพื่อเผยแพร่ธรรมะ จึงได้รวบรวมหนังสือทุกเล่มและโอวาทของท่านในวาระต่างๆ มาเรียบเรียงแล้วจัดทำในรูปแบบของเว็บไซต์ เพื่อสะดวกและง่ายต่อการค้นหาธรรมะในหัวข้อที่ต้องการ ทั้งนี้ในส่วนของหนังสือยังคงรูปแบบของหน้าหนังสือไว้ และยังสามารถดาวโหลดไฟล์หนังสือเก็บไว้อ่านได้อีกด้วย
                    </p>
                    <p class="subtitle-1">
                        หวังเป็นอย่างยิ่งว่า เว็บไซต์นี้จะตอบโจทย์ในการค้นหาโอวาทหลวงพ่อธัมมชโย เพื่อนำไปใช้งานสำหรับท่านที่สนใจ
                    </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>
      <section>
        <v-footer padless class="text-center mt-5">
          <!-- <v-card-text>
              <p class="mt-5 subtitle-1" style="line-hight:unset;">หนังสือและเนื้อหาต่างๆ โดย กองวิชาการ 01</p>
              <p class="subtitle-1">จัดทำเป็น Web โดย ทีมงาน RGT</p>
              <p>TEAM DESIGN</p>
              <p>DREAM-iTOUCH-KRIT-PUT-TUALEK</p>
          </v-card-text> -->

          <v-col
          class="text-center caption"
          cols="12"
          > &copy;
          <!-- 2563 — <strong>Designed by  RGT-101BOOK & DCI-TECHNO 2563</strong> -->
          2563 — ผู้เรียบเรียงและเผยแพร่ในระบบคอมพิวเตอร์ : 'sinthu
          </v-col>
        </v-footer>
      </section>
      <v-dialog v-model="dialog" max-width="640px">
        <v-card>
          <youtube
            :video-id="videoId"
            @ready="ready"
            @playing="playing"
          ></youtube>
        </v-card>
      </v-dialog>
      <div class="svg-border-waves">
        <img src="~@/assets/wave2.svg" />
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialog: false,
        videoId: "t_k7jk-e_Mk",
        icons: [
          'fab fa-facebook',
          'fab fa-twitter',
          'fab fa-google-plus',
          'fab fa-linkedin',
          'fab fa-instagram',
        ],
        features: [
          {
            logo: 'mdi-book-open-page-variant',
            title: "หนังสือธรรมะ",
            text: "หนังสือที่เก็บรวบรวมคำสอนของหลวงพ่อ",
            creator: 1,
            routeTo: 'books'
          },
          {
            logo: 'mdi-image-multiple',
            title: "การ์ดธรรมะ",
            text: "ธรรมะ รูปแบบข้อความสั้น ๆ ที่อยู่ในรูปภาพที่สวยงาม",
            creator: 1,
            routeTo: 'cards'
          },
          {
            logo: 'mdi-magnify',
            title: "หน้าสืบค้น",
            text: "ระบบสืบค้นธรรมะของหลวงพ่อ",
            creator: 1,
            routeTo: 'search-page'
          },
          {
            logo: 'mdi-book-open-page-variant',
            title: "หนังสือธรรมะ",
            text: "หนังสือที่เก็บรวบรวมคำสอนของหลวงพ่อ",
            creator: 2,
            routeTo: 'books'
          },
          {
            logo: 'mdi-image-multiple',
            title: "การ์ดธรรมะ",
            text: "ธรรมะ รูปแบบข้อความสั้น ๆ ที่อยู่ในรูปภาพที่สวยงาม",
            creator: 2,
            routeTo: 'cards'
          },
          {
            logo: 'mdi-magnify',
            title: "หน้าสืบค้น",
            text: "ระบบสืบค้นธรรมะของหลวงพ่อ",
            creator: 2,
            routeTo: 'search-page'
          },
        ],
      };
    },
    computed: {
      title () {
        return 'คำสอนหลวงพ่อธัมมชโย'
      },
      titleYay () {
        return (!this.checkingMobile) ? 'คำสอนคุณยายอาจารย์ มหารัตนอุบาสิกาจันทร์ ขนนกยูง' : 'คำสอนคุณยายอาจารย์'
      },
      menuLuangpor () {
        return this.features.filter(x => x.creator === 1)
      },
      menuYay () {
        return this.features.filter(x => x.creator === 2)
      },
      checkingMobile () {
        return this.$vuetify.breakpoint.mdAndDown
      },
      totitle () {
        return (!this.checkWidth) ? 'hot-head' : 'hothead-fixed'
      },
      checkWidth () {
        return this.$vuetify.breakpoint.width < 576
      }
    },
    created(){
      this.$store.dispatch('clear')
    },
    watch: {
      dialog(value) {
        if (!value) {
          this.pause();
        }
      },
    },
    methods: {
      routingTo (path, creator) {
        return this.$router.push({ path: path, query: { t: creator } })
      },
      ready(event) {
        this.player = event.target;
      },
      playing() {
        // The player is playing a video.
      },
      change() {
        // when you change the value, the player will also change.
        // If you would like to change `playerVars`, please change it before you change `videoId`.
        // If `playerVars.autoplay` is 1, `loadVideoById` will be called.
        // If `playerVars.autoplay` is 0, `cueVideoById` will be called.
        this.videoId = "another video id";
      },
      stop() {
        this.player.stopVideo();
      },
      pause() {
        this.player.pauseVideo();
      },
    },
  };
  </script>


<style lang="scss">
  #yay {
    background-image:
    linear-gradient(to bottom, rgb(255, 255, 255), rgba(251, 251, 251, 0.324)),
    url("~@/assets/bg.jpeg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 720px;
  }

  #yay .container,
  #yay .row {
    height: 100%;
  }
  .circle {
    stroke: white;
    stroke-dasharray: 650;
    stroke-dashoffset: 650;
    -webkit-transition: all 0.5s ease-in-out;
    opacity: 0.3;
  }
  .playBut {
    /*  border: 1px solid red;*/
    display: inline-block;
    -webkit-transition: all 0.5s ease;
    .triangle {
      -webkit-transition: all 0.7s ease-in-out;
      stroke-dasharray: 240;
      stroke-dashoffset: 480;
      stroke: white;
      transform: translateY(0);
    }
    &:hover {
      .triangle {
        stroke-dashoffset: 0;
        opacity: 1;
        stroke: white;
        animation: nudge 0.7s ease-in-out;
        @keyframes nudge {
          0% {
            transform: translateX(0);
          }
          30% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          70% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0);
          }
        }
      }
      .circle {
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }
  }
  </style>

  <style>
  @import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

  .home{
    font-family: 'Sarabun', sans-serif;
  }

  .hot-head{
    font-size: 2rem !important;
    text-shadow:2px 2px 8px #444444;
  }

  .hothead-fixed {
    font-size: 1.7rem !important;
    text-shadow:2px 2px 8px #444444;
  }

  .font-title {
    font-size: 1.7rem !important;
    color: #575656;
    text-shadow:2px 2px 8px #ffffff;
  }

  @media screen and (max-width: 420px) {
    .font-title {
      font-size: 1.2rem !important;
    }
    .hot-head{
      font-size: 1.7rem !important;
    }

  }

  .btn-play {
    transition: 0.2s;
  }
  .svg-border-waves .v-image {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3rem;
    width: 100%;
    overflow: hidden;
  }
  #hero {
    z-index: 0;
  }
  .svg-border-waves img {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    margin-bottom: -2px;
    z-index: -1;
  }
  .card {
    max-height: 80px;
    min-width: 210px;
    padding: 10px;
    transition: 0.5s ease-out;
  }
  .card .v-image {
    margin-bottom: 15px;
    transition: 0.75s;
  }
  .card h1 {
    margin-bottom: 10px;
  }
  .zoom-efect {
    transform: scale(1.1);
  }
  .up {
    transform: translateY(-20px);
    transition: 0.5s ease-out;
  }
  </style>

  <style>
  section {
    position: relative;
  }
  </style>


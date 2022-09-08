<template>
  <div class="home" align="center" justify="center">
    <section id="hero">
      <v-parallax dark src="@/assets/blackground_search.jpg" height="750">
        <v-row align="center" justify="center">
          <v-col cols="10">
            <v-row align="center" justify="center">
              <v-col cols="12" md="6" xl="8">
                <h1 class="hot-head mb-4">DHAMMA01.com</h1>
                <h1 class="font-weight-light">
                  <small>คำสอนของหลวงพ่อธัมมชโย (คุณครูไม่ใหญ่)</small><br />
                  <small>เป็นธรรมะที่ง่ายแต่ลึกซึ้งและทรงคุณค่ามาก </small><br />
                  <small>เป็นสิ่งที่ท่านศึกษามาจากคำสอนของ<br />พระสัมมาสัมพุทธเจ้า และ ผลของธรรมปฏิบัติ</small>
                </h1>

                <v-btn
                  rounded
                  outlined
                  large
                  dark
                  @click="$vuetify.goTo('#features')"
                  class="mt-5"
                >
                  กดเพื่อดูเนื้อหา
                  <v-icon class="ml-2">mdi-arrow-down</v-icon>
                </v-btn>

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
              <v-col cols="12" md="6" xl="4" class="hidden-sm-and-down">
                <!-- <v-col class="d-flex flex-column align-sm-end align-md-center"> -->
                <v-img class="mt-12" alt="logo" contain max-height="360"
                  src="@/assets/logo1.png" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div class="svg-border-waves text-white">
          <v-img src="@/assets/img/borderWaves.svg" />
        </div>
      </v-parallax>
      <v-container v-show="true" fluid id="features" class="mt-2">
        <v-row align="center" justify="center">
          <v-col cols="10">
            <v-row align="center" justify="space-around">
              <v-col cols="12" class="text-center">
                <div class="display-1 font-weight-light display-2">เนื้อหาของเว็บไซต์</div>
                <div class="subtitle-1 font-weight-light">
                  ทางเว็บไซต์ได้จัดแยกข้อมูลออกเป็นหมวดหมู่ด้านล่าง ให้ผู้ที่สนใจสามารถเลือกสิ่งที่ตนเองต้องการได้
                </div>
              </v-col>
              <v-col
                cols="12"
                sm="4"
                class="text-center"
                v-for="(feature, i) in features"
                :key="i"
              >
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    class="card"
                    shaped
                    :elevation="hover ? 10 : 4"
                    :class="{ up: hover }"
                  >
                    <v-btn
                      fab
                      x-large
                      dark
                      color="primary lighten-4"
                      class="d-block ml-auto mr-auto"
                      :class="{ 'zoom-efect': hover }"
                      @click="routingTo(feature.routeTo)"
                    >
                      <v-icon>
                        {{ feature.logo }}
                      </v-icon>
                    </v-btn>
                    <br/>
                    <v-card-text>
                      <h1 class="font-weight-regular">{{ feature.title }}</h1>
                      <h4 class="font-weight-regular subtitle-1">
                        {{ feature.text }}
                      </h4>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
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
        <img src="~@/assets/img/wave2.svg" />
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
        features: [
          {
            logo: 'mdi-book',
            title: "หนังสือธรรมะ",
            text: "หนังสือที่เก็บรวบรวมคำสอนของหลวงพ่อ",
            routeTo: '/books'
          },
          // {
          //   logo: 'mdi-card',
          //   title: "การ์ดธรรมะ",
          //   text: "ธรรมะ รูปแบบข้อความสั้น ๆ ที่อยู่ในรูปภาพที่สวยงาม",
          //   routeTo: '/'
          // },
          // {
          //   logo: 'mdi-comment-quote-outline',
          //   title: "โอวาทหลวงพ่อ",
          //   text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          //   routeTo: '/'
          // },
          // {
          //   logo: 'mdi-microphone-message',
          //   title: "ถอดความนำนั่งสมาธิ",
          //   text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          //   routeTo: '/'
          // },
          {
            logo: 'mdi-magnify',
            title: "หน้าสืบค้น",
            text: "ระบบสืบค้นธรรมะของหลวงพ่อ",
            routeTo: '/search-page'
          },
          {
            logo: 'mdi-account-circle',
            title: "เกี่ยวกับเรา",
            text: "รายละเอียดเกี่ยวกับที่มาของการจัดทำเว็บไซต์",
            routeTo: '/about'
          },
        ],
      };
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
      routingTo (path) {
        return this.$router.push(path)
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
  @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@1,200&display=swap');
  .home{
    font-family: 'Sarabun', sans-serif;
  }

  .hot-head{
    font-family: 'Kanit', sans-serif !important;
    font-size: 3.5rem !important;
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
    min-height: 300px;
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


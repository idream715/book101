<template>
  <div>
    <v-container>
      <!-- <h1>this is sarabun modal</h1> -->
      <v-row justify="center">
        <v-dialog 
          v-model="dialog" 
          max-width="100%" 
          style="margin:0;"
          >
          <v-card>
            <v-row class="headline" justify="center">{{bookSelected.book_name}}</v-row>
            <v-row justify="center"><img :src="bookSelected.book_link_jpg" alt=""></v-row>               
            <v-row class="btn" justify="center">
              <v-btn color="primary" :href="bookSelected.book_link_pdf">ดาวน์โหลดPDF</v-btn>
              <!-- <v-btn margin-left="10px" color="primary"><v-icon>mdi-share-variant</v-icon></v-btn> -->
            </v-row>
            
            <v-card-text>
              <v-simple-table>
                  <thead>
                    <tr>
                      <th>ที่</th>
                      <th>ชื่อสารบัญ</th>
                      <th>pdf</th>
                      <th>text</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,i) in sarabunSelected" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>{{ item.search_index }}</td>
                      <td><a :href="item.link_pdf"><v-icon>mdi-file-pdf</v-icon></a></td>
                      <td><a :href="item.search_details"><v-icon>mdi-format-text</v-icon></a></td>
                    </tr>
                  </tbody>
              </v-simple-table>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="$emit('emitFalse',false)">กลับ</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'Sarabun',
    props: {
      dialog: {
        type:Boolean,
        default:false
      },
      bookName: String,
      linkPdfBook: String
    },
    data(){
      return {
       
      }
    },
    methods: {
      closeDialog(){
        // return $emit('emitFalse',false)
      },
    },
    computed: {
      bookSelected(){
        return this.$store.getters.getBookSelected
      },
      sarabunSelected(){
        return this.$store.getters.getSarabun
      }
    },
  }
</script>

<style scoped>
  .v-simple-table thead tr th {
    /* font-size: "subtitle-1"; */
    font-weight: bold;
  }

  img {
    max-width: 20%;
  }
 
  /* .headline {
    text-align: center;
  } */

  tr a {
    text-decoration: none;
  }

  .btn {
    padding-top: 15px;
    padding-bottom: 20px;
  }
</style>
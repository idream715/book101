<template>
  <div>
    <v-container>
      <!-- <h1>this is sarabun modal</h1> -->
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="100%" style="margin:0;">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
          </template>

          <v-card>
            <v-row class="headline" justify="center">คำสอนพ่อ</v-row>
            <v-row justify="center"><img src="../assets/ภาพ/ของขวัญ.jpg" alt=""></v-row>               
            <v-row class="btn" justify="center">
              <v-btn color="primary">ดาวน์โหลดPDF</v-btn>
              <v-btn margin-left="10px" color="primary"><v-icon>mdi-share-variant</v-icon></v-btn>
            </v-row>
            
            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>ที่</th>
                      <th>ชื่อสารบัญ</th>
                      <th>pdf</th>
                      <th>text</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in desserts" :key="item.name">
                      <td>{{ item.calories }}</td>
                      <td>{{ item.name }}</td>
                      <td><a href=""><v-icon>mdi-file-pdf</v-icon></a></td>
                      <td><a href=""><v-icon>mdi-format-text</v-icon></a></td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">กลับ</v-btn>
            </v-card-actions>
          </v-card>

          <br>

          <!-- <v-card>
            <v-card-title>
              <img src="../assets/ภาพ/ของขวัญ.jpg" alt="">
              <span class="headline">คำสอนพ่อ<v-btn color="primary">PDF</v-btn></span>
            </v-card-title>

            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr class="">
                      <th>ที่</th>
                      <th>ชื่อสารบัญ</th>
                      <th>pdf</th>
                      <th>text</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in desserts" :key="item.name">
                      <td>{{ item.calories }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.calories }}</td>
                      <td>{{ item.calories }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">กลับ</v-btn>
            </v-card-actions>
          </v-card> -->

        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'Sarabun',

    data(){
      return {
        dialog: false,
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
          },
          {
            name: 'Eclair',
            calories: 262,
          },
          {
            name: 'Cupcake',
            calories: 305,
          },
          {
            name: 'Gingerbread',
            calories: 356,
          },
          {
            name: 'Jelly bean',
            calories: 375,
          },
          {
            name: 'Lollipop',
            calories: 392,
          },
          {
            name: 'Honeycomb',
            calories: 408,
          },
          {
            name: 'Donut',
            calories: 452,
          },
          {
            name: 'KitKat',
            calories: 518,
          },
        ],
      }
    }
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
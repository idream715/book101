<template>
    <div class="home" align="center" justify="center">
      <v-row class="row" align="center" justify="center">
        <div>

          <div class="search">
            <v-combobox
              v-model="model"
              :items="items"
              :search-input.sync="search"
              hide-selected
              hint="Maximum of 5 tags"
              label="Add some tags"
              multiple
              persistent-hint
              small-chips
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>

            <v-btn  icon @click="clicksearch">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </div>
          
      
        </div>
      </v-row>
    </div>
</template>

<script>
export default {
  data () {
      return {
         items: ['บุญ', 'วิชชา', 'Vue', 'Vuetify'],
         search: null,
      }
    },

  created(){
      this.$store.dispatch('clear')
  },
  computed:{
    indexs(){
      return this.$store.getters.getIndexs
    }
  },
  methods:{
    clicksearch(){
      this.$store.dispatch('setFirstIndexsFromApi',this.model)
      this.$router.push('/Indexs')
    }
  },
   watch: {
    model (val) {
      if (val.length > 5) {
        this.$nextTick(() => this.model.pop())
      }
    },
  },  
}
</script>

<style scoped>
/* @media (min-width: 320px) {
  h5.heading {
    font-size: 0.8em;
  }
} */
.home{
  background-image: url(../assets/blackground_search.jpg);
  height: 100%;
  
}
.row{
 height: 100%;
 padding: 10;
}
.search{
  width: 1000px;
  /* background-color: azure; */
  padding: 5px;
  padding-bottom: 0;
  scale: 50px;
  height: 40px;

}

</style>


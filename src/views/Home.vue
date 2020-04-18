<template>
    <div class="home" align="center" justify="center">
      <v-row class="row" align="center" justify="center">
        <div>

          <div class="search">
          <v-text-field
            label="Search เนื้อหาธรรม"
            outlined
            dense
            rounded
            class="search"
            v-model="searchs"
            height="15"
          ></v-text-field>
          <v-btn icon @click="search(searchs)">
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
        searchs:"",
      }
    },

  created(){
    if(!(this.indexs.length===0)){
      let non = "non"
      this.$store.dispatch('getFirstIndexsFromApi',non)
    }
  },


  computed:{
    indexs(){
      return this.$store.getters.getIndexs
    }
  },
  methods:{
    search(input){
      let words = input.split(" ")
      let words_search = []
      words.forEach(element => {
        let tag = `{"search_index":{"$regex":"${element}"}}`
        words_search.push(tag)
      });
      this.$store.dispatch('getFirstIndexsFromApi',words_search)
      this.$router.push('/Indexs')

    }
  }
 
  
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
  background-color: azure;
  padding: 5px;
  padding-bottom: 0;
  scale: 50px;
  height: 40px;

}

</style>


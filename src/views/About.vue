
<template>
    <div>
        <v-content>
            <v-container fluid>
                <v-row class="flex justify-center">
                    <v-col 
                        cols="6"
                        md="3"
                     >
                        <v-card class="mb-5"  >
                            <v-img   
                            src="@/assets/logo2.png"
                            >
                            </v-img>
                        </v-card>        
                    </v-col>
                    <col>
                </v-row>
                 <v-card  min-wight="150">
                    <v-card-text>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, perferendis molestiae quis nobis facilis et reprehenderit tenetur unde voluptatum, aperiam soluta delectus harum porro quo sapiente beatae temporibus necessitatibus tempora. Ad consectetur autem aperiam ducimus. Animi eveniet alias magni asperiores? Dicta quisquam illum cupiditate repellat eius veniam architecto. Porro perferendis animi, repellat, possimus mollitia cum dolorem magni maiores impedit quas voluptatum blanditiis ducimus debitis recusandae placeat voluptas quidem provident repellendus quibusdam totam, culpa asperiores. Aut modi, ab ex repudiandae suscipit veniam, blanditiis quisquam, iure quam enim aperiam deserunt ratione! Commodi quaerat quasi asperiores earum quam cupiditate ipsam incidunt atque natus iure, placeat, unde tenetur error veritatis expedita sed sint quos nulla doloremque excepturi? Repudiandae optio explicabo culpa placeat consequuntur nobis corrupti illum dolor iusto aliquam, illo atque, vel, et quibusdam? Explicabo sit porro ab. Deleniti recusandae delectus autem, quis ipsum obcaecati est aspernatur eveniet ullam animi aliquid fugit dolore soluta, itaque modi nisi iure rerum. Ipsam quae saepe deleniti aspernatur corporis aperiam quisquam amet odio quidem et magnam iure libero, minus sunt ea dolorem eius porro earum numquam minima praesentium asperiores explicabo atque. Ducimus accusantium ea voluptas mollitia odit, possimus necessitatibus debitis dolor voluptate illum deleniti natus omnis ipsum eligendi.
                    </v-card-text>
                 </v-card>            
            </v-container>
        </v-content>
        <v-footer class="flex justify-center" padless>
            <v-card
                flat
                tile
                class="  white--text text-center"
            >
            <v-card-text>
                <v-btn
                v-for="icon in icons"
                :key="icon"
                class="mx-4 "
                icon
                >
                    <v-icon size="24px">{{ icon }}</v-icon>
                </v-btn>
            </v-card-text>
            <v-card-text class=" pt-0">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, delectus, eum beatae repudiandae omnis officiis, nam cumque harum ducimus obcaecati aspernatur quibusdam tempore eveniet atque? Ipsam architecto deleniti iusto magni doloremque dignissimos! Tenetur velit voluptatum commodi vitae recusandae ab ratione. Aliquid corrupti laboriosam nam obcaecati ullam sit modi corporis dolorem.
            </v-card-text>

                <v-divider></v-divider>

            <v-card-text > &copy;
                {{ new Date().getFullYear() }} — <strong>Create by  RGT-101BOOK</strong>
            </v-card-text>
            </v-card>
        </v-footer>
    </div>
</template>

<script>
  export default {
    data: () => ({
      icons: [
        'fab fa-facebook',
        'fab fa-twitter',
        'fab fa-google-plus',
        'fab fa-linkedin',
        'fab fa-instagram',
      ],
    }),
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');
.about {
    font-family: 'Sarabun', sans-serif;
}
</style>

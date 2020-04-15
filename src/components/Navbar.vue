<template>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        router-link to="/"
        text
      >
        <span class="mr-2">Home</span>
      </v-btn>
      <v-btn
        router-link to="/indexs"
        text
      >
        <span class="mr-2">indexs</span>
      </v-btn>
      <v-btn
        router-link to="/Books"
        text
      >
        <span class="mr-2">Books</span>
      </v-btn>
    </v-app-bar>
</template>

<script>

export default {
  name: 'Navbar',
  data: () => ({
    //
  }),
};
</script>

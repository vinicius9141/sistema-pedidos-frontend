<template>
  <v-app :theme="darkMode ? 'dark' : 'light'">
    <v-app-bar :color="darkMode ? 'grey-darken-4' : 'primary'" app>
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Meu App</v-toolbar-title>
      <v-spacer></v-spacer>

      

      <!-- menu desktop -->
      <v-toolbar-items class="d-none d-md-flex white--text">
        <v-btn v-for="item in menuItems" :key="item.text" text>
          <router-link :to="item.route" class="white--text">{{ item.text }}</router-link>
        </v-btn>
      </v-toolbar-items>
      <!-- dark mode -->
      <v-switch
        v-model="darkMode"
        inset
        hide-details
        class="mr-4"
        color="white"
        :label="darkMode ? '🌙' : '☀️'"
        @change="toggleDarkMode"
      ></v-switch>
    </v-app-bar>

    <!-- menbu mobile -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="item in menuItems" :key="item.text" @click="drawer = false">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <router-link :to="item.route">{{ item.text }}</router-link>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify';


const theme = useTheme();
const darkMode = ref(localStorage.getItem('darkMode') === 'true');


const toggleDarkMode = () => {
  localStorage.setItem('darkMode', darkMode.value);
  theme.global.name.value = darkMode.value ? 'dark' : 'light';
};


watch(darkMode, toggleDarkMode, { immediate: true });

const drawer = ref(false);

const menuItems = ref([
  { text: 'Home', route: '/', icon: 'mdi-home' },
  { text: 'Produtos', route: '/produtos', icon: 'mdi-package-variant' },
  { text: 'Clientes', route: '/clientes', icon: 'mdi-account-group' },
  { text: 'Pedidos', route: '/pedidos', icon: 'mdi-cart' },
  { text: 'Rota Teste', route: '/teste', icon: 'mdi-test-tube' }
]);
</script>

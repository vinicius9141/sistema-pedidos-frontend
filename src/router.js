import { createRouter, createWebHistory } from 'vue-router';
import Produtos from './views/ProdutosView.vue';
import Clientes from './views/ClientesView.vue';
import Pedidos from './views/PedidosView.vue';
import RotaTeste from './views/RotaTeste.vue';
import HomeView from './views/HomeView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/produtos', component: Produtos },
  { path: '/clientes', component: Clientes },
  { path: '/pedidos', component: Pedidos },
  {path: '/teste' , component: RotaTeste },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
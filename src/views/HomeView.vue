<template>
  <v-container fluid>
    <!-- Cabeçalho -->
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-5 text-center">
          <v-card-title class="text-h4">Sistema de Pedidos</v-card-title>
          <v-card-subtitle>Gerencie seus pedidos, clientes e produtos</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cards Resumo -->
    <v-row class="mt-5" justify="center">
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-5" color="primary" dark>
          <v-card-title class="text-h6">Total de Pedidos</v-card-title>
          <v-card-subtitle class="text-h5">{{ totalPedidos }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="white" variant="outlined" block @click="$router.push('/pedidos')">
              Ver Pedidos
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-5" color="green" dark>
          <v-card-title class="text-h6">Total de Clientes</v-card-title>
          <v-card-subtitle class="text-h5">{{ totalClientes }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="white" variant="outlined" block @click="$router.push('/clientes')">
              Ver Clientes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-5" color="orange" dark>
          <v-card-title class="text-h6">Total de Produtos</v-card-title>
          <v-card-subtitle class="text-h5">{{ totalProdutos }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="white" variant="outlined" block @click="$router.push('/produtos')">
              Ver Produtos
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const totalPedidos = ref(0);
const totalClientes = ref(0);
const totalProdutos = ref(0);

const carregarTotais = async () => {
  try {
    const pedidos = await api.get('/pedidos');
    const clientes = await api.get('/clientes');
    const produtos = await api.get('/produtos');

    totalPedidos.value = pedidos.data.length;
    totalClientes.value = clientes.data.length;
    totalProdutos.value = produtos.data.length;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
};

onMounted(() => {
  carregarTotais();
});
</script>

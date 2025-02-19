<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="800px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Itens do Pedido</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-data-table
            :headers="headers"
            :items="itens"
          >
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>Itens</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="novoItem">Novo Item</v-btn>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="close">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import api from '../services/api';
//eslint-disable-next-line
const props = defineProps({
  modelValue: Boolean,
  pedidoId: Number,
});
//eslint-disable-next-line
const emit = defineEmits(['update:modelValue', 'close']);

const itens = ref([]);
const produtos = ref([]);
const editedItem = ref({
  id_pedido_item: null,
  id_pedido: null,
  id_produto: null,
  qtde: 0,
  preco: 0,
});

const headers = ref([
  { title: 'ID', key: 'id_pedido_item' },
  { title: 'Produto', key: 'id_produto' },
  { title: 'Quantidade', key: 'qtde' },
  { title: 'Preço', key: 'preco' },
]);

const carregarItens = async () => {
  try {
    const response = await api.get(`/pedidos/${props.pedidoId}/itens`);
    itens.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar itens:', error);
  }
};

const carregarProdutos = async () => {
  try {
    const response = await api.get('/produtos');
    produtos.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
};

const novoItem = () => {
  editedItem.value = { id_pedido_item: null, id_pedido: props.pedidoId, id_produto: null, qtde: 0, preco: 0 };
  // Abrir modal de edição de item
};

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    carregarItens();
    carregarProdutos();
  }
});
</script>
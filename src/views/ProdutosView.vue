<template>
  <v-container>
    <!-- Filtros -->
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="4">
        <v-select
          v-model="filtroNome"
          :items="produtos.map(p => p.nome)"
          label="Filtrar por Nome"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Buscar Produto"
          clearable
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Tabela de Produtos -->
    <v-data-table :headers="headers" :items="produtosFiltrados">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Produtos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="novoProduto">Novo Produto</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="primary" size="small" @click="editarProduto(item)">Editar</v-btn>
      </template>
    </v-data-table>

    <!-- Modal de Cadastro/Edição -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
            <v-text-field v-model="editedItem.preco" label="Preço" type="number"></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="close">Cancelar</v-btn>
          <v-btn color="primary" @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const dialog = ref(false);
const produtos = ref([]);
const filtroNome = ref(null); // Filtro por nome no dropdown
const searchQuery = ref(''); // Filtro da barra de pesquisa
const editedItem = ref({
  id_produto: null,
  nome: '',
  preco: 0,
});

const headers = ref([
  { title: 'ID', key: 'id_produto' },
  { title: 'Nome', key: 'nome' },
  { title: 'Preço', key: 'preco' },
  { title: 'Ações', key: 'actions', sortable: false },
]);

const produtosFiltrados = computed(() => {
  return produtos.value.filter((p) => {
    const matchNome = !filtroNome.value || p.nome === filtroNome.value;
    const matchSearch =
      !searchQuery.value || p.nome.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchNome && matchSearch;
  });
});

const formTitle = computed(() =>
  editedItem.value.id_produto ? 'Editar Produto' : 'Novo Produto'
);

const carregarProdutos = async () => {
  try {
    const response = await api.get('/produtos');
    produtos.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
};

const novoProduto = () => {
  editedItem.value = { id_produto: null, nome: '', preco: 0 };
  dialog.value = true;
};

const editarProduto = (item) => {
  editedItem.value = { ...item };
  dialog.value = true;
};

const save = async () => {
  try {
    if (editedItem.value.id_produto) {
      await api.put(`/produtos/${editedItem.value.id_produto}`, editedItem.value);
    } else {
      await api.post('/produtos', editedItem.value);
    }
    close();
    await carregarProdutos();
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
  }
};

const close = () => {
  dialog.value = false;
  editedItem.value = { id_produto: null, nome: '', preco: 0 };
};

onMounted(() => {
  carregarProdutos();
});
</script>

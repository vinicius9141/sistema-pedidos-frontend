<template>
  <v-container>
    <v-data-table :headers="headers" :items="clientes">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Clientes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="novoCliente">Novo Cliente</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.acao`]="{ item }">
        <v-btn color="primary" size="small" @click="editarCliente(item)">
          Editar
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
            <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
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
const clientes = ref([]);
const editedItem = ref({
  id_cliente: null,
  nome: '',
  email: '',
});

const headers = ref([
  { title: 'ID', key: 'id_cliente' },
  { title: 'Nome', key: 'nome' },
  { title: 'Email', key: 'email' },
  { title: 'Ações', key: 'acao', sortable: false },
]);

const formTitle = computed(() =>
  editedItem.value.id_cliente ? 'Editar Cliente' : 'Novo Cliente'
);

const carregarClientes = async () => {
  try {
    const response = await api.get('/clientes');
    clientes.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
  }
};

const novoCliente = () => {
  editedItem.value = { id_cliente: null, nome: '', email: '' };
  dialog.value = true;
};

const editarCliente = (item) => {
  editedItem.value = { ...item };
  dialog.value = true;
};

const save = async () => {
  try {
    if (editedItem.value.id_cliente) {
      await api.put(`/clientes/${editedItem.value.id_cliente}`, editedItem.value);
    } else {
      await api.post('/clientes', editedItem.value);
    }
    close();
    await carregarClientes();
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
  }
};

const close = () => {
  dialog.value = false;
  editedItem.value = { id_cliente: null, nome: '', email: '' };
};

onMounted(() => {
  carregarClientes();
});
</script>

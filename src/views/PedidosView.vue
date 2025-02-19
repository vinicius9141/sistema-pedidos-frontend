<template>
  <v-container>
    <!-- Filtros -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Buscar Pedido por Cliente"
          clearable
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedProductFilter"
          :items="produtos"
          item-title="nome"
          item-value="id_produto"
          label="Filtrar por Produto"
          clearable
          prepend-inner-icon="mdi-filter"
        ></v-select>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="pedidosFiltrados"
      @click:row="editarPedido"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Pedidos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="novoPedido">Novo Pedido</v-btn>
        </v-toolbar>
      </template>


      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="primary" @click.stop="editarPedido(item)">Editar</v-btn>
      </template>
    </v-data-table>


    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-select
              v-model="editedItem.id_cliente"
              :items="clientes"
              item-title="nome"
              item-value="id_cliente"
              label="Cliente"
              variant="outlined"
            ></v-select>


            <v-autocomplete
              v-model="selectedProducts"
              :items="produtos"
              item-title="nome"
              item-value="id_produto"
              label="Adicionar Produtos"
              multiple
              variant="outlined"
              return-object
            ></v-autocomplete>

            <v-list v-if="editedItem.itens.length">
              <v-list-item v-for="(item, index) in editedItem.itens" :key="item.id_produto">
                <v-row align="center">
                  <v-col cols="5">
                    {{ item.nome }}
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model.number="item.qtde"
                      type="number"
                      min="1"
                      label="Qtde"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    R$ {{ (item.qtde * item.preco).toFixed(2) }}
                  </v-col>
                  <v-col cols="1">
                    <v-btn icon color="error" @click="removerItem(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="close">Cancelar</v-btn>
          <v-btn color="primary" @click="save">Salvar Pedido</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import api from '../services/api';


const dialog = ref(false);
const pedidos = ref([]);
const clientes = ref([]);
const produtos = ref([]);
const selectedProducts = ref([]);
const searchQuery = ref('');
const selectedProductFilter = ref(null); 

const editedItem = ref({
  id_pedido: null,
  id_cliente: null,
  itens: [],
});

const headers = ref([
  { title: 'ID', key: 'id_pedido' },
  { title: 'Data', key: 'data' },
  { title: 'Cliente', key: 'cliente_nome' },
  { title: 'Ações', key: 'actions', sortable: false },
]);

const pedidosFiltrados = computed(() => {
  return pedidos.value.filter((p) => {
    const filtroCliente = !searchQuery.value || p.cliente_nome?.toLowerCase().includes(searchQuery.value.toLowerCase());

    const filtroProduto = !selectedProductFilter.value || (p.itens && Array.isArray(p.itens) && p.itens.some(item => item.id_produto === selectedProductFilter.value));

    return filtroCliente && filtroProduto;
  });
});

const formTitle = computed(() =>
  editedItem.value.id_pedido ? 'Editar Pedido' : 'Novo Pedido'
);

const carregarPedidos = async () => {
  try {
    const response = await api.get('/pedidos');
    pedidos.value = response.data.map(pedido => {
      const cliente = clientes.value.find(c => c.id_cliente === pedido.id_cliente);
      return { ...pedido, cliente_nome: cliente ? cliente.nome : 'Desconhecido' };
    });
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
  }
};

const carregarClientes = async () => {
  try {
    const response = await api.get('/clientes');
    clientes.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
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

const novoPedido = () => {
  editedItem.value = { id_pedido: null, id_cliente: null, itens: [] };
  selectedProducts.value = [];
  dialog.value = true;
};

const editarPedido = async (item) => {
  try {
    const response = await api.get(`/pedidos/${item.id_pedido}/itens`);
    editedItem.value = { ...item, itens: response.data };
    selectedProducts.value = response.data;
    dialog.value = true;
  } catch (error) {
    console.error('Erro ao carregar itens do pedido:', error);
  }
};

const removerItem = (index) => {
  editedItem.value.itens.splice(index, 1);
};

const save = async () => {
  try {

    editedItem.value.itens = selectedProducts.value.map(produto => ({
      id_produto: produto.id_produto,
      qtde: produto.qtde || 1,
      preco: produto.preco,
    }));

    console.log("Enviando pedido para salvar:", editedItem.value);

    if (editedItem.value.id_pedido) {

      console.log(`Atualizando pedido: PUT /pedidos/${editedItem.value.id_pedido}`);
      await api.put(`/pedidos/${editedItem.value.id_pedido}`, editedItem.value);
    } else {

      console.log("Criando novo pedido: POST /pedidos");
      const response = await api.post('/pedidos', editedItem.value);

      if (!response.data.id_pedido) {
        console.error("Erro: ID do pedido não retornado pelo backend.");
        return;
      }

  
      editedItem.value.id_pedido = response.data.id_pedido;
      console.log(`Pedido criado com ID: ${editedItem.value.id_pedido}`);
    }

    console.log("Pedido salvo com sucesso!");
    close();
    await carregarPedidos(); 
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
    }
  }
};

const close = () => {
  dialog.value = false;
};

watch(selectedProducts, (novosProdutos) => {
  editedItem.value.itens = novosProdutos.map(produto => ({
    id_produto: produto.id_produto,
    nome: produto.nome,
    qtde: produto.qtde || 1,
    preco: produto.preco,
  }));
});

onMounted(async () => {
  await carregarClientes();
  await carregarProdutos();
  await carregarPedidos();
});
</script>
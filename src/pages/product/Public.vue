<template>
  <q-page padding class="">
    <div class="row">
      <q-table
        grid
        title="Product"
        :rows="products"
        :columns="columnsProduct"
        row-key="name"
        class="col-12"
        :pagination="initialPagination"
        :loading="loading"
        :filter="filter"
      >
        <template v-slot:top>
          <span class="text-h6">Produtos</span>
          <q-space />
          <q-input
            class="q-mr-sm"
            outlined
            dense
            v-model="filter"
            placeholder="Buscar"
            debounce="500"
          >
            <template v-slot:append>
              <q-icon name="search"></q-icon>
            </template>
          </q-input>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card>
              <q-img :src="props.row.img_url" :ratio="4 / 3" />
              <q-card-section class="text-center">
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle2">
                  {{ formatCurrency(props.row.price) }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { columnsProduct } from "./table";
import { defineComponent, onMounted, ref } from "vue";
import useApi from "src/composables/UseApi";
import { useRoute } from "vue-router";
import useNotify from "src/composables/UseNotify";
import { formatCurrency } from "src/utils/format";

export default defineComponent({
  name: "PageProductPublic",
  setup() {
    const products = ref([]);

    const { listPublic } = useApi();

    const { notifyError } = useNotify();
    const loading = ref(true);
    const filter = ref("");

    const table = "product";
    const route = useRoute();

    const handleListProducts = async (userId) => {
      try {
        products.value = await listPublic(table, userId);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      if (route.params.id) {
        handleListProducts(route.params.id);
      }
    });

    return {
      columnsProduct,
      products,
      loading,
      filter,
      formatCurrency,

      initialPagination: {
        sortBy: "name",
        ascending: true,
        rowsPerPage: 10,
      },
    };
  },
});
</script>

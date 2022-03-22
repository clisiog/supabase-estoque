<template>
  <q-page padding class="">
    <div class="row">
      <div class="col-12 text-center text-h4 q-pa-md">
        {{ brand.name }}
      </div>
    </div>
    <div class="row">
      <q-select
        outlined
        v-model="categoryId"
        :options="optionsCategory"
        label="Filtrar por categoria"
        option-label="name"
        option-value="id"
        map-options
        emit-value
        clearable
        class="col-12"
        dense
        @update:model-value="handleListProducts(route.params.id)"
      />

      <q-table
        grid
        title="Product"
        :rows="products"
        :columns="columnsProduct"
        row-key="id"
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
          <div class="q-pa-xs col-xs-6 col-sm-4 col-md-3">
            <q-card
              class="cursor-pointer"
              v-ripple:primary
              @click="handleShowDetails(props.row)"
            >
              <q-img :src="props.row.img_url" :ratio="4 / 3" />
              <q-card-section class="text-center">
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle2">
                  {{ formatCurrency(props.row.price) }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12" v-if="props.rowIndex === 3 && brand.img_paralax">
            <q-parallax :height="200" :speed="0.5">
              <template v-slot:media>
                <img :src="brand.img_paralax" />
              </template>
              <h3 class="text-blue">{{ brand.name }}</h3>
            </q-parallax>
          </div>
        </template>
      </q-table>
    </div>
    <!-- <div class="row justify-center q-mt-md">
      <q-pagination v-model="current" :max="5" direction-links />
    </div> -->
    <dialog-product-details
      :show="showDialogDetails"
      :product="productDetails"
      @hideDialog="showDialogDetails = false"
    />
  </q-page>
</template>

<script>
import { columnsProduct } from "./table";
import { defineComponent, onMounted, ref } from "vue";
import useApi from "src/composables/UseApi";
import { useRoute } from "vue-router";
import useNotify from "src/composables/UseNotify";
import { formatCurrency } from "src/utils/format";
import DialogProductDetails from "src/components/DialogProductDetails";

export default defineComponent({
  name: "PageProductPublic",
  components: {
    DialogProductDetails,
  },
  setup() {
    const products = ref([]);

    const { listPublic, brand } = useApi();

    const { notifyError } = useNotify();
    const loading = ref(true);
    const filter = ref("");

    const table = "product";
    const route = useRoute();

    const showDialogDetails = ref(false);
    const productDetails = ref({});
    const optionsCategory = ref([]);
    const categoryId = ref("");

    const handleListProducts = async (userId) => {
      try {
        loading.value = true;
        products.value = categoryId.value
          ? await listPublic(table, userId, "category_id", categoryId.value)
          : await listPublic(table, userId);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleShowDetails = (product) => {
      productDetails.value = product;
      showDialogDetails.value = true;
    };

    const handleListCategories = async (userId) => {
      optionsCategory.value = await listPublic("category", userId);
    };

    onMounted(() => {
      if (route.params.id) {
        handleListCategories(route.params.id);
        handleListProducts(route.params.id);
      }
    });

    return {
      columnsProduct,
      products,
      loading,
      filter,
      formatCurrency,
      showDialogDetails,
      productDetails,
      handleShowDetails,
      optionsCategory,
      categoryId,
      route,
      handleListProducts,
      brand,

      initialPagination: {
        sortBy: "name",
        ascending: true,
        rowsPerPage: 8,
      },
    };
  },
});
</script>

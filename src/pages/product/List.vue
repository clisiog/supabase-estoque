<template>
  <q-page padding class="">
    <div class="row">
      <q-table
        title="Product"
        :rows="products"
        :columns="columnsProduct"
        row-key="name"
        class="col-12"
        :pagination="initialPagination"
        :loading="loading"
      >
        <template v-slot:top>
          <span class="text-h6">Produtos</span>
          <q-btn
            label="Loja on-line"
            title="Abrir loja em nova janela"
            dense
            size="sm"
            outline
            class="q-ml-sm"
            icon="store"
            color="primary"
            @click="handleGoToStore"
          ></q-btn>

          <q-btn
            label="Copiar Link"
            dense
            size="sm"
            outline
            class="q-ml-sm"
            icon="content_copy"
            color="primary"
            @click="handleCopyLink"
          />

          <q-space />
          <q-btn
            v-if="$q.platform.is.desktop"
            icon="add"
            color="primary"
            :to="{ name: 'form-product' }"
          >
            <q-tooltip>Novo Produto</q-tooltip>
          </q-btn>
        </template>

        <template v-slot:body-cell-img_url="props">
          <q-td :props="props">
            <q-avatar v-if="props.row.img_url">
              <img :src="props.row.img_url" />
            </q-avatar>
            <q-avatar
              v-else
              color="grey"
              text-color="white"
              icon="broken_image"
            >
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="edit"
              color="info"
              dense
              @click="handleEdit(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              color="negative"
              dense
              @click="handleRemoveProduct(props.row)"
            >
              <q-tooltip>Apagar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-page-sticky
      position="bottom-right"
      :offset="[16, 16]"
      v-if="$q.platform.is.mobile"
    >
      <q-btn fab icon="add" color="primary" :to="{ name: 'form-product' }">
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { columnsProduct } from "./table";
import { defineComponent, onMounted, ref } from "vue";
import useApi from "src/composables/UseApi";
import useAuthUser from "src/composables/UseAuthUser";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
import { useQuasar, openURL, copyToClipboard } from "quasar";

export default defineComponent({
  name: "PageProductList",
  setup() {
    const products = ref([]);

    const { listPublic, remove } = useApi();
    const { user } = useAuthUser();
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const loading = ref(true);
    const $q = useQuasar();
    const table = "product";

    const handleListProducts = async () => {
      try {
        products.value = await listPublic(table, user.value.id);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleEdit = (product) => {
      router.push({ name: "form-product", params: { id: product.id } });
    };

    const handleRemoveProduct = async (product) => {
      try {
        $q.dialog({
          title: "Confirmar remoção",
          message: `Deseja realmente remover o produto ${product.name}?`,
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await remove(table, product.id);
          notifySuccess("Produto removido com sucesso.");
          handleListProducts();
        });
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGoToStore = () => {
      const currentUserId = user.value.id;
      const link = router.resolve({
        name: "product-public",
        params: { id: currentUserId },
      });
      // router.push({ name: "product-public", params: { id: currentUserId } });
      openURL(window.origin + link.href);
    };

    const handleCopyLink = () => {
      const currentUserId = user.value.id;
      const link = router.resolve({
        name: "product-public",
        params: { id: currentUserId },
      });
      const externalLink = window.origin + link.href;
      copyToClipboard(externalLink)
        .then(() => {
          notifySuccess("Link copiado");
        })
        .catch(() => {
          notifyError("Erro de execução");
        });
    };

    onMounted(() => {
      handleListProducts();
    });

    return {
      columnsProduct,
      products,
      loading,
      handleEdit,
      handleRemoveProduct,
      handleGoToStore,
      handleCopyLink,

      initialPagination: {
        sortBy: "name",
        ascending: true,
        rowsPerPage: 10,
      },
    };
  },
});
</script>

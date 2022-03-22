<template>
  <q-page padding class="">
    <div class="row">
      <q-table
        title="Category"
        :rows="categories"
        :columns="columnsCategory"
        row-key="name"
        class="col-12"
        :pagination="initialPagination"
        :loading="loading"
      >
        <template v-slot:top>
          <span class="text-h6">Categorias</span>
          <q-space />
          <q-btn
            v-if="$q.platform.is.desktop"
            icon="add"
            color="primary"
            :to="{ name: 'form-category' }"
          >
            <q-tooltip>Nova categoria</q-tooltip>
          </q-btn>
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
              @click="handleRemoveCategory(props.row)"
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
      <q-btn fab icon="add" color="primary" :to="{ name: 'form-category' }">
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { columnsCategory } from "./table";
import { defineComponent, onMounted, ref } from "vue";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageCategoryList",
  setup() {
    const categories = ref([]);

    const { listPublic, remove } = useApi();
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const loading = ref(true);
    const $q = useQuasar();
    const { user } = useAuthUser();
    const table = "category";

    const handleListCategories = async () => {
      try {
        categories.value = await listPublic(table, user.value.id);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleEdit = (category) => {
      router.push({ name: "form-category", params: { id: category.id } });
    };

    const handleRemoveCategory = async (category) => {
      try {
        $q.dialog({
          title: "Confirmar remoção",
          message: `Deseja realmente remover a categoria ${category.name}?`,
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await remove(table, category.id);
          notifySuccess("Categoria removida com sucesso.");
          handleListCategories();
        });
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      handleListCategories();
    });

    return {
      columnsCategory,
      categories,
      loading,
      handleEdit,
      handleRemoveCategory,

      initialPagination: {
        sortBy: "name",
        ascending: true,
        rowsPerPage: 10,
      },
    };
  },
});
</script>

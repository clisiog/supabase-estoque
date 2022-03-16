<template>
  <q-page padding class="q-gutter-y-md">
    <div class="rom">
      <div class="col-12 text-center">
        <p class="text-h6">Nova categoria</p>
      </div>
    </div>

    <q-form
      class="col-md-6 col-xs-12 col-sm-12 q-gutter-y-md"
      @submit.prevent="handlePost"
    >
      <q-input
        label="Nome"
        v-model="form.name"
        :rules="[(val) => (val && val.length > 2) || 'Mínimo 3 caracteres']"
      ></q-input>

      <q-btn
        :label="isUpdate ? 'Modificar' : 'Criar'"
        color="primary"
        class="full-width"
        rounded
        type="submit"
      ></q-btn>
      <q-btn
        label="Cancelar"
        color="primary"
        class="full-width"
        rounded
        outline
        :to="{ name: 'category' }"
      ></q-btn>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageFormCategory",
  setup() {
    const table = "category";
    const router = useRouter();
    const route = useRoute();
    const { post, getById, update } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    const isUpdate = computed(() => route.params.id);

    let category = {};
    const form = ref({ name: "" });

    onMounted(() => {
      if (isUpdate.value) {
        handleGetCategory(isUpdate.value);
      }
    });

    const handlePost = async () => {
      try {
        if (isUpdate.value) {
          await update(table, form.value);
          notifySuccess("Categoria modificada com sucesso");
        } else {
          await post(table, form.value);
          notifySuccess("Categoria criada com sucesso");
        }
        router.push({ name: "category" });
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetCategory = async (id) => {
      try {
        category = await getById(table, id);
        form.value = category;
      } catch (error) {
        notifyError(error.message);
      }
    };

    return { handlePost, form, isUpdate };
  },
});
</script>

<template>
  <q-page padding class="q-gutter-y-md">
    <div class="rom">
      <div class="col-12 text-center">
        <p class="text-h6">Novo produto</p>
      </div>
    </div>

    <q-form
      class="col-md-6 col-xs-12 col-sm-12 q-gutter-y-md"
      @submit.prevent="handlePost"
    >
      <q-input
        label="Imagem"
        stack-label
        v-model="img"
        type="file"
        accept="image/*"
      ></q-input>

      <q-input
        label="Nome"
        v-model="form.name"
        :rules="[(val) => (val && val.length > 2) || 'Mínimo 3 caracteres']"
      ></q-input>

      <q-editor
        v-model="form.description"
        min-height="5rem"
        placeholder="Descrição"
      ></q-editor>

      <q-input
        label="Quantidade"
        v-model="form.amount"
        :rules="[(val) => val >= 0 || 'Número inteiro positivo']"
        type="number"
      ></q-input>

      <q-input
        label="Preço"
        v-model="form.price"
        :rules="[(val) => val >= 0 || 'Defina um preço']"
        prefix="R$"
      ></q-input>

      <q-select
        v-model="form.category_id"
        :options="optionsCategory"
        label="Categoria"
        option-value="id"
        option-label="name"
        map-options
        emit-value
        :rules="[(val) => !!val || 'Escolha uma categoria']"
      >
      </q-select>

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
        :to="{ name: 'product' }"
      ></q-btn>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";
import useAuthUser from "src/composables/UseAuthUser";

export default defineComponent({
  name: "PageFormProduct",
  setup() {
    const table = "product";
    const router = useRouter();
    const route = useRoute();
    const { post, getById, update, listPublic, uploadImg } = useApi();
    const { notifyError, notifySuccess } = useNotify();
    const { user } = useAuthUser();

    const isUpdate = computed(() => route.params.id);

    let product = {};
    const optionsCategory = ref([]);
    const img = ref([]);
    const form = ref({
      name: "",
      description: "",
      amount: "",
      price: "",
      img_url: "",
    });

    onMounted(() => {
      handleListCategories();
      if (isUpdate.value) {
        handleGetProduct(isUpdate.value);
      }
    });

    const handleListCategories = async () => {
      optionsCategory.value = await listPublic("category", user.value.id);
    };

    const handlePost = async () => {
      try {
        if (img.value.length > 0) {
          const imgUrl = await uploadImg(img.value[0], "products");
          form.value.img_url = imgUrl;
        }
        if (isUpdate.value) {
          await update(table, form.value);
          notifySuccess("Produto modificado com sucesso");
        } else {
          await post(table, form.value);
          notifySuccess("Produto criado com sucesso");
        }
        router.push({ name: "product" });
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetProduct = async (id) => {
      try {
        product = await getById(table, id);
        form.value = product;
      } catch (error) {
        notifyError(error.message);
      }
    };

    return { handlePost, form, isUpdate, optionsCategory, img };
  },
});
</script>

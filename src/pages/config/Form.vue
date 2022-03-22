<template>
  <q-page padding class="q-gutter-y-md">
    <div class="rom">
      <div class="col-12 text-center">
        <p class="text-h6">Configurações</p>
      </div>
    </div>

    <q-form
      class="col-md-6 col-xs-12 col-sm-12 q-gutter-y-md"
      @submit.prevent="handlePost"
    >
      <q-input
        label="Nome da loja"
        v-model="form.name"
        :rules="[(val) => (val && val.length > 2) || 'Mínimo 3 caracteres']"
      ></q-input>

      <q-input
        label="Telefone whatsapp"
        v-model="form.phone"
        mask="(##) #####-####"
        unmasked-value
      ></q-input>

      <q-input
        label="Imagem do perfil"
        stack-label
        v-model="paralax"
        type="file"
        accept="image/*"
      >
      </q-input>

      <div class="row justify-center q-gutter-md q-pa-md">
        <div class="col-md-4 col-xs-8">
          <q-color v-model="form.primary" />
        </div>

        <div class="col-md-4 col-xs-8">
          <q-color v-model="form.secondary" />
        </div>
      </div>

      <q-btn
        label="Salvar"
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
        :to="{ name: 'me' }"
      ></q-btn>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useApi from "src/composables/UseApi";
import useAuthUser from "src/composables/UseAuthUser";
import useNotify from "src/composables/UseNotify";
import useBrand from "src/composables/UseBrand";

export default defineComponent({
  name: "PageFormConfig",
  setup() {
    const table = "config";
    const router = useRouter();

    const { listPublic, update, uploadImg } = useApi();
    const { user } = useAuthUser();
    const { notifyError, notifySuccess } = useNotify();

    const { setBrand } = useBrand();

    let config = {};
    const paralax = ref([]);
    const form = ref({
      name: "",
      phone: "",
      primary: "",
      secondary: "",
      img_paralax: "",
    });

    onMounted(() => {
      handleGetConfig();
    });

    const handlePost = async () => {
      try {
        if (paralax.value.length > 0) {
          const paralaxUrl = await uploadImg(paralax.value[0], "paralax");
          form.value.img_paralax = paralaxUrl;
          console.log(form.value.img_paralax);
        }
        if (form.value.id) {
          await update(table, form.value);
          notifySuccess("Salvo com sucesso");
        }
        setBrand(form.value.primary, form.value.secondary);
        router.push({ name: "me" });
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetConfig = async () => {
      try {
        config = await listPublic(table, user.value.id);
        form.value = config[0];
      } catch (error) {
        notifyError(error.message);
      }
    };

    return { handlePost, form, paralax };
  },
});
</script>

<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRegister">
      <div class="full-width">
        <p class="text-h5 text-center q-mt-lg">Cadastre-se</p>
      </div>

      <div class="col-md-4 col-sm-8 col-xs-12 q-gutter-y-lg">
        <q-input
          label="Nome"
          v-model="form.name"
          lazy-rules
          :rules="[(val) => (val && val.length > 2) || 'Mínimo 3 caracteres']"
        ></q-input>
        <q-input
          label="E-mail"
          v-model="form.email"
          lazy-rules
          :rules="[(val) => (val && val.length > 5) || 'Digite um e-mail']"
          type="email"
        ></q-input>
        <q-input
          label="Senha"
          v-model="form.password"
          lazy-rules
          :rules="[(val) => (val && val.length > 5) || 'Mínimo 6 caracteres']"
        ></q-input>

        <div class="full-width">
          <q-btn
            label="Cadastrar"
            color="primary"
            class="full-width q-mt-lg"
            outlined
            rounded
            type="submit"
          ></q-btn>
          <q-btn
            label="Voltar"
            color="primary"
            class="full-width q-mt-lg"
            outline
            rounded
            :to="{ name: 'login' }"
          ></q-btn>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageRegister",
  setup() {
    const router = useRouter();

    const { register } = useAuthUser();

    const { notifyError, notifySuccess } = useNotify();

    const form = ref({
      name: "",
      email: "",
      password: "",
    });

    const handleRegister = async () => {
      try {
        await register(form.value);
        notifySuccess();
        router.push({
          name: "email-confirmation",
          query: { email: form.value.email },
        });
      } catch (error) {
        notifyError(error.message);
      }
    };

    return { form, handleRegister };
  },
});
</script>

<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <div class="full-width">
        <p class="text-h5 text-center q-mt-lg">Faça login ou cadastre-se</p>
      </div>

      <div class="col-md-4 col-sm-8 col-xs-12 q-gutter-y-lg">
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
          type="password"
          lazy-rules
          :rules="[(val) => (val && val.length > 5) || 'Mínimo 6 caracteres']"
        ></q-input>
        <div class="full-width">
          <q-btn
            label="Login"
            color="primary"
            class="full-width q-mt-md"
            outlined
            rounded
            type="submit"
          ></q-btn>
        </div>
        <div class="full-width">
          <q-btn
            label="Cadastrar"
            color="primary"
            class="full-width"
            outline
            rounded
            to="/register"
          ></q-btn>
        </div>
        <div class="full-width">
          <q-btn
            label="Esqueci minha senha"
            color="grey"
            class="full-width"
            flat
            rounded
            size="sm"
            :to="{ name: 'forgot-password' }"
          ></q-btn>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageLogin",
  setup() {
    const router = useRouter();

    const { login, isLoggedIn } = useAuthUser();

    const { notifyError, notifySuccess } = useNotify();

    const form = ref({
      email: "",
      password: "",
    });

    onMounted(() => {
      if (isLoggedIn) {
        router.push({ name: "me" });
      }
    });

    const handleLogin = async () => {
      try {
        await login(form.value);
        notifySuccess("Você está logado");
        router.push({ name: "me" });
      } catch (error) {
        // alert(error.message);
        notifyError(error.message);
      }
    };

    return { form, handleLogin };
  },
});
</script>

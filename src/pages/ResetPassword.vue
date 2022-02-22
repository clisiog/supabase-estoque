<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleNewPassword">
      <div class="full-width">
        <p class="text-h5 text-center q-mt-lg">Nova senha</p>
      </div>

      <div class="col-md-4 col-sm-8 col-xs-12 q-gutter-y-lg">
        <q-input
          label="Password"
          v-model="password"
          lazy-rules
          :rules="[(val) => (val && val.length > 5) || 'Mínimo 6 caracteres']"
        ></q-input>

        <div class="full-width">
          <q-btn
            label="Enviar"
            color="primary"
            class="full-width q-mt-lg"
            outlined
            rounded
            type="submit"
          ></q-btn>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import useAuthUser from "src/composables/UseAuthUser";
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageResetPassword",
  setup() {
    const { resetPassword } = useAuthUser();
    const router = useRouter();
    const route = useRoute();
    const token = route.query.token;

    const { notifyError, notifySuccess } = useNotify();

    const password = ref("");

    const handleNewPassword = async () => {
      try {
        await resetPassword(token, password.value);
        notifySuccess("Senha alterada com sucesso");
        router.push({ name: "login" });
      } catch (error) {
        notifyError(error.message);
      }
    };

    return { password, handleNewPassword };
  },
});
</script>

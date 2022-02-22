<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handlePasswordReset">
      <div class="full-width">
        <p class="text-h5 text-center q-mt-lg">Reset de senha</p>
      </div>

      <div class="col-md-4 col-sm-8 col-xs-12 q-gutter-y-lg">
        <q-input label="E-mail" v-model="email"></q-input>

        <div class="full-width">
          <q-btn
            label="Enviar"
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
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  setup() {
    const { sendPasswordRestEmail } = useAuthUser();
    const { notifyError, notifySuccess } = useNotify();

    const email = ref("");

    const handlePasswordReset = async () => {
      try {
        await sendPasswordRestEmail(email.value);
        notifySuccess(`Reset de senha enviado para ${email.value}`);
      } catch (error) {
        notifyError(error.message);
      }
    };

    return { email, handlePasswordReset };
  },
});
</script>

<template>
  <q-page padding>
    <p class="text-body1 text-center q-mt-lg">Obrigado por se cadastrar.</p>
    <p class="text-body1 text-center">
      Para continuar, clique no link de confirmação que foi enviado ao email
      <strong>{{ $route.query.email }}</strong>
    </p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageEmailConfirmation",
});
</script>

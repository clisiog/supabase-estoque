<template>
  <q-dialog
    :model-value="show"
    @before-hide="handleCloseModal"
    :full-width="$q.platform.is.mobile"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Detalhes</div>
      </q-card-section>

      <q-card-section>
        <q-img :src="product.img_url" :ratio="4 / 3" style="min-width: 300px" />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">{{ product.name }}</div>

        <div class="text-subtitle2">{{ formatCurrency(product.price) }}</div>

        <div class="text-body2" v-html="product.description"></div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="Cancelar" color="primary" outline v-close-popup />
        <q-btn
          v-if="brand.phone"
          label="Pedir pelo whats"
          icon="whatsapp"
          color="green-7"
          @click="handleSendWhats"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { formatCurrency } from "src/utils/format";
import { openURL } from "quasar";
import useApi from "src/composables/UseApi";

export default defineComponent({
  name: "DialogProductDetails",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    product: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    // const phoneNumber = "47984978583";
    const text = "Olá, fiquei interessado no produto";
    const { brand } = useApi();

    const handleCloseModal = () => {
      emit("hideDialog");
    };

    const handleSendWhats = () => {
      const link = encodeURI(
        `https://wa.me/55${brand.value.phone}?text=${text} ${props.product.name}`
      );
      openURL(link);
    };

    return { formatCurrency, handleSendWhats, handleCloseModal, brand };
  },
});
</script>

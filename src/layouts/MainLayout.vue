<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Estoque </q-toolbar-title>

        <q-btn-dropdown flat color="black" icon="person">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Perfil</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import useApi from "src/composables/UseApi";

const linksList = [
  {
    title: "Home",
    caption: "Página inicial",
    icon: "home",
    routeName: "me",
  },
  {
    title: "Categorias",
    caption: "Categorias de produtos",
    icon: "list",
    routeName: "me/category",
  },
  {
    title: "Produtos",
    caption: "Lista de produtos",
    icon: "archive",
    routeName: "me/product",
  },
  {
    title: "Configurações",
    caption: "Dados e Personalização",
    icon: "settings",
    routeName: "me/form-config",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    const router = useRouter();
    const $q = useQuasar();

    const { logout } = useAuthUser();

    const { getBrand } = useApi();

    onMounted(() => {
      getBrand();
    });

    const handleLogout = async () => {
      $q.dialog({
        title: "Confirmar logout?",
        message:
          "Clique Ok para sair ou cancelar para permanecer com o usuário.",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await logout();
        router.replace({ name: "login" });
      });
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      handleLogout,
    };
  },
});
</script>

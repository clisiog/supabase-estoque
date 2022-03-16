import { formatCurrency } from "src/utils/format";

const columnsProduct = [
  {
    name: "img_url",
    label: "Imagem",
    align: "left",
    field: "img_url",
    sortable: false,
  },
  {
    name: "name",
    label: "Nome",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "amount",
    label: "Estoque",
    align: "left",
    field: "amount",
    sortable: true,
  },
  {
    name: "price",
    label: "Valor",
    align: "left",
    field: "price",
    format: (val) => formatCurrency(val),
    sortable: true,
  },
  {
    name: "actions",
    label: "Ações",
    align: "right",
    field: "actions",
  },
];

export { columnsProduct };

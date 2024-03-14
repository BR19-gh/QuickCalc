const TOOLS = [
  {
    id: 1,
    name: "Discount Calculator",
  },
  {
    id: 2,
    name: "Currency Converter",
  },
  {
    id: 3,
    name: "Measurement Converter",
  },
  {
    id: 4,
    name: "Tip Calculator",
  },
  {
    id: 5,
    name: "Create Your Custom Tool",
  },
];

const COLORS = [
  { id: "50", color: "#f1f8fd" },
  { id: "100", color: "#dff0fa" },
  { id: "200", color: "#c5e5f8" },
  { id: "300", color: "#9ed4f2" },
  { id: "400", color: "#70bbea" },
  { id: "500", color: "#4299e1" },
  { id: "600", color: "#3985d7" },
  { id: "700", color: "#3070c5" },
  { id: "800", color: "#2d5ba0" },
  { id: "900", color: "#294d7f" },
  { id: "950", color: "#1d304e" },
];

export function _getTools() {
  return new Promise((resolve) => {
    resolve({ ...TOOLS });
  });
}

export function _getColors() {
  return new Promise((resolve) => {
    resolve({ ...COLORS });
  });
}

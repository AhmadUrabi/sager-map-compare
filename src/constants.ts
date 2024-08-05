export const colors = [
  { name: "Red", code: "#FF0000" },
  { name: "Blue", code: "#0000FF" },
  { name: "Green", code: "#00FF00" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Purple", code: "#800080" },
  { name: "Orange", code: "#FFA500" },
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" },
  { name: "Gray", code: "#808080" },
  { name: "Brown", code: "#A52A2A" },
];

export const styles = {
  id: "gl-draw-polygon-fill",
  type: "fill",
  filter: ["all", ["==", "$type", "Polygon"]],
  paint: {
    "fill-color": [
      "case",
      ["has", "user_fill"],
      ["get", "user_fill"],
      ["has", "fill"],
      ["get", "fill"],
      "#FF0000",
    ],
    "fill-outline-color": [
      "case",
      ["has", "stroke"],
      ["get", "stroke"],
      "#D20C0C",
    ],
    "fill-opacity": 0.5,
  },
};


export const MAPBOX_TOKEN = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;

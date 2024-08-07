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

export const initialViewState = {
	longitude: 35.9106,
	latitude: 31.9544,
	zoom: 12,
};

export const layerStyle: LayerProps = {
	id: "poi-labels",
	type: "symbol",
	source: "mapbox-gl-draw-hot",
	layout: {
		"text-field": ["get", "description"],
		"text-variable-anchor": ["top", "bottom", "left", "right"],
		"text-justify": "auto",
		"text-size": 16,
		"icon-image": ["get", "icon"],
	},
	paint: {
		"text-color": "#777",
	},
};

export const layerLengthStyle: LayerProps = {
	id: "length-labels",
	type: "symbol",
	source: "mapbox-gl-draw-hot", // Will be ignored
	layout: {
		"text-field": ["get", "length"],
		"text-variable-anchor": ["top", "bottom", "left", "right"],
		"text-justify": "auto",
		"text-size": 16,
		// "text-ignore-placement": true,
		// "text-allow-overlap": true,
		"text-offset": [0, 0.5],
		// visibility: ["get", "visible"],
	},
	paint: {
		"text-color": "#000",
		"text-halo-color": "#000",
		"text-halo-width": 0,
		// "text-opacity-transition": { duration: 0 },
	},
};

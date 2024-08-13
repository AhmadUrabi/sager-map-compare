import type { LayerProps } from "react-map-gl";

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
	type: "symbol",
	// filter: ["all", ["==", "$type", "Polygon"]],
	layout: {
		"text-field": ["get", "user_description"],
		"text-variable-anchor": ["top", "bottom", "left", "right"],
		"text-justify": "auto",
		"text-size": 16,
	},
	paint: {
		"text-color": "#777",
	},
};

export const MAPBOX_TOKEN = import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN;

export const initialViewState = {
	longitude: 35.9106,
	latitude: 31.9544,
	zoom: 12,
};

export const layerStyle = {
	id: "draw-style",
	type: "symbol",
	source: "mapbox-gl-draw-hot",
	layout: {
		"text-field": ["get", "description"],
		"text-variable-anchor": ["top", "bottom", "left", "right"],
		"text-justify": "auto",
		"text-size": 16,
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

export const styleList = [
	{
		id: "gl-draw-polygon-fill.cold",
		type: "fill",
		filter: ["all", ["==", "$type", "Polygon"]],
		paint: {
			"fill-color": [
				"case",
				["==", ["get", "active"], "true"],
				"#fbb03b",
				"#3bb2d0",
			],
			"fill-opacity": 0.1,
		},
		source: "mapbox-gl-draw-cold",
	},
	{
		id: "gl-draw-lines.cold",
		type: "line",
		filter: ["any", ["==", "$type", "LineString"], ["==", "$type", "Polygon"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": [
				"case",
				["==", ["get", "active"], "true"],
				"#fbb03b",
				"#3bb2d0",
			],
			"line-dasharray": [
				"case",
				["==", ["get", "active"], "true"],
				[0.2, 2],
				[2, 0],
			],
			"line-width": 2,
		},
		source: "mapbox-gl-draw-cold",
	},
	{
		id: "gl-draw-point-outer.cold",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
		paint: {
			"circle-radius": ["case", ["==", ["get", "active"], "true"], 7, 5],
			"circle-color": "#fff",
		},
		source: "mapbox-gl-draw-cold",
	},
	{
		id: "gl-draw-point-inner.cold",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
		paint: {
			"circle-radius": ["case", ["==", ["get", "active"], "true"], 5, 3],
			"circle-color": [
				"case",
				["==", ["get", "active"], "true"],
				"#fbb03b",
				"#3bb2d0",
			],
		},
		source: "mapbox-gl-draw-cold",
	},
	{
		id: "gl-draw-vertex-outer.cold",
		type: "circle",
		filter: [
			"all",
			["==", "$type", "Point"],
			["==", "meta", "vertex"],
			["!=", "mode", "simple_select"],
		],
		paint: {
			"circle-radius": ["case", ["==", ["get", "active"], "true"], 7, 5],
			"circle-color": "#fff",
		},
		source: "mapbox-gl-draw-cold",
	},
	{
		id: "gl-draw-vertex-inner.cold",
		type: "circle",
		filter: [
			"all",
			["==", "$type", "Point"],
			["==", "meta", "vertex"],
			["!=", "mode", "simple_select"],
		],
		paint: {
			"circle-radius": ["case", ["==", ["get", "active"], "true"], 5, 3],
			"circle-color": "#fbb03b",
		},
		source: "mapbox-gl-draw-cold",
	},
	{
		id: "gl-draw-midpoint.cold",
		type: "circle",
		filter: ["all", ["==", "meta", "midpoint"]],
		paint: {
			"circle-radius": 3,
			"circle-color": "#fbb03b",
		},
		source: "mapbox-gl-draw-cold",
	},
	{
		id: "gl-draw-polygon-fill.hot",
		type: "fill",
		filter: ["all", ["==", "$type", "Polygon"]],
		paint: {
			"fill-color": [
				"case",
				["==", ["get", "active"], "true"],
				"#fbb03b",
				"#3bb2d0",
			],
			"fill-opacity": 0.1,
		},
		source: "mapbox-gl-draw-hot",
	},
	{
		id: "gl-draw-lines.hot",
		type: "line",
		filter: ["any", ["==", "$type", "LineString"], ["==", "$type", "Polygon"]],
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
		paint: {
			"line-color": [
				"case",
				["==", ["get", "active"], "true"],
				"#fbb03b",
				"#3bb2d0",
			],
			"line-dasharray": [
				"case",
				["==", ["get", "active"], "true"],
				[0.2, 2],
				[2, 0],
			],
			"line-width": 2,
		},
		source: "mapbox-gl-draw-hot",
	},
	{
		id: "gl-draw-point-outer.hot",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
		paint: {
			"circle-radius": ["case", ["==", ["get", "active"], "true"], 7, 5],
			"circle-color": "#fff",
		},
		source: "mapbox-gl-draw-hot",
	},
	{
		id: "gl-draw-point-inner.hot",
		type: "circle",
		filter: ["all", ["==", "$type", "Point"], ["==", "meta", "feature"]],
		paint: {
			"circle-radius": ["case", ["==", ["get", "active"], "true"], 5, 3],
			"circle-color": [
				"case",
				["==", ["get", "active"], "true"],
				"#fbb03b",
				"#3bb2d0",
			],
		},
		source: "mapbox-gl-draw-hot",
	},
	{
		id: "gl-draw-vertex-outer.hot",
		type: "circle",
		filter: [
			"all",
			["==", "$type", "Point"],
			["==", "meta", "vertex"],
			["!=", "mode", "simple_select"],
		],
		paint: {
			"circle-radius": ["case", ["==", ["get", "active"], "true"], 7, 5],
			"circle-color": "#fff",
		},
		source: "mapbox-gl-draw-hot",
	},
	{
		id: "gl-draw-vertex-inner.hot",
		type: "circle",
		filter: [
			"all",
			["==", "$type", "Point"],
			["==", "meta", "vertex"],
			["!=", "mode", "simple_select"],
		],
		paint: {
			"circle-radius": ["case", ["==", ["get", "active"], "true"], 5, 3],
			"circle-color": "#fbb03b",
		},
		source: "mapbox-gl-draw-hot",
	},
	{
		id: "gl-draw-midpoint.hot",
		type: "circle",
		filter: ["all", ["==", "meta", "midpoint"]],
		paint: {
			"circle-radius": 3,
			"circle-color": "#fbb03b",
		},
		source: "mapbox-gl-draw-hot",
	},
	{
		id: "polygonArea",
		type: "symbol",
		// filter: ["all", ["==", "$type", "Polygon"]],
		layout: {
			"text-field": ["get", "user_description"],
			"text-variable-anchor": ["top", "bottom", "left", "right"],
			"text-justify": "auto",
			// "text-allow-overlap": true,
			// "text-ignore-placement": true,
			"text-size": 16,
		},
		paint: {
			"text-opacity": ["get", "user_text_visibility"],
			"text-color": "#777",
		},
	},
];

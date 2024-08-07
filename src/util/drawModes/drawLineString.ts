import { length } from "@turf/turf";

export function getDisplayFeatures(
	state: any,
	geojson: any,
	display: any,
	calculateLengthTimeout: any,
	setLengthSource: any,
	setLengthVisible: any,
) {
	display(geojson);
	// Return if we didn't add any points
	if (geojson.geometry.coordinates.length === 1) return;

	// Check if the line is currently active
	const isActiveLine = geojson.properties.id === state.line.id;
	geojson.properties.active = isActiveLine ? "true" : "false";

	// Reset Timeout for calculating length
	if (calculateLengthTimeout.current) {
		clearTimeout(calculateLengthTimeout.current);
		calculateLengthTimeout.current = null;
		setLengthVisible(false);
	}

	if (isActiveLine && !calculateLengthTimeout.current) {
		calculateLengthTimeout.current = setTimeout(() => {
			console.log("Calculating Length");
			setLengthVisible(true);
			const coords =
				geojson.geometry.coordinates[geojson.geometry.coordinates.length - 1];

			if (!coords) return;

			setLengthSource({
				id: "length-source",
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [coords[0], coords[1]],
				},
				properties: {
					length: length(geojson, {
						units: "meters",
					}).toFixed(2),
				},
			});
			calculateLengthTimeout.current = null;
		}, 50);
	}
}

import { area, centroid } from "@turf/turf";

export const calculateAreaAndCenter = (feature: GeoJSONFeature) => {
	const centerCoors = centroid(feature.geometry).geometry.coordinates;
	const featureArea = area(feature.geometry);
	return {
		area: featureArea,
		center: centerCoors,
	};
};

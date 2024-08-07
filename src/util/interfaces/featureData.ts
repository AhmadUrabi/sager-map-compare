export default interface FeatureData {
	[id: string]: {
		type: string;
		id: string;
		properties: {
			description: string;
		};
		geometry: {
			type: string;
			coordinates: [number, number];
		};
	};
}

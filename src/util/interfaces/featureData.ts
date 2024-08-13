export default interface FeatureData {
	[id: string]: {
		type: string;
		id: string;
		properties: {
			description: string;
			text_visibility: boolean;
		};
		geometry: {
			type: string;
			coordinates: [number, number];
		};
	};
}

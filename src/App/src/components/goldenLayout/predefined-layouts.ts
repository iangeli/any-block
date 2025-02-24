import {
	ComponentItemConfig,
	ItemType,
	LayoutConfig,
} from "golden-layout";

const miniRowConfig: LayoutConfig = {
	root: {
		type: ItemType.row,
		content: [
			{
				type: "component",
				title: "MdEditor",
				header: { show: "top", popout: false },
				// isClosable: false,
				componentType: "MdEditor",
				componentState: undefined,
				width: 25
			} as ComponentItemConfig,
			{
				type: "component",
				title: "MdViewer",
				header: { show: "top", popout: false },
				componentType: "MdViewer",
				width: 75
			} as ComponentItemConfig
		]
	}
};

export const prefinedLayouts = {
	miniRow: miniRowConfig,
}

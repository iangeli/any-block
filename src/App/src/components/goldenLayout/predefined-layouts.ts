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
				width: 35
			} as ComponentItemConfig,
			{
				type: "component",
				title: "MdViewer",
				header: { show: "top", popout: false },
				componentType: "MdViewer",
				width: 65
			} as ComponentItemConfig
		]
	}
};

export const prefinedLayouts = {
	miniRow: miniRowConfig,
}

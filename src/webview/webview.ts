import { EntityDescription, SlotRelationship } from "./dynamo/Descriptors";
import { DynamoDiagramVisualizer } from "./dynamo/DynamoDiagramVisualizer";
import { SvgVisualizationBuilder } from "./SvgVisualizationBuilder";
import { SvgInHtml } from "./utils";

export function main() {
    const svgRoot = document.getElementById("dynamo-svg") as SvgInHtml;
    if (svgRoot == null) {
        return;
    }
    const builder = new SvgVisualizationBuilder(svgRoot);
    const visualizer = new DynamoDiagramVisualizer(builder);

    let entity: EntityDescription = {
        name: "SomeEnttiy",
        slots: [
            { name: "SomeSlot", type: "slot", relation: SlotRelationship.CLONE },
            { name: "SomeOtherSlot", type: "slot", value: { text: "23" }, relation: SlotRelationship.SPECIALIZE },
            {
                name: "NewSlot",
                type: "slot",
                value: { text: "$SomeVal", new: true },
                relation: SlotRelationship.PARTITION,
                expanded: true,
            },
            { name: "NumeroTres", type: "slot", value: { text: "#3", new: true }, relation: SlotRelationship.OMIT },
            { name: "SomeOperation", type: "validation" },
            { name: "SomeOperation2", type: "validation" },
        ],
    };

    visualizer.addEntity(entity);
}

import { EntityDescription, SlotRelationship } from "./dynamo/Descriptors";
import { DynamoDiagramVisualizer } from "./dynamo/DynamoDiagramVisualizer";
import TextToSVG from "./TextToSvg";
import "./font/RobotoMono.ttf";
import { DynamoShapeBuilder } from "./dynamo/ShapeBuilder";

export function main(mediaUri: string) {
    const svgRoot = document.getElementById("dynamo-svg");
    if (svgRoot == null) {
        return;
    }

    TextToSVG.load(`${mediaUri}/font/RobotoMono.ttf`, (err: any, tts: TextToSVG | null) => {
        if (err || tts == null) {
            console.error(`Error while loading opentype text: ${err} | ${tts}`);
            return;
        }
        buildVisualization(svgRoot.id, tts);
    });
}

function buildVisualization(svgId: string, tts: TextToSVG) {
    const builder = new DynamoShapeBuilder(`#${svgId}`);
    //builder.addCameraHandlers();
    const visualizer = new DynamoDiagramVisualizer(builder, tts);

    let entity: EntityDescription = {
        name: "SomeEntity",
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

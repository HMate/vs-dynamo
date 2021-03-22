import { EntityDescription, SlotRelationship } from "./dynamo/Descriptors";
import { DynamoDiagramVisualizer } from "./dynamo/DynamoDiagramVisualizer";
import TextToSVG from "./TextToSvg";
import "./font/RobotoMono.ttf";
import { DynamoShapeBuilder } from "./dynamo/DynamoShapeBuilder";

export function main(mediaUri: string) {
    TextToSVG.load(`${mediaUri}/font/RobotoMono.ttf`, (err: any, tts: TextToSVG | null) => {
        if (err || tts == null) {
            console.error(`Error while loading opentype text: ${err} | ${tts}`);
            return;
        }
        buildVisualization("dynamo-svg", tts);
    });
}

function buildVisualization(svgId: string, tts: TextToSVG) {
    const builder = new DynamoShapeBuilder(`#${svgId}`, tts);
    builder.addCameraHandlers();
    const visualizer = new DynamoDiagramVisualizer(builder);

    let entity: EntityDescription = {
        name: "SomeEntity",
        slots: [
            {
                name: "SomeSlot",
                type: "slot",
                relation: SlotRelationship.CLONE,
                constraints: [
                    { name: "$T", value: "Bool" },
                    { name: "$C", value: "1" },
                ],
            },
            {
                name: "SomeOtherSlot",
                type: "slot",
                value: { text: "23" },
                relation: SlotRelationship.SPECIALIZE,
                constraints: [
                    { name: "$T", value: "Number" },
                    { name: "$C", value: "0..INF" },
                ],
            },
            {
                name: "NewSlotWithAKind",
                type: "slot",
                value: { text: "$SomeVal", new: true },
                relation: SlotRelationship.PARTITION,
                expanded: true,
                constraints: [
                    { name: "$T", value: "$SomeValType" },
                    { name: "$C", value: "0..1" },
                ],
            },
            { name: "NumeroTres", type: "slot", value: { text: "#3", new: true }, relation: SlotRelationship.OMIT },
            { name: "SomeOperation", type: "validation" },
            { name: "SomeOperation2", type: "validation" },
        ],
    };

    visualizer.addEntity(entity);
}

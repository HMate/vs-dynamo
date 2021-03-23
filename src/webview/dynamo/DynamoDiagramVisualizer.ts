import "@svgdotjs/svg.draggable.js";

import { DiagramDescription, EntityDescription } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";
import "./webview-style.scss";
import { DynamoEntity } from "./DynamoEntity";

export class DynamoDiagramVisualizer {
    constructor(private readonly builder: DynamoShapeBuilder) {}

    public createDiagram(desc: DiagramDescription) {
        let yOffset = 0;
        for (const entityDesc of desc.entities) {
            let entity = new DynamoEntity(this.builder, entityDesc);
            let root = entity.getRoot();
            if (root == null) {
                continue;
            }
            root.y(yOffset);
            yOffset += root.height() + 20;
        }
    }

    public addEntity(desc: EntityDescription) {
        // TODO: Expand validations
        // TODO: Layout multiple entities
        // TODO: Entity inheritance arrows
        // TODO: Entity containment arrows

        let entity = new DynamoEntity(this.builder, desc);
    }
}

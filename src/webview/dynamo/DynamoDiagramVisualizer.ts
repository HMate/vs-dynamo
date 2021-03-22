import "@svgdotjs/svg.draggable.js";

import { EntityDescription } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";
import "./webview-style.scss";
import { DynamoEntity } from "./DynamoEntity";

export class DynamoDiagramVisualizer {
    constructor(private readonly builder: DynamoShapeBuilder) {}

    public addEntity(desc: EntityDescription) {
        // TODO: Expand validations
        // TODO: Resize width/height based on number of slots, slot text
        // TODO: constraints
        // TODO: Layout multiple entities
        // TODO: Entity inheritance arrows
        // TODO: Entity containment arrows

        let entity = new DynamoEntity(this.builder, desc);
    }
}

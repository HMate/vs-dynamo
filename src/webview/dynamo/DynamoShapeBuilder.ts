import { SvgVisualizationBuilder } from "../SvgVisualizationBuilder";
import TextToSVG from "../TextToSvg";
import { DynamoConstraintHolderShape } from "./DynamoConstraintHolderShape";
import DynamoHexagon from "./DynamoHexagon";

export class DynamoShapeBuilder extends SvgVisualizationBuilder {
    constructor(rootId: string, readonly textToSVG: TextToSVG) {
        super(rootId);
    }

    public createHexagon(): DynamoHexagon {
        let hexagon = new DynamoHexagon(75, 40, 10);
        this.addChildToRoot(hexagon);
        return hexagon;
    }

    public createConstraintHolder(): DynamoConstraintHolderShape {
        let holder = new DynamoConstraintHolderShape(250, 100, 15);
        return holder;
    }
}

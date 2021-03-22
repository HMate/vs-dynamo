import { SvgVisualizationBuilder } from "../SvgVisualizationBuilder";
import TextToSVG from "../TextToSvg";
import { DynamoConstraintHolder } from "./DynamoConstraintHolder";
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

    public createConstraintHolder(): DynamoConstraintHolder {
        let holder = new DynamoConstraintHolder(250, 100, 15);
        return holder;
    }
}

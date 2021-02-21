import { SvgGroup } from "../svgElements/SvgGroup";
import { SvgVisualizationBuilder } from "../SvgVisualizationBuilder";
import { Point } from "../utils";
import { SvgHexagon } from "./SvgHexagon";

export class SvgShapeBuilder {
    constructor(private readonly builder: SvgVisualizationBuilder) {}

    public createHexagon(): SvgHexagon {
        let valueSlot = this.builder.createPolygon(this.createHexagonShape(75, 40, 10));
        let hexagon = new SvgHexagon(valueSlot);
        this.builder.addChildToRoot(hexagon);
        this.builder.addChildToGroup(hexagon, valueSlot);
        return hexagon;
    }

    private createHexagonShape(width: number, height: number, steep: number): Array<Point> {
        let widthHalf = width / 2;
        let heightHalf = height / 2;
        return [
            [0, heightHalf],
            [steep, 0],
            [width - steep, 0],
            [width, heightHalf],
            [width - steep, height],
            [steep, height],
        ];
    }
}

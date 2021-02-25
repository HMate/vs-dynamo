import { SingleEntryPlugin } from "webpack";
import { SvgGroup } from "../svgElements/SvgGroup";
import { SvgVisualizationBuilder } from "../SvgVisualizationBuilder";
import { addPoint, Point } from "../utils";
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

    public createConstraintHolder(): SvgGroup {
        let group = this.builder.createGroup();
        let shape = this.builder.createPolygon(this.createConstraintHolderShape(250, 100, 15));
        this.builder.addChildToRoot(group);
        this.builder.addChildToGroup(group, shape);
        return group;
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

    private createConstraintHolderShape(width: number, height: number, arcRad: number): Array<Point> {
        let arcGen = (rad: number, offset: Point): [number, number] => {
            return addPoint([Math.cos(rad) * arcRad, -Math.sin(rad) * arcRad], offset);
        };
        let PIHalf = Math.PI / 2;
        let points: Array<Point> = [
            [0, 0],
            [0, height - arcRad],
            arcGen(Math.PI + PIHalf / 5, [arcRad, height - arcRad]),
            arcGen(Math.PI + (2 * PIHalf) / 5, [arcRad, height - arcRad]),
            arcGen(Math.PI + (3 * PIHalf) / 5, [arcRad, height - arcRad]),
            arcGen(Math.PI + (4 * PIHalf) / 5, [arcRad, height - arcRad]),
            [arcRad, height],
            [width - arcRad, height],
            arcGen((3 / 2) * Math.PI + PIHalf / 5, [width - arcRad, height - arcRad]),
            arcGen((3 / 2) * Math.PI + (2 * PIHalf) / 5, [width - arcRad, height - arcRad]),
            arcGen((3 / 2) * Math.PI + (3 * PIHalf) / 5, [width - arcRad, height - arcRad]),
            arcGen((3 / 2) * Math.PI + (4 * PIHalf) / 5, [width - arcRad, height - arcRad]),
            [width, height - arcRad],
            [width, 0],
        ];
        console.log(points);
        return points;
    }
}

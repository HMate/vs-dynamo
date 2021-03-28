import { Box, Svg, Polygon, NumberAlias } from "@svgdotjs/svg.js";
import { addPoint, Point } from "../utils";
import DynamoContainer from "./DynamoContainer";

export class DynamoConstraintHolderShape extends DynamoContainer {
    private polygonChild: Polygon;
    constructor(width: number, height: number, private arcRad: number) {
        super();
        let points = this.createConstraintHolderShape(width, height, arcRad);
        this.polygonChild = this.polygon(points.map((p) => `${p[0]},${p[1]}`).join(" "));
    }

    public bbox(): Box {
        return this.polygonChild.bbox();
    }

    public width(): number;
    public width(width: NumberAlias): this;
    public width(width?: NumberAlias) {
        if (width == null) {
            return this.polygonChild.width();
        }
        let height = this.polygonChild.height();
        this.polygonChild.remove();

        let points = this.createConstraintHolderShape(width as number, height, this.arcRad);
        this.polygonChild = this.polygon(points.map((p) => `${p[0]},${p[1]}`).join(" "));
        this.polygonChild.back();

        return this;
    }

    public height(): number;
    public height(height: NumberAlias): this;
    public height(height?: NumberAlias) {
        if (height == null) {
            return this.polygonChild.height();
        }
        let width = this.polygonChild.width();
        this.polygonChild.remove();

        let points = this.createConstraintHolderShape(width, height as number, this.arcRad);
        this.polygonChild = this.polygon(points.map((p) => `${p[0]},${p[1]}`).join(" "));
        this.polygonChild.back();

        return this;
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
        return points;
    }
}

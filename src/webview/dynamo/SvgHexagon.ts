import { NumberAlias } from "@svgdotjs/svg.js";
import { G, Polygon, Container, extend as SvgExtend } from "@svgdotjs/svg.js";
import { Point } from "../utils";
export default class DynamoHexagon extends G {
    private polygonChild: Polygon;
    constructor(width: number, height: number, private steep: number) {
        super();
        let points = this.createHexagonShape(width, height, steep);
        this.polygonChild = this.polygon(points.map((p) => `${p[0]},${p[1]}`).join(" "));
    }

    public width(): number;
    public width(width: NumberAlias): this;
    public width(width?: NumberAlias) {
        if (width == null) {
            return this.polygonChild.width();
        }
        let height = this.polygonChild.height();
        this.polygonChild.remove();

        let points = this.createHexagonShape(width as number, height, this.steep);
        this.polygonChild = this.polygon(points.map((p) => `${p[0]},${p[1]}`).join(" "));

        return this;
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

SvgExtend(Container, {
    hexagon: function (width: number, height: number, steep: number) {
        return (this as Container).put(new DynamoHexagon(width, height, steep));
    },
});

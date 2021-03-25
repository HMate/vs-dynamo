import { Path, Marker } from "@svgdotjs/svg.js";
import { addCoord, asString, Coord, direction, mulCoord, negate } from "../utils";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";

export class DynamoArrow {
    private path: Path | undefined;
    private head: Marker | undefined;
    static readonly headLength = 8;
    static readonly headWidth = 12;
    constructor(
        private readonly builder: DynamoShapeBuilder,
        public readonly start: Coord,
        public readonly end: Coord
    ) {
        this.registerDef();
        this.render();
    }

    public getPath() {
        return this.path;
    }

    private registerDef() {
        let defs = this.builder.getDefs();
        this.head = defs.marker(DynamoArrow.headLength, DynamoArrow.headWidth, function (head) {
            head.polygon(`0,0 ${DynamoArrow.headLength},${DynamoArrow.headWidth / 2} 0,${DynamoArrow.headWidth}`);
        });
    }

    public render() {
        let endDirection = direction(this.start, this.end);
        let renderEnd = addCoord(this.end, negate(mulCoord(endDirection, DynamoArrow.headLength + 4)));
        this.path = this.builder.root.path(`M ${asString(this.start)} L ${asString(renderEnd)}`);
        this.path.addClass("dynamo-inherit-arrow");
        if (this.head != null) {
            this.path.marker("end", this.head);
        }
        return this;
    }
}

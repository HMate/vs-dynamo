import { Path, Marker } from "@svgdotjs/svg.js";
import { addCoord, asString, Coord, direction, mulCoord, negate } from "../utils";
import { DynamoEntity } from "./DynamoEntity";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";

export class DynamoArrow {
    private path: Path;
    private head: Marker | undefined;
    static readonly headLength = 8;
    static readonly headWidth = 12;
    constructor(private readonly builder: DynamoShapeBuilder, private start: DynamoEntity, private end: DynamoEntity) {
        this.registerDef();
        this.path = this.builder.root.path();
        this.init().render();
        this.addMovementHandlers();
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

    public init() {
        this.path.addClass("dynamo-inherit-arrow");
        if (this.head != null) {
            this.path.marker("end", this.head);
        }
        return this;
    }

    public render() {
        let startCoord = this.start.getBottomCenter();
        let endCoord = this.end.getTopCenter();
        let endDirection = direction(startCoord, endCoord);
        let renderEnd = addCoord(endCoord, negate(mulCoord(endDirection, DynamoArrow.headLength + 4)));
        this.path.plot(`M ${asString(startCoord)} L ${asString(renderEnd)}`);
        this.path.addClass("dynamo-inherit-arrow");
        if (this.head != null) {
            this.path.marker("end", this.head);
        }
        return this;
    }

    private addMovementHandlers() {
        let cb = (_event: MouseEvent) => {
            this.render();
        };
        this.start.getRoot().on("dragmove.namespace", cb);
        this.end.getRoot().on("dragmove.namespace", cb);
    }
}

import { Container, Text, Rect } from "@svgdotjs/svg.js";
import { ValidationDescription } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";

export class DynamoValidation {
    static readonly slotHeight = 40;
    static readonly defaultMinWidth = 300;
    static readonly nameMarginLeft = 10;
    static readonly nameMarginRight = 10;

    private root: Container | undefined;
    private shapeHolder: Rect | undefined;
    private nameHolder: Text | undefined;
    constructor(private readonly builder: DynamoShapeBuilder, private readonly desc: ValidationDescription) {
        this.render();
    }

    public getRoot() {
        return this.root;
    }

    public getMinWidth(): number {
        let nameMetric = this.builder.textToSVG.getMetrics(this.desc.name, { fontSize: 22 });
        let minWidth = DynamoValidation.nameMarginLeft + nameMetric.width + DynamoValidation.nameMarginRight;
        return minWidth;
    }

    public render() {
        this.root = this.builder.createGroup();
        let shape = this.builder.createRect();
        shape.width(DynamoValidation.defaultMinWidth);
        shape.height(DynamoValidation.slotHeight);
        shape.addClass("dynamo-validation");

        let name = this.builder.createText(this.desc.name);
        name.addClass("dynamo-validation-name");
        name.x(DynamoValidation.nameMarginLeft);

        this.root.add(shape);
        this.root.add(name);

        this.shapeHolder = shape;
        this.nameHolder = name;

        return this;
    }

    public update() {
        return this;
    }

    public resizeWidth(newWidth: number) {
        if (this.shapeHolder == null) {
            return;
        }
        this.shapeHolder.width(newWidth);
    }
}

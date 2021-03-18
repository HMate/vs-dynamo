import { G, Text, Rect } from "@svgdotjs/svg.js";
import { ValidationDescription } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";

export class DynamoValidation {
    private root: G | undefined;
    private shapeHolder: Rect | undefined;
    private nameHolder: Text | undefined;
    constructor(private readonly builder: DynamoShapeBuilder, private readonly desc: ValidationDescription) {
        this.render();
    }

    public getRoot() {
        return this.root;
    }

    public render() {
        this.root = this.builder.createGroup();
        let shape = this.builder.createRect();
        shape.width(300);
        shape.height(40);
        shape.addClass("dynamo-validation");

        let name = this.builder.createText(this.desc.name);
        name.addClass("dynamo-validation-name");
        name.x(10);

        this.root.add(shape);
        this.root.add(name);

        this.shapeHolder = shape;
        this.nameHolder = name;

        return this;
    }
}

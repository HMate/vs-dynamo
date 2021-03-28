import { Svg, Text } from "@svgdotjs/svg.js";
import { ConstraintDescription } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";

export class DynamoConstraint {
    private root: Svg;
    private nameHolder: Text;
    constructor(private readonly builder: DynamoShapeBuilder, private readonly desc: ConstraintDescription) {
        this.root = this.builder.createHexagon();
        this.nameHolder = this.builder.createText(this.createTextContent());
        this.render().update();
    }

    public getRoot() {
        return this.root;
    }

    public render() {
        this.root = this.builder.createHexagon();
        this.root.addClass("dynamo-constraint");

        this.root.add(this.nameHolder);
        this.nameHolder.addClass("dynamo-constraint-text");

        return this;
    }

    public update() {
        let textContent = this.createTextContent();
        let metrics = this.builder.textToSVG.getMetrics(textContent, { fontSize: 22 });
        let minWidth = metrics.width + 34;
        if (this.root.width() < minWidth) {
            this.root.width(minWidth);
        }
        this.nameHolder.cx(this.root.width() / 2);
        this.nameHolder.cy(this.root.height() / 2);

        return this;
    }

    private createTextContent() {
        return `${this.desc.name} : ${this.desc.value}`;
    }
}

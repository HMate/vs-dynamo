import { G, Text } from "@svgdotjs/svg.js";
import { ConstraintDescription } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";

export class DynamoConstraint {
    private root: G | undefined;
    private nameHolder: Text | undefined;
    constructor(private readonly builder: DynamoShapeBuilder, private readonly desc: ConstraintDescription) {
        this.render();
    }

    public getRoot() {
        return this.root;
    }

    public render() {
        this.root = this.builder.createHexagon();
        this.root.addClass("dynamo-constraint");

        let textContent = `${this.desc.name} : ${this.desc.value}`;
        let name = this.builder.createText(textContent);
        this.root.add(name);
        name.addClass("dynamo-constraint-text");
        let metrics = this.builder.textToSVG.getMetrics(textContent, { fontSize: 22 });
        let minWidth = metrics.width + 34;
        if (this.root.width() < minWidth) {
            this.root.width(minWidth);
        }
        name.cx(this.root.width() / 2);

        this.nameHolder = name;
        return this;
    }
}

import { G, Text } from "@svgdotjs/svg.js";
import { ValueDescription } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";

export class DynamoValue {
    private root: G | undefined;
    private nameHolder: Text | undefined;
    constructor(private readonly builder: DynamoShapeBuilder, private readonly desc: ValueDescription) {
        this.render();
    }

    public getRoot() {
        return this.root;
    }

    public render() {
        this.root = this.builder.createHexagon();
        if (this.desc?.new) {
            this.root.addClass("dynamo-slot-filled-value");
        } else {
            this.root.addClass("dynamo-slot-value");
        }

        if (this.desc?.text != null) {
            let visibleText = this.desc.text;
            if (visibleText.includes("\n")) {
                visibleText = visibleText.substring(0, visibleText.indexOf("\n"));
            }
            this.nameHolder = this.builder.createText(visibleText);
            this.nameHolder.addClass("dynamo-slot-value-text");
            let metrics = this.builder.textToSVG.getMetrics(visibleText, { fontSize: 22 });
            let minWidth = metrics.width + 34;
            if (this.root.width() < minWidth) {
                this.root.width(minWidth);
            }
            this.nameHolder.cx(this.root.width() / 2);
            this.root.add(this.nameHolder);
        }
        return this;
    }
}

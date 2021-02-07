import IVisualizationBuilder from "./IVisualizationBuilder";
import { SvgVisualElement } from "./svgElements/SvgVisualElement";
import { SvgRect } from "./svgElements/SvgRect";
import { SvgInHtml } from "./utils";

export class SvgVisualizationBuilder implements IVisualizationBuilder {
    constructor(private readonly root: SvgInHtml) {}

    public drawRect(): SvgRect {
        let child = new SvgRect();
        child.width = 300;
        child.height = 100;
        this.root.appendChild(child.getDomElem());
        return child;
    }
}

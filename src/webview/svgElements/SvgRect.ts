import { Rect } from "../visualizationElements/Rect";
import { SvgVisualElement } from "./SvgVisualElement";

export class SvgRect extends SvgVisualElement implements Rect {
    private rectElem: SVGRectElement;

    constructor() {
        super("rect");
        this.rectElem = this.domElem as SVGRectElement;
    }

    get width(): number {
        return parseFloat(this.rectElem.getAttribute("width") ?? "0");
    }

    set width(value: number) {
        this.rectElem.setAttribute("width", value.toString());
    }

    get height(): number {
        return parseFloat(this.rectElem.getAttribute("height") ?? "0");
    }

    set height(value: number) {
        this.rectElem.setAttribute("height", value.toString());
    }
}

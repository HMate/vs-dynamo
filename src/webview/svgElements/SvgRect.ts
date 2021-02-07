import { Rect } from "../visualizationElements/Rect";
import { SvgVisualElement } from "./SvgVisualElement";

export class SvgRect extends SvgVisualElement implements Rect {
    private rectElem: SVGRectElement;

    constructor() {
        super("rect");
        this.rectElem = this.domElem as SVGRectElement;
    }

    get width(): number {
        return this.getNumberAttribute("width");
    }

    set width(value: number) {
        this.setAttribute("width", value);
    }

    get height(): number {
        return this.getNumberAttribute("height");
    }

    set height(value: number) {
        this.setAttribute("height", value);
    }
}

import { SvgVisualElement } from "./SvgVisualElement";

export class SvgRect extends SvgVisualElement {
    private rectElem: SVGRectElement;

    constructor() {
        super("rect");
        this.rectElem = this.domElem as SVGRectElement;
    }

    get width(): number {
        return parseFloat(this.domElem.style.height);
    }

    set width(value: number) {
        this.setAttribute("width", value);
    }

    get height(): number {
        return parseFloat(this.domElem.style.height);
    }

    set height(value: number) {
        this.setAttribute("height", value);
    }
}

import { SvgVisualElement } from "./SvgVisualElement";

export class SvgGroup extends SvgVisualElement {
    private gElem: SVGGElement;

    constructor() {
        super("g");
        this.gElem = this.domElem as SVGGElement;
    }

    public appendChild(child: SvgVisualElement) {
        this.gElem.appendChild(child.getDomElem());
    }
}

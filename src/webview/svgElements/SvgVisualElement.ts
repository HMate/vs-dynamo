import { SvgInHtml } from "../utils";
import { VisualElement } from "../visualizationElements/VisualElement";

export class SvgVisualElement implements VisualElement {
    protected domElem: SVGElement;

    constructor(elem: string) {
        this.domElem = document.createElementNS("http://www.w3.org/2000/svg", elem) as SVGElement;
    }

    public getDomElem(): SVGElement {
        return this.domElem;
    }

    public addClass(className: string) {
        this.domElem.setAttribute("class", className);
    }
}

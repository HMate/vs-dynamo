import { SvgInHtml } from "../utils";
import { VisualElement } from "../visualizationElements/VisualElement";
import * as _ from "lodash";

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

    public setAttribute(name: string, value: string | number) {
        this.domElem.setAttribute(name, value.toString());
    }

    public getNumberAttribute(name: string, defaultValue: number = 0): number {
        let value = this.domElem.getAttribute(name);
        if (value == null) {
            return defaultValue;
        }
        return parseFloat(value);
    }

    public getAttribute(name: string, defaultValue: string | undefined = undefined): string | undefined {
        let value = this.domElem.getAttribute(name);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }
}

import { transform } from "lodash";
import { SvgVisualElement } from "./SvgVisualElement";

export class SvgGroup extends SvgVisualElement {
    private gElem: SVGGElement;
    private pos = { x: 0, y: 0 };

    constructor() {
        super("g");
        this.gElem = this.domElem as SVGGElement;
    }

    public appendChild(child: SvgVisualElement) {
        this.gElem.appendChild(child.getDomElem());
    }

    get children() {
        return Array.from(this.gElem.children);
    }

    set posX(value: number) {
        this.pos.x = value;
        this.updatePos();
    }

    set posY(value: number) {
        this.pos.y = value;
        this.updatePos();
    }

    get posX(): number {
        return this.pos.x;
    }

    get posY(): number {
        return this.pos.y;
    }

    private updatePos() {
        this.setAttribute("transform", `translate(${this.pos.x},${this.pos.y})`);
    }
}

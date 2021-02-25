import { SvgVisualElement } from "./svgElements/SvgVisualElement";
import { SvgRect } from "./svgElements/SvgRect";
import { Point, SvgInHtml } from "./utils";
import { SvgGroup } from "./svgElements/SvgGroup";
import { SvgText } from "./svgElements/SvgText";
import { SvgPolygon } from "./svgElements/SvgPolygon";
import { SvgCircle } from "./svgElements/SvgCircle";

export class SvgVisualizationBuilder {
    constructor(readonly root: SvgInHtml) {}

    public addChildToGroup(group: SvgGroup, child: SvgVisualElement) {
        group.appendChild(child);
    }

    public addChildToRoot(child: SvgVisualElement) {
        this.root.appendChild(child.getDomElem());
    }

    public removeFromRoot(child: SvgVisualElement) {
        this.root.removeChild(child.getDomElem());
    }

    public createRect(): SvgRect {
        let child = new SvgRect();
        return child;
    }

    public createCircle(): SvgCircle {
        let child = new SvgCircle();
        return child;
    }

    public createGroup(): SvgGroup {
        let child = new SvgGroup();
        this.root.appendChild(child.getDomElem());
        return child;
    }

    public createText(text: string): SvgText {
        let child = new SvgText();
        child.text(text);
        return child;
    }

    /**
     * Polygon coordinate origin is in left-top.
     */
    public createPolygon(points: Array<Point>) {
        let child = new SvgPolygon(points);
        return child;
    }
}

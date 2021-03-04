import { SvgVisualElement } from "./svgElements/SvgVisualElement";
import { SvgRect } from "./svgElements/SvgRect";
import { Point, SvgInHtml } from "./utils";
import { SvgGroup } from "./svgElements/SvgGroup";
import { SvgText } from "./svgElements/SvgText";
import { SvgPolygon } from "./svgElements/SvgPolygon";
import { SvgCircle } from "./svgElements/SvgCircle";
import { SvgRoot } from "./svgElements/SvgRoot";

export class SvgVisualizationBuilder {
    readonly root: SvgRoot;
    constructor(rootElem: SvgInHtml) {
        this.root = new SvgRoot(rootElem);
    }

    public addChildToGroup(group: SvgGroup, child: SvgVisualElement) {
        group.appendChild(child);
    }

    public addChildToRoot(child: SvgVisualElement) {
        this.root.appendChild(child);
    }

    public removeFromRoot(child: SvgVisualElement) {
        this.root.removeChild(child);
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
        this.root.appendChild(child);
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

    public addCameraHandlers() {
        // this.root.addEventListener("zoom", (event) => {
        //     console.log(event.);
        // });
        this.root.getDomElem().onwheel = (event: WheelEvent) => {
            let delta = event.deltaY; // negative: scroll up, pos: scroll down
            let point = { x: event.offsetX, y: event.offsetY };
            this.root.zoom(-delta / 5000, point);
            console.log(`onwheel: ${this.root} ${event.deltaY}`);
        };
    }
}

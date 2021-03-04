import { SvgVisualElement } from "./svgElements/SvgVisualElement";
import { Point, SvgInHtml } from "./utils";
import { SvgText } from "./svgElements/SvgText";
import { SvgPolygon } from "./svgElements/SvgPolygon";
import { SvgCircle } from "./svgElements/SvgCircle";
import { Svg, SVG, Element, Rect, G, Text } from "@svgdotjs/svg.js";
import { Circle } from "@svgdotjs/svg.js";

export class SvgVisualizationBuilder {
    readonly root: Svg;
    constructor(rootId: string) {
        this.root = SVG().addTo(rootId).size("100%", "100%");
    }

    public addChildToGroup(group: G, child: Element) {
        group.add(child);
    }

    public addChildToRoot(child: Element) {
        this.root.add(child);
    }

    public removeFromRoot(child: Element) {
        this.root.removeElement(child);
    }

    public createRect(): Rect {
        return this.root.rect();
    }

    public createCircle(): Circle {
        return this.root.circle();
    }

    public createGroup(): G {
        return this.root.group();
    }

    public createText(text: string): Text {
        return this.root.text(text);
    }

    /**
     * Polygon coordinate origin is in left-top.
     */
    public createPolygon(points: Array<Point>) {
        return this.root.polygon(points.map((p) => `${p[0]},${p[1]}`).join(" "));
    }

    // public addCameraHandlers() {
    //     // this.root.addEventListener("zoom", (event) => {
    //     //     console.log(event.);
    //     // });
    //     this.root.getDomElem().onwheel = (event: WheelEvent) => {
    //         let delta = event.deltaY; // negative: scroll up, pos: scroll down
    //         let point = { x: event.offsetX, y: event.offsetY };
    //         this.root.zoom(-delta / 5000, point);
    //         console.log(`onwheel: ${this.root} ${event.deltaY}`);
    //     };
    // }
}

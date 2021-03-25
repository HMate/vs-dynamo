import { Point } from "./utils";
import { Svg, SVG, Element, Rect, G, Text, Circle } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.panzoom.js";

export class SvgVisualizationBuilder {
    readonly root: Svg;
    constructor(rootId: string) {
        let bodyRect = document?.getElementsByTagName("body")?.item(0)?.getBoundingClientRect();
        let windowSize = { width: 1600, height: 1200 };
        if (bodyRect != null) {
            windowSize = { width: bodyRect.width, height: bodyRect.height };
        }

        this.root = SVG().addTo("body").size(windowSize.width, windowSize.height);
        this.root.id(rootId);
        this.root.addClass("dynamo-svg-root");
        this.root.viewbox(0, 0, windowSize.width, windowSize.height);
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

    public getDefs() {
        return this.root.defs();
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

    public addCameraHandlers() {
        this.root.panZoom({ zoomMin: 0.2, zoomMax: 2, zoomFactor: 0.1 });
    }
}

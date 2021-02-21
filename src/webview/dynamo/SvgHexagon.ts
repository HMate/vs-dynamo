import { SvgGroup } from "../svgElements/SvgGroup";
import { SvgPolygon } from "../svgElements/SvgPolygon";
import { SvgVisualElement } from "../svgElements/SvgVisualElement";

export class SvgHexagon extends SvgGroup {
    constructor(readonly polygon: SvgPolygon) {
        super();
    }

    get width(): number {
        return this.polygon.width;
    }

    get height(): number {
        return this.polygon.height;
    }
}

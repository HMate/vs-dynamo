import { Svg, NumberAlias } from "@svgdotjs/svg.js";

export default class DynamoContainer extends Svg {
    constructor() {
        super();
        //removeNamespace
        const xmlns = "http://www.w3.org/2000/xmlns/";
        this.attr({ xmlns: null, version: null }).attr("xmlns:xlink", null).attr("xmlns:svgjs", null);
    }

    public width(): number;
    public width(width: NumberAlias): this;
    public width(width?: NumberAlias) {
        if (width == null) {
            return this.bbox().width;
        }
        return super.width(width);
    }

    public height(): number;
    public height(height: NumberAlias): this;
    public height(height?: NumberAlias) {
        if (height == null) {
            return this.bbox().height;
        }
        return super.height(height);
    }
}

import { SvgVisualElement } from "./svgElements/SvgVisualElement";
import { SvgRect } from "./svgElements/SvgRect";
import { SvgInHtml } from "./utils";
import { SvgGroup } from "./svgElements/SvgGroup";

export class SvgVisualizationBuilder {
    constructor(private readonly root: SvgInHtml) {
        //this.root.setAttribute("width");
    }

    public createRect(): SvgRect {
        let child = new SvgRect();
        return child;
    }

    public createGroup(): SvgGroup {
        let child = new SvgGroup();
        this.root.appendChild(child.getDomElem());
        return child;
    }

    public addChildToGroup(group: SvgGroup, child: SvgVisualElement) {
        group.appendChild(child);
    }

    public addChildToRoot(child: SvgVisualElement) {
        this.root.appendChild(child.getDomElem());
    }
}

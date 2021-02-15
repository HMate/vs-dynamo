import { SvgVisualElement } from "./svgElements/SvgVisualElement";
import { SvgRect } from "./svgElements/SvgRect";
import { SvgInHtml } from "./utils";
import { SvgGroup } from "./svgElements/SvgGroup";
import { SvgText } from "./svgElements/SvgText";

export class SvgVisualizationBuilder {
    constructor(readonly root: SvgInHtml) {}

    public createRect(): SvgRect {
        let child = new SvgRect();
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

    public addChildToGroup(group: SvgGroup, child: SvgVisualElement) {
        group.appendChild(child);
    }

    public addChildToRoot(child: SvgVisualElement) {
        this.root.appendChild(child.getDomElem());
    }
}

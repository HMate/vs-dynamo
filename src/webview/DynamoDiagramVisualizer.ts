import { SvgVisualizationBuilder } from "./SvgVisualizationBuilder";
import "./webview-style.scss";

export class DynamoDiagramVisualizer {
    constructor(private readonly builder: SvgVisualizationBuilder) {}

    public addEntity() {
        let group = this.builder.createGroup();
        let entity = this.builder.createRect();
        entity.width = 300;
        entity.height = 300;
        entity.setAttribute("rx", 15);
        entity.addClass("dynamo-entity");

        let slot = this.addSlot();
        slot.setAttribute("y", 100);

        this.builder.addChildToRoot(group);
        this.builder.addChildToGroup(group, entity);
        this.builder.addChildToGroup(group, slot);
    }

    public addSlot() {
        let slot = this.builder.createRect();
        slot.width = 300;
        slot.height = 100;
        slot.addClass("dynamo-slot");
        return slot;
    }
}

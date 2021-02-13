import { SvgGroup } from "./svgElements/SvgGroup";
import { SvgVisualizationBuilder } from "./SvgVisualizationBuilder";
import "./webview-style.scss";

export class DynamoDiagramVisualizer {
    constructor(private readonly builder: SvgVisualizationBuilder) {}

    public addEntity() {
        // NOTE for coordinates: origin is in left-bottom

        let group = this.builder.createGroup();
        let entity = this.builder.createRect();
        entity.width = 300;
        entity.height = 300;
        entity.setAttribute("rx", 15);
        entity.addClass("dynamo-entity");

        let entityName = this.builder.createText("SomeEntity");
        entityName.addClass("dynamo-entity-name");
        entityName.posY(30);
        entityName.posX(entity.width / 2);

        this.builder.addChildToRoot(group);
        this.builder.addChildToGroup(group, entity);
        this.builder.addChildToGroup(group, entityName);

        const slotHeight = 40;
        let slot = this.createSlot("SomeSlot");
        slot.posY(50);
        this.builder.addChildToGroup(group, slot);

        let slot2 = this.createSlot("SomeOtherSlot");
        slot2.posY(slotHeight + 50);
        this.builder.addChildToGroup(group, slot2);
    }

    private createSlot(name: string): SvgGroup {
        let group = this.builder.createGroup();
        let slot = this.builder.createRect();
        slot.width = 300;
        slot.height = 40;
        slot.addClass("dynamo-slot");

        let slotName = this.builder.createText(name);
        slotName.addClass("dynamo-slot-name");
        slotName.posY(28);
        slotName.posX(10);

        this.builder.addChildToGroup(group, slot);
        this.builder.addChildToGroup(group, slotName);

        return group;
    }
}

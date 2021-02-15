import { SvgGroup } from "./svgElements/SvgGroup";
import { SvgRect } from "./svgElements/SvgRect";
import { SvgVisualizationBuilder } from "./SvgVisualizationBuilder";
import { Point } from "./utils";
import "./webview-style.scss";

const enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
    SIDE_BACK = 3,
    SIDE_FORWARD = 4,
}

const enum MouseButtons {
    LEFT = 1,
    MIDDLE = 2,
    RIGHT = 4,
    SIDE_BACK = 8,
    SIDE_FORWARD = 16,
}

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
        entityName.posY = 30;
        entityName.posX = entity.width / 2;

        this.builder.addChildToRoot(group);
        this.builder.addChildToGroup(group, entity);
        this.builder.addChildToGroup(group, entityName);

        this.addEntityMovementHandlers(group, entity);

        // Add slots
        const slotHeight = 40;
        let slot = this.createSlot("SomeSlot");
        slot.posY = 50;
        this.builder.addChildToGroup(group, slot);

        let slot2 = this.createSlot("SomeOtherSlot");
        slot2.posY = slotHeight + 50;
        this.builder.addChildToGroup(group, slot2);

        let op = this.createValidation("SomeOperation");
        op.posY = slotHeight * 2 + 50;
        this.builder.addChildToGroup(group, op);
    }

    private addEntityMovementHandlers(group: SvgGroup, entity: SvgRect) {
        let hasMouse = false;
        let pivot = { x: 0, y: 0 };
        entity.getDomElem().onmousedown = (e: MouseEvent) => {
            if (e.button == MouseButton.LEFT) {
                hasMouse = true;
                pivot = { x: e.offsetX - group.posX, y: e.offsetY - group.posY };
            }
        };

        entity.getDomElem().onmouseup = (e: MouseEvent) => {
            if (e.button == MouseButton.LEFT) {
                hasMouse = false;
            }
        };

        this.builder.root.onmousemove = (e: MouseEvent) => {
            if (hasMouse) {
                group.posX = e.offsetX - pivot.x;
                group.posY = e.offsetY - pivot.y;
            }
        };
    }

    private createSlot(name: string): SvgGroup {
        let group = this.builder.createGroup();
        let slot = this.builder.createRect();
        this.builder.addChildToGroup(group, slot);
        slot.width = 300;
        slot.height = 40;
        slot.addClass("dynamo-slot");

        let slotName = this.builder.createText(name);
        this.builder.addChildToGroup(group, slotName);
        slotName.addClass("dynamo-slot-name");
        slotName.posY = 28;
        slotName.posX = 10;

        let valueSlot = this.builder.createPolygon(this.createHexagonShape(75, 40, 10));
        valueSlot.addClass("dynamo-slot-value");
        this.builder.addChildToGroup(group, valueSlot);
        valueSlot.posX = slot.width - valueSlot.width;

        return group;
    }

    private createHexagonShape(width: number, height: number, steep: number): Array<Point> {
        let widthHalf = width / 2;
        let heightHalf = height / 2;
        return [
            [0, heightHalf],
            [steep, 0],
            [width - steep, 0],
            [width, heightHalf],
            [width - steep, height],
            [steep, height],
        ];
    }

    private createValidation(name: string): SvgGroup {
        let group = this.builder.createGroup();
        let slot = this.builder.createRect();
        slot.width = 300;
        slot.height = 40;
        slot.addClass("dynamo-validation");

        let slotName = this.builder.createText(name);
        slotName.addClass("dynamo-validation-name");
        slotName.posY = 28;
        slotName.posX = 10;

        this.builder.addChildToGroup(group, slot);
        this.builder.addChildToGroup(group, slotName);

        return group;
    }
}

import { SvgGroup } from "../svgElements/SvgGroup";
import { SvgPolygon } from "../svgElements/SvgPolygon";
import { SvgRect } from "../svgElements/SvgRect";
import { SvgVisualizationBuilder } from "../SvgVisualizationBuilder";
import { Point } from "../utils";
import { SvgShapeBuilder } from "./ShapeBuilder";
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

interface ValueDescription {
    text: string;
    new?: boolean;
}

interface SlotDescription {
    name: string;
    type: "slot" | "validation";
    value?: ValueDescription;
}

export class DynamoDiagramVisualizer {
    private readonly dynamoShapeBuilder: SvgShapeBuilder;

    constructor(private readonly builder: SvgVisualizationBuilder) {
        this.dynamoShapeBuilder = new SvgShapeBuilder(builder);
    }

    public addEntity() {
        // TODO: Icons
        // TODO: Expand slots/validations
        // TODO: Resize width/height based on number of slots, slot text
        // TODO: constraints

        // TODO: Layout multiple entities
        // TODO: Entity inheritance arrows
        // TODO: Entity containment arrows

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

        const slots: SlotDescription[] = [
            { name: "SomeSlot", type: "slot" },
            { name: "SomeOtherSlot", type: "slot", value: { text: "23" } },
            { name: "NumeroTres", type: "slot", value: { text: "23", new: true } },
            { name: "SomeOperation", type: "validation" },
            { name: "SomeOperation2", type: "validation" },
        ];
        this.createSlots(group, slots);
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

    private createSlots(entityGroup: SvgGroup, slots: SlotDescription[]) {
        const slotHeight = 40;
        let currentPosY = 50; // starting from bottom of entity name label
        for (const desc of slots) {
            let slot: SvgGroup;
            if (desc.type === "slot") {
                slot = this.createSlot(desc.name, desc.value);
            } else {
                slot = this.createValidation(desc.name);
            }
            slot.posY = currentPosY;
            this.builder.addChildToGroup(entityGroup, slot);
            currentPosY += slotHeight;
        }
    }

    private createSlot(name: string, value?: ValueDescription): SvgGroup {
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

        let valueSlot = this.createSlotValue(value);
        this.builder.addChildToGroup(group, valueSlot);
        valueSlot.posX = slot.width - valueSlot.width;

        return group;
    }

    private createSlotValue(value?: ValueDescription): SvgGroup {
        let valueSlot = this.dynamoShapeBuilder.createHexagon();
        if (value?.new) {
            valueSlot.addClass("dynamo-slot-filled-value");
        } else {
            valueSlot.addClass("dynamo-slot-value");
        }

        if (value?.text != null) {
            let valueText = this.builder.createText(value?.text);
            this.builder.addChildToGroup(valueSlot, valueText);
            valueText.addClass("dynamo-slot-value-text");
            valueText.posY = 28;
            valueText.posX = valueSlot.width / 2;
        }
        return valueSlot;
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

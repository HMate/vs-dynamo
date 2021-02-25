import { SvgGroup } from "../svgElements/SvgGroup";
import { SvgPolygon } from "../svgElements/SvgPolygon";
import { SvgRect } from "../svgElements/SvgRect";
import { SvgText } from "../svgElements/SvgText";
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

const enum SlotRelationship {
    CLONE = "clone",
    OMIT = "omit",
    SPECIALIZE = "specialize",
    PARTITION = "partition",
}

interface ValueDescription {
    text: string;
    new?: boolean;
}

interface ConstraintDescription {
    name: string;
}

interface AbstractSlotDescription {
    name: string;
    type: "slot" | "validation";
}

interface SlotDescription extends AbstractSlotDescription {
    type: "slot";
    relation: SlotRelationship;
    value?: ValueDescription;
}

interface ValidationDescription extends AbstractSlotDescription {
    type: "validation";
    value?: ValueDescription;
}

export class DynamoDiagramVisualizer {
    private readonly dynamoShapeBuilder: SvgShapeBuilder;

    constructor(private readonly builder: SvgVisualizationBuilder) {
        this.dynamoShapeBuilder = new SvgShapeBuilder(builder);
    }

    public addEntity() {
        // TODO: Expand slots/validations
        // TODO: Zoom, pan camera
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

        const slots: Array<SlotDescription | ValidationDescription> = [
            { name: "SomeSlot", type: "slot", relation: SlotRelationship.CLONE },
            { name: "SomeOtherSlot", type: "slot", value: { text: "23" }, relation: SlotRelationship.SPECIALIZE },
            {
                name: "NewSlot",
                type: "slot",
                value: { text: "$SomeVal", new: true },
                relation: SlotRelationship.PARTITION,
            },
            { name: "NumeroTres", type: "slot", value: { text: "#3", new: true }, relation: SlotRelationship.OMIT },
            { name: "SomeOperation", type: "validation" },
            { name: "SomeOperation2", type: "validation" },
        ];
        this.createSlots(group, slots);
        entity.height = group.height + 30;
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

    private createSlots(entityGroup: SvgGroup, slots: Array<SlotDescription | ValidationDescription>) {
        let currentPosY = 50; // starting from bottom of entity name label
        for (const desc of slots) {
            let slot: SvgGroup;
            if (desc.type === "slot") {
                slot = this.createSlot(desc);
            } else {
                slot = this.createValidation(desc.name);
            }
            slot.posY = currentPosY;
            this.builder.addChildToGroup(entityGroup, slot);
            currentPosY += slot.height;
        }
    }

    private createSlot(desc: SlotDescription): SvgGroup {
        let group = this.builder.createGroup();
        let slot = this.builder.createRect();
        this.builder.addChildToGroup(group, slot);
        slot.width = 300;
        slot.height = 40;
        slot.addClass("dynamo-slot");

        let icon = this.createSlotIcon(desc.relation);
        this.builder.addChildToGroup(group, icon);

        let slotName = this.builder.createText(desc.name);
        this.builder.addChildToGroup(group, slotName);
        slotName.addClass("dynamo-slot-name");
        slotName.posY = 28;
        slotName.posX = 10 + icon.width;

        let valueSlot = this.createSlotValue(desc.value);
        this.builder.addChildToGroup(group, valueSlot);
        valueSlot.posX = slot.width - valueSlot.width;

        let cholder = this.createSlotConstraintHolder([]);
        cholder.posX = 25;
        cholder.posY = slot.height;
        this.builder.addChildToGroup(group, cholder);

        return group;
    }

    private createSlotConstraintHolder(constraints: Array<ConstraintDescription>) {
        let holder = this.dynamoShapeBuilder.createConstraintHolder();
        holder.addClass("dynamo-constraint-holder");
        return holder;
    }

    private createSlotIcon(relationship: SlotRelationship): SvgGroup {
        let group = this.builder.createGroup();
        group.addClass("dynamo-slot-icon");
        let icon = this.builder.createCircle();
        icon.radius = 20;
        icon.posX = icon.radius;
        icon.posY = icon.radius;
        let iconText: SvgText;
        switch (relationship) {
            case SlotRelationship.CLONE:
                iconText = this.builder.createText("C");
                icon.addClass("dynamo-slot-icon-clone");
                break;
            case SlotRelationship.OMIT:
                iconText = this.builder.createText("O");
                icon.addClass("dynamo-slot-icon-omit");
                break;
            case SlotRelationship.SPECIALIZE:
                iconText = this.builder.createText("S");
                icon.addClass("dynamo-slot-icon-specialize");
                break;
            case SlotRelationship.PARTITION:
            default:
                iconText = this.builder.createText("P");
                icon.addClass("dynamo-slot-icon-partition");
                break;
        }
        this.builder.addChildToGroup(group, icon);
        this.builder.addChildToGroup(group, iconText);
        iconText.posX = icon.radius;
        iconText.posY = icon.radius + iconText.height / 4;
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

import { G, Rect, Text } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";

import { MouseButton } from "../utils";
import {
    ConstraintDescription,
    EntityDescription,
    SlotDescription,
    SlotList,
    SlotRelationship,
    ValueDescription,
} from "./Descriptors";
import { DynamoShapeBuilder } from "./ShapeBuilder";
import TextToSVG from "../TextToSvg";
import "./webview-style.scss";

export class DynamoDiagramVisualizer {
    constructor(private readonly builder: DynamoShapeBuilder, private textToSVG: TextToSVG) {}

    public addEntity(desc: EntityDescription) {
        // TODO: Expand validations
        // TODO: Resize width/height based on number of slots, slot text
        // TODO: constraints
        // TODO: Layout multiple entities
        // TODO: Entity inheritance arrows
        // TODO: Entity containment arrows
        // NOTE for coordinates: origin is in left-bottom

        this.createEntity(desc);
    }

    private createEntity(desc: EntityDescription) {
        let group = this.builder.createGroup();
        let entity = this.builder.createRect();
        entity.width(300);
        entity.height(300);
        entity.radius(15);
        entity.addClass("dynamo-entity");

        let entityName = this.builder.createText(desc.name);
        entityName.addClass("dynamo-entity-name");
        entityName.center(entity.width() / 2, 10);

        this.builder.addChildToRoot(group);
        group.add(entity);
        group.add(entityName);

        this.addEntityMovementHandlers(group);

        this.createSlots(group, desc.slots);
        entity.height(group.height() + 30);

        this.addSlotExpansionHandlers(group, desc);
        return group;
    }

    private addEntityMovementHandlers(group: G) {
        group.draggable();
    }

    private addSlotExpansionHandlers(entityGroup: G, entityDesc: EntityDescription) {
        for (const child of entityGroup.children()) {
            let elems = child.find(".dynamo-slot");

            if (elems.length > 0) {
                let rectElem = child.findOne("rect") as Rect;
                if (rectElem == null) return;
                rectElem.click(() => {
                    let nameElem = child.findOne(".dynamo-slot-name") as Text;
                    let name = nameElem?.text() ?? "";

                    for (const slot of entityDesc.slots) {
                        if (slot.type == "slot" && slot.name === name) {
                            slot.expanded = !slot.expanded;
                        }
                    }

                    let entity = this.createEntity(entityDesc);
                    entity.move(entityGroup.x(), entityGroup.y());
                    this.builder.removeFromRoot(entityGroup);
                    this.builder.addChildToRoot(entity);
                });
            }
        }
    }

    private createSlots(entityGroup: G, slots: SlotList) {
        let currentPosY = 50; // starting from bottom of entity name label
        for (const desc of slots) {
            let slot: G;
            if (desc.type === "slot") {
                slot = this.createSlot(desc);
            } else {
                slot = this.createValidation(desc.name);
            }
            slot.y(currentPosY);
            entityGroup.add(slot);
            currentPosY += slot.height();
        }
    }

    private createSlot(desc: SlotDescription): G {
        let group = this.builder.createGroup();
        let slot = this.builder.createRect();
        group.add(slot);
        slot.width(300);
        slot.height(40);
        slot.addClass("dynamo-slot");

        let icon = this.createSlotIcon(desc.relation);
        group.add(icon);

        let slotName = this.builder.createText(desc.name);
        group.add(slotName);
        slotName.addClass("dynamo-slot-name");
        slotName.x(10 + icon.width());

        let valueSlot = this.createSlotValue(desc.value);
        group.add(valueSlot);
        valueSlot.x(slot.width() - valueSlot.width());

        if (desc.expanded) {
            let cholder = this.createSlotConstraintHolder([]);
            cholder.move(25, slot.height());
            group.add(cholder);
        }
        return group;
    }

    private createSlotConstraintHolder(constraints: Array<ConstraintDescription>) {
        let holder = this.builder.createConstraintHolder();
        holder.addClass("dynamo-constraint-holder");
        return holder;
    }

    private createSlotIcon(relationship: SlotRelationship): G {
        let group = this.builder.createGroup();
        group.addClass("dynamo-slot-icon");
        let icon = this.builder.createCircle();
        let rad = 20;
        icon.radius(rad);
        icon.center(rad, rad);
        let iconText: Text;
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
        group.add(icon);
        group.add(iconText);
        iconText.cx(rad);
        return group;
    }

    private createSlotValue(value?: ValueDescription): G {
        let valueSlot = this.builder.createHexagon();
        if (value?.new) {
            valueSlot.addClass("dynamo-slot-filled-value");
        } else {
            valueSlot.addClass("dynamo-slot-value");
        }

        if (value?.text != null) {
            let valueText = this.builder.createText(value.text);
            valueText.addClass("dynamo-slot-value-text");
            let metrics = this.textToSVG.getMetrics(value.text, { fontSize: 22 });
            let minWidth = metrics.width + 34;
            if (valueSlot.width() < minWidth) {
                valueSlot.width(minWidth);
            }
            valueText.cx(valueSlot.width() / 2);
            valueSlot.add(valueText);
        }
        return valueSlot;
    }

    private createValidation(name: string): G {
        let group = this.builder.createGroup();
        let slot = this.builder.createRect();
        slot.width(300);
        slot.height(40);
        slot.addClass("dynamo-validation");

        let slotName = this.builder.createText(name);
        slotName.addClass("dynamo-validation-name");
        slotName.x(10);

        group.add(slot);
        group.add(slotName);

        return group;
    }
}

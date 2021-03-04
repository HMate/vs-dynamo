import { G, Rect, Text } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { SvgGroup } from "../svgElements/SvgGroup";
import { SvgRect } from "../svgElements/SvgRect";
import { SvgText } from "../svgElements/SvgText";
import { SvgVisualizationBuilder } from "../SvgVisualizationBuilder";
import { MouseButton } from "../utils";
import {
    ConstraintDescription,
    EntityDescription,
    SlotDescription,
    SlotList,
    SlotRelationship,
    ValueDescription,
} from "./Descriptors";
import { SvgShapeBuilder } from "./ShapeBuilder";
import "./webview-style.scss";
import TextToSVG from "../TextToSvg";

export class DynamoDiagramVisualizer {
    private readonly dynamoShapeBuilder: SvgShapeBuilder;

    constructor(private readonly builder: SvgVisualizationBuilder, private textToSVG: TextToSVG) {
        this.dynamoShapeBuilder = new SvgShapeBuilder(builder);
    }

    public addEntity(desc: EntityDescription) {
        // TODO: Expand validations
        // TODO: Zoom, pan camera
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
        this.builder.addChildToGroup(group, entity);
        this.builder.addChildToGroup(group, entityName);

        this.addEntityMovementHandlers(group);

        this.createSlots(group, desc.slots);
        entity.height(group.height() + 30);

        // this.addSlotExpansionHandlers(group, desc);
        return group;
    }

    private addEntityMovementHandlers(group: G) {
        group.draggable();
    }

    // private addSlotExpansionHandlers(entityGroup: SvgGroup, entityDesc: EntityDescription) {
    //     for (const child of entityGroup.children) {
    //         let elems = Array.from(child.getElementsByClassName("dynamo-slot"));

    //         if (elems.length > 0) {
    //             let rectElem = (child as SVGGElement).getElementsByTagName("rect").item(0);
    //             if (rectElem == null) return;
    //             rectElem.onclick = () => {
    //                 let nameElem = child.getElementsByClassName("dynamo-slot-name").item(0);
    //                 let name = nameElem?.textContent ?? "";

    //                 for (const slot of entityDesc.slots) {
    //                     if (slot.type == "slot" && slot.name == name) {
    //                         console.log(`slot change`);
    //                         slot.expanded = !slot.expanded;
    //                     }
    //                 }

    //                 let entity = this.createEntity(entityDesc);
    //                 entity.posX = entityGroup.posX;
    //                 entity.posY = entityGroup.posY;
    //                 this.builder.removeFromRoot(entityGroup);
    //                 this.builder.addChildToRoot(entity);
    //             };
    //         }
    //     }
    // }

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
            this.builder.addChildToGroup(entityGroup, slot);
            currentPosY += slot.height();
        }
    }

    private createSlot(desc: SlotDescription): G {
        let group = this.builder.createGroup();
        let slot = this.builder.createRect();
        this.builder.addChildToGroup(group, slot);
        slot.width(300);
        slot.height(40);
        slot.addClass("dynamo-slot");

        let icon = this.createSlotIcon(desc.relation);
        this.builder.addChildToGroup(group, icon);

        let slotName = this.builder.createText(desc.name);
        this.builder.addChildToGroup(group, slotName);
        slotName.addClass("dynamo-slot-name");
        slotName.x(10 + icon.width());

        let valueSlot = this.createSlotValue(desc.value);
        this.builder.addChildToGroup(group, valueSlot);
        valueSlot.x(slot.width() - valueSlot.width());

        // if (desc.expanded) {
        //     let cholder = this.createSlotConstraintHolder([]);
        //     cholder.posX = 25;
        //     cholder.posY = slot.height;
        //     this.builder.addChildToGroup(group, cholder);
        // }
        return group;
    }

    // private createSlotConstraintHolder(constraints: Array<ConstraintDescription>) {
    //     let holder = this.dynamoShapeBuilder.createConstraintHolder();
    //     holder.addClass("dynamo-constraint-holder");
    //     return holder;
    // }

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
        this.builder.addChildToGroup(group, icon);
        this.builder.addChildToGroup(group, iconText);
        iconText.cx(rad);
        return group;
    }

    private createSlotValue(value?: ValueDescription): G {
        let valueSlot = this.dynamoShapeBuilder.createHexagon();
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
            this.builder.addChildToGroup(valueSlot, valueText);
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
        slotName.move(10, 28);

        this.builder.addChildToGroup(group, slot);
        this.builder.addChildToGroup(group, slotName);

        return group;
    }
}

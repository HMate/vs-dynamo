import "@svgdotjs/svg.draggable.js";
import { Container, Rect, Text } from "@svgdotjs/svg.js";
import { Coord } from "../utils";
import { EntityDescription, SlotList } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";
import { DynamoSlot } from "./DynamoSlot";
import { DynamoValidation } from "./DynamoValidation";

export class DynamoEntity {
    static readonly defaultMinWidth = 300;
    static readonly defaultHeight = 60;
    static readonly nameBoxHeight = 50;
    static readonly footerHeight = 30;
    static readonly nameMarginTop = 20;

    private root: Container;
    private shapeHolder: Rect;
    private nameHolder: Text;
    private slots: Array<DynamoSlot | DynamoValidation> = [];
    constructor(private readonly builder: DynamoShapeBuilder, private desc: EntityDescription) {
        this.root = this.builder.createGroup();
        this.shapeHolder = this.builder.createRect();
        this.nameHolder = this.builder.createText(this.desc.name);
        this.render().update();
    }

    get description(): EntityDescription {
        return this.desc;
    }

    set description(desc: EntityDescription) {
        this.desc = desc;
    }

    public getRoot() {
        return this.root;
    }

    public getBottomCenter(): Coord {
        return { x: this.root.cx(), y: this.root.y() + this.root.height() };
    }

    public getTopCenter(): Coord {
        return { x: this.root.cx(), y: this.root.y() };
    }

    private render() {
        this.shapeHolder.width(DynamoEntity.defaultMinWidth);
        this.shapeHolder.height(DynamoEntity.defaultHeight);
        this.shapeHolder.radius(15);
        this.shapeHolder.addClass("dynamo-entity");

        this.nameHolder.addClass("dynamo-entity-name");

        this.builder.addChildToRoot(this.root);
        this.root.add(this.shapeHolder);
        this.root.add(this.nameHolder);

        this.addEntityMovementHandlers(this.root);

        this.createSlots(this.root, this.desc.slots);
        this.addSlotExpansionHandlers(this.root, this.desc);
        return this;
    }

    public update() {
        let [minWidth, slotsHeight] = this.resizeSlots();
        this.nameHolder.text(this.desc.name);

        this.shapeHolder.height(slotsHeight + DynamoEntity.nameBoxHeight + DynamoEntity.footerHeight);
        this.shapeHolder.width(minWidth);
        this.nameHolder.center(this.shapeHolder.width() / 2, DynamoEntity.nameMarginTop);
        return this;
    }

    private addEntityMovementHandlers(group: Container) {
        group.draggable();
    }

    private addSlotExpansionHandlers(entityGroup: Container, entityDesc: EntityDescription) {
        for (const slot of this.slots) {
            if (slot instanceof DynamoSlot) {
                slot.click(() => {
                    slot.description.expanded = !slot.description.expanded;
                    this.update();
                });
            }
        }
    }

    private createSlots(entityGroup: Container, slots: SlotList) {
        for (const desc of slots) {
            let slot: DynamoSlot | DynamoValidation;
            if (desc.type === "slot") {
                slot = new DynamoSlot(this.builder, desc);
            } else {
                slot = new DynamoValidation(this.builder, desc);
            }
            this.slots.push(slot);

            let elem = slot.getRoot();
            if (elem == null) continue;
            entityGroup.add(elem);
        }
    }

    private resizeSlots() {
        let minWidth = DynamoEntity.defaultMinWidth;
        for (const slot of this.slots) {
            slot.update();
            let slotWidth = slot.getMinWidth();
            minWidth = Math.max(minWidth, slotWidth);
        }

        let currentPosY = DynamoEntity.nameBoxHeight; // starting from bottom of entity name label
        for (let slot of this.slots) {
            slot.resizeWidth(minWidth);
            let elem = slot.getRoot();
            if (elem == null) continue;
            elem.y(currentPosY);
            currentPosY += elem.height();
        }
        return [minWidth, currentPosY - DynamoEntity.nameBoxHeight];
    }
}

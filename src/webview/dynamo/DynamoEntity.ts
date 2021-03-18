import { G, Rect, Text } from "@svgdotjs/svg.js";
import { EntityDescription, SlotList } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";
import { DynamoSlot } from "./DynamoSlot";
import { DynamoValidation } from "./DynamoValidation";

export class DynamoEntity {
    private root: G | undefined;
    private shapeHolder: Rect | undefined;
    private nameHolder: Text | undefined;
    constructor(private readonly builder: DynamoShapeBuilder, private readonly desc: EntityDescription) {
        this.render();
    }

    public render() {
        this.root = this.builder.createGroup();
        this.shapeHolder = this.builder.createRect();
        this.shapeHolder.width(300);
        this.shapeHolder.height(300);
        this.shapeHolder.radius(15);
        this.shapeHolder.addClass("dynamo-entity");

        this.nameHolder = this.builder.createText(this.desc.name);
        this.nameHolder.addClass("dynamo-entity-name");
        this.nameHolder.center(this.shapeHolder.width() / 2, 10);

        this.builder.addChildToRoot(this.root);
        this.root.add(this.shapeHolder);
        this.root.add(this.nameHolder);

        this.addEntityMovementHandlers(this.root);

        this.createSlots(this.root, this.desc.slots);
        this.shapeHolder.height(this.root.height() + 30);

        this.addSlotExpansionHandlers(this.root, this.desc);
        return this;
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

                    let entity = new DynamoEntity(this.builder, entityDesc);
                    if (entity.root != null) {
                        entity.root.move(entityGroup.x(), entityGroup.y());
                        this.builder.removeFromRoot(entityGroup);
                        this.builder.addChildToRoot(entity.root);
                    }
                });
            }
        }
    }

    private createSlots(entityGroup: G, slots: SlotList) {
        let currentPosY = 50; // starting from bottom of entity name label
        for (const desc of slots) {
            let elem: G | undefined;
            if (desc.type === "slot") {
                let slot = new DynamoSlot(this.builder, desc);
                elem = slot.getRoot();
            } else {
                let slot = new DynamoValidation(this.builder, desc);
                elem = slot.getRoot();
            }
            if (elem == null) continue;
            elem.y(currentPosY);
            entityGroup.add(elem);
            currentPosY += elem.height();
        }
    }
}

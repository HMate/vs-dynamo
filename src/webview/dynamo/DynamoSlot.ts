import { G, Rect, Text } from "@svgdotjs/svg.js";
import { ConstraintDescription, SlotDescription, SlotRelationship } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";
import { DynamoConstraintHolder } from "./DynamoConstraintHolder";
import { DynamoConstraint } from "./DynamoConstraint";
import { DynamoValue } from "./DynamoValue";

export class DynamoSlot {
    private root: G | undefined;
    private shapeHolder: Rect | undefined;
    private nameHolder: Text | undefined;
    constructor(private readonly builder: DynamoShapeBuilder, private readonly desc: SlotDescription) {
        this.render();
    }

    public getRoot() {
        return this.root;
    }

    public render() {
        this.root = this.builder.createGroup();
        this.shapeHolder = this.builder.createRect();
        this.root.add(this.shapeHolder);
        this.shapeHolder.width(300);
        this.shapeHolder.height(40);
        this.shapeHolder.addClass("dynamo-slot");

        let icon = this.createSlotIcon(this.desc.relation);
        this.root.add(icon);

        this.nameHolder = this.builder.createText(this.desc.name);
        this.root.add(this.nameHolder);
        this.nameHolder.addClass("dynamo-slot-name");
        this.nameHolder.x(10 + icon.width());

        if (this.desc.value != null) {
            let valueSlot = new DynamoValue(this.builder, this.desc.value);
            let valueRoot = valueSlot.getRoot();
            if (valueRoot != null) {
                this.root.add(valueRoot);
                valueRoot.x(this.shapeHolder.width() - valueRoot.width());
            }
        }

        if (this.desc.expanded) {
            let cholder = this.createSlotConstraintHolder();

            this.createConstraints(cholder, this.desc.constraints);
            cholder.cx(this.shapeHolder.width() / 2);
            cholder.y(this.shapeHolder.height());
            this.root.add(cholder);
            cholder.back();
        }
        return this.root;
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

    private createSlotConstraintHolder() {
        let holder = this.builder.createConstraintHolder();
        holder.addClass("dynamo-constraint-holder");

        return holder;
    }

    private createConstraints(ctrHolder: DynamoConstraintHolder, ctrDescs: Array<ConstraintDescription> | undefined) {
        if (!ctrDescs) {
            return;
        }

        let ctrElems = ctrDescs.map((d) => new DynamoConstraint(this.builder, d));

        let offsetY = 6;
        let maxChildWidth = 0;
        for (const ctr of ctrElems) {
            let root = ctr.getRoot();
            if (root == null) {
                continue;
            }
            ctrHolder.add(root);
            offsetY += root.height() + 12;
            maxChildWidth = Math.max(maxChildWidth, root.width());
        }

        ctrHolder.height(offsetY + 10);

        let desiredMinWidth = maxChildWidth + 20;
        if (ctrHolder.width() < desiredMinWidth) {
            ctrHolder.width(desiredMinWidth);
        }

        offsetY = ctrHolder.y() + 12;
        let holderHalf = ctrHolder.x() + ctrHolder.width() / 2;
        for (const ctr of ctrHolder.find(".dynamo-constraint")) {
            ctr.cx(holderHalf);
            ctr.y(offsetY);
            offsetY += ctr.height() + 12;
        }
    }
}

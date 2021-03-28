import { Container, Rect, Text } from "@svgdotjs/svg.js";
import { SlotDescription, SlotRelationship } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";
import { DynamoValue } from "./DynamoValue";
import { DynamoConstraintHolder } from "./DynamoConstraintHolder";

export class DynamoSlot {
    static readonly slotHeight = 40;
    static readonly defaultMinWidth = 300;
    static readonly nameMarginLeft = 10;
    static readonly nameMarginRight = 10;
    static readonly slotIconRad = 20;

    private root: Container;
    private shapeHolder: Rect;
    private nameHolder: Text;
    private icon: Container;
    private valueSlot: DynamoValue | undefined;
    private constraintHolder: DynamoConstraintHolder;
    constructor(private readonly builder: DynamoShapeBuilder, private desc: SlotDescription) {
        this.root = this.builder.createGroup();
        this.shapeHolder = this.builder.createRect();
        this.nameHolder = this.builder.createText(this.desc.name);
        this.icon = this.createSlotIcon(this.desc.relation);
        this.constraintHolder = new DynamoConstraintHolder(this.builder, this.desc.constraints);
        this.render().update();
    }

    get description(): SlotDescription {
        return this.desc;
    }

    set description(desc: SlotDescription) {
        this.desc = desc;
    }

    public getRoot() {
        return this.root;
    }

    public getMinWidth(): number {
        let nameMetric = this.builder.textToSVG.getMetrics(this.desc.name, { fontSize: 22 });
        let minWidth =
            2 * DynamoSlot.slotIconRad + DynamoSlot.nameMarginLeft + nameMetric.width + DynamoSlot.nameMarginRight;
        minWidth += this.valueSlot?.getRoot()?.width() ?? 0;
        let constraints = this.constraintHolder?.getRoot();
        if (constraints != null) {
            let constraintWidth = constraints.width() + DynamoConstraintHolder.minTotalSideMargin;
            if (constraintWidth > minWidth) {
                return constraintWidth;
            }
        }
        return minWidth;
    }

    public click(callback: Function) {
        this.shapeHolder?.click(callback);
    }

    private render() {
        this.root.add(this.shapeHolder);
        this.shapeHolder.width(DynamoSlot.defaultMinWidth);
        this.shapeHolder.height(DynamoSlot.slotHeight);
        this.shapeHolder.addClass("dynamo-slot");
        this.shapeHolder.y(0);

        this.root.add(this.icon);

        this.root.add(this.nameHolder);
        this.nameHolder.addClass("dynamo-slot-name");

        if (this.desc.value != null) {
            this.valueSlot = new DynamoValue(this.builder, this.desc.value);
            let valueRoot = this.valueSlot.getRoot();
            if (valueRoot != null) {
                this.root.add(valueRoot);
                valueRoot.x(this.shapeHolder.width() - valueRoot.width());
            }
        }

        let constraintRoot = this.constraintHolder.getRoot();
        if (constraintRoot != null) {
            this.root.add(constraintRoot);
        }
        this.constraintHolder.visible(this.desc.expanded);

        return this;
    }

    public update() {
        this.nameHolder.text(this.desc.name);
        this.nameHolder.x(DynamoSlot.nameMarginLeft + this.icon.width());
        this.nameHolder.cy(this.shapeHolder.height() / 2);

        this.constraintHolder.visible(this.desc.expanded);

        let minWidth = this.getMinWidth();
        if (minWidth > DynamoSlot.defaultMinWidth) {
            this.resizeWidth(minWidth);
        }
        return this;
    }

    public resizeWidth(newWidth: number) {
        this.shapeHolder.width(newWidth);
        if (this.valueSlot != null) {
            let valueRoot = this.valueSlot.getRoot();
            if (valueRoot != null) {
                valueRoot.x(this.shapeHolder.width() - valueRoot.width());
            }
        }
        if (this.constraintHolder != null) {
            let constraintRoot = this.constraintHolder.getRoot();
            if (constraintRoot != null) {
                this.constraintHolder.resizeWidth(this.shapeHolder.width() - 20);
                constraintRoot.cx(this.shapeHolder.width() / 2);
                constraintRoot.y(this.shapeHolder.y() + this.shapeHolder.height());
            }
        }
    }

    private createSlotIcon(relationship: SlotRelationship): Container {
        // TODO: Refactor to own class, separate render+update
        let group = this.builder.createGroup();
        group.addClass("dynamo-slot-icon");
        let icon = this.builder.createCircle();
        let rad = DynamoSlot.slotIconRad;
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
        const adjust = 3;
        iconText.cx(rad + adjust);
        iconText.cy(rad + adjust);
        return group;
    }
}

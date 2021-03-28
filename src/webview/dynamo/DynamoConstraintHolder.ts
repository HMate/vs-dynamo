import { ConstraintDescription } from "./Descriptors";
import { DynamoConstraint } from "./DynamoConstraint";
import { DynamoConstraintHolderShape } from "./DynamoConstraintHolderShape";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";

export class DynamoConstraintHolder {
    static readonly minTotalSideMargin = 20;
    static readonly constraintsMaringTop = 12;
    static readonly constraintsMaringBetween = 12;

    private constraintHolder: DynamoConstraintHolderShape;
    private minWidth: number = 0;
    private constraintElems: Array<DynamoConstraint> = [];
    constructor(
        private readonly builder: DynamoShapeBuilder,
        private readonly desc: Array<ConstraintDescription> | undefined
    ) {
        this.constraintHolder = this.createShape();
        this.render().update();
    }

    public getRoot() {
        return this.constraintHolder;
    }

    public visible(on: boolean | undefined) {
        if (!!on) {
            this.constraintHolder?.show();
            this.update();
        } else {
            this.constraintHolder?.hide();
        }
    }

    public render() {
        this.createConstraints(this.desc);
        return this;
    }

    public update() {
        if (this.constraintElems.length == 0) {
            console.log(`Slot Height default: ${16}`);
            this.constraintHolder.height(16);
            return;
        }

        let offsetY = 6;
        let maxChildWidth = 0;
        for (const ctr of this.constraintElems) {
            let root = ctr.getRoot();
            offsetY += root.height() + 12;
            maxChildWidth = Math.max(maxChildWidth, root.width());
        }

        this.constraintHolder.height(offsetY + 10);

        this.minWidth = maxChildWidth + DynamoConstraintHolder.minTotalSideMargin;
        if (this.constraintHolder.width() < this.minWidth) {
            this.constraintHolder.width(this.minWidth);
        }
        return this;
    }

    public resizeWidth(newWidth: number) {
        let actualWidth = Math.max(newWidth, this.minWidth);
        if (this.constraintHolder != null) {
            this.constraintHolder.width(actualWidth);

            let offsetY = DynamoConstraintHolder.constraintsMaringTop;
            let holderHalf = this.constraintHolder.width() / 2;
            for (const ctr of this.constraintHolder.find(".dynamo-constraint")) {
                ctr.cx(holderHalf);
                ctr.y(offsetY);
                offsetY += ctr.height() + DynamoConstraintHolder.constraintsMaringBetween;
            }
        }
    }

    private createShape() {
        let holder = this.builder.createConstraintHolder();
        holder.addClass("dynamo-constraint-holder");

        return holder;
    }

    private createConstraints(ctrDescs: Array<ConstraintDescription> | undefined) {
        if (!ctrDescs) {
            console.log(`Slot Height default: ${16}`);
            this.constraintHolder.height(16);
            return;
        }

        this.constraintElems = ctrDescs.map((d) => new DynamoConstraint(this.builder, d));
        for (const ctr of this.constraintElems) {
            let root = ctr.getRoot();
            this.constraintHolder.add(root);
        }
    }
}

import { ConstraintDescription } from "./Descriptors";
import { DynamoConstraint } from "./DynamoConstraint";
import { DynamoConstraintHolderShape } from "./DynamoConstraintHolderShape";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";

export class DynamoConstraintHolder {
    private constraintHolder: DynamoConstraintHolderShape | undefined;
    private minWidth: number = 0;
    constructor(
        private readonly builder: DynamoShapeBuilder,
        private readonly desc: Array<ConstraintDescription> | undefined
    ) {
        this.render();
    }

    public getRoot() {
        return this.constraintHolder;
    }

    public render() {
        this.constraintHolder = this.createShape();
        this.createConstraints(this.constraintHolder, this.desc);

        return this.constraintHolder;
    }

    public resizeWidth(newWidth: number) {
        let actualWidth = Math.max(newWidth, this.minWidth);
        if (this.constraintHolder != null) {
            this.constraintHolder.width(actualWidth);

            let offsetY = this.constraintHolder.y() + 12;
            let holderHalf = this.constraintHolder.x() + this.constraintHolder.width() / 2;
            for (const ctr of this.constraintHolder.find(".dynamo-constraint")) {
                ctr.cx(holderHalf);
                ctr.y(offsetY);
                offsetY += ctr.height() + 12;
            }
        }
    }

    private createShape() {
        let holder = this.builder.createConstraintHolder();
        holder.addClass("dynamo-constraint-holder");

        return holder;
    }

    private createConstraints(
        ctrHolder: DynamoConstraintHolderShape,
        ctrDescs: Array<ConstraintDescription> | undefined
    ) {
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

        this.minWidth = maxChildWidth + 20;
        if (ctrHolder.width() < this.minWidth) {
            ctrHolder.width(this.minWidth);
        }
    }
}

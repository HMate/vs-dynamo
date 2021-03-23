export const enum SlotRelationship {
    CLONE = "clone",
    OMIT = "omit",
    SPECIALIZE = "specialize",
    PARTITION = "partition",
}

export interface ValueDescription {
    text: string;
    new?: boolean;
}

export interface ConstraintDescription {
    name: string;
    value: string;
}

export interface AbstractSlotDescription {
    name: string;
    type: "slot" | "validation";
    expanded?: boolean;
}

export interface SlotDescription extends AbstractSlotDescription {
    type: "slot";
    relation: SlotRelationship;
    parentSlot: string;
    value?: ValueDescription;
    constraints?: Array<ConstraintDescription>;
}

export interface ValidationDescription extends AbstractSlotDescription {
    type: "validation";
    validationType: string;
    value?: ValueDescription;
}

export type SlotList = Array<SlotDescription | ValidationDescription>;

export interface EntityDescription {
    name: string;
    parent?: string;
    slots: SlotList;
}

export interface DiagramDescription {
    entities: Array<EntityDescription>;
}

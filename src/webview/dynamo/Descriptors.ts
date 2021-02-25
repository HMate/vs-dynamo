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
}

export interface AbstractSlotDescription {
    name: string;
    type: "slot" | "validation";
}

export interface SlotDescription extends AbstractSlotDescription {
    type: "slot";
    relation: SlotRelationship;
    value?: ValueDescription;
    expanded?: boolean;
}

export interface ValidationDescription extends AbstractSlotDescription {
    type: "validation";
    value?: ValueDescription;
}

export type SlotList = Array<SlotDescription | ValidationDescription>;

export interface EntityDescription {
    name: string;
    slots: SlotList;
}

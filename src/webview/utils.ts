import { RSA_PKCS1_OAEP_PADDING } from "constants";
import { add } from "lodash";

export type SvgInHtml = HTMLElement & SVGSVGElement;

export type Coord = { x: number; y: number };
export type Point = [number, number];

export function addPoint(p0: Point, p1: Point): Point {
    return [p0[0] + p1[0], p0[1] + p1[1]];
}

export enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
    SIDE_BACK = 3,
    SIDE_FORWARD = 4,
}

export const enum MouseButtons {
    LEFT = 1,
    MIDDLE = 2,
    RIGHT = 4,
    SIDE_BACK = 8,
    SIDE_FORWARD = 16,
}

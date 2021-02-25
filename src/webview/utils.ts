import { RSA_PKCS1_OAEP_PADDING } from "constants";
import { add } from "lodash";

export type SvgInHtml = HTMLElement & SVGElement;

export type Coord = { x: number; y: number };
export type Point = [number, number];

export function addPoint(p0: Point, p1: Point): Point {
    return [p0[0] + p1[0], p0[1] + p1[1]];
}

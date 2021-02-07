import { Rect } from "./visualizationElements/Rect";

/**
 * Provides the iterface for methods and variables that are needed to build up visualizations.
 * Provides method like drawing, moving, iteracting with shapes.
 *
 * It abstracts away details about the implementation of rendering, ie that we are using svg or canvas for drawing.
 */
export default interface IVisualizationBuilder {
    drawRect(): Rect;
}

import { DynamoDiagramVisualizer } from "./DynamoDiagramVisualizer";
import { SvgVisualizationBuilder } from "./SvgVisualizationBuilder";
import { SvgInHtml } from "./utils";

export function main() {
    const svgRoot = document.getElementById("dynamo-svg") as SvgInHtml;
    if (svgRoot == null) {
        return;
    }
    const builder = new SvgVisualizationBuilder(svgRoot);
    const visualizer = new DynamoDiagramVisualizer(builder);
    visualizer.drawEntity();
}

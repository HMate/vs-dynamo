import IVisualizationBuilder from "./IVisualizationBuilder";

export class DynamoDiagramVisualizer {
    constructor(private readonly builder: IVisualizationBuilder) {}

    public drawEntity() {
        let entity = this.builder.drawRect();
        entity.addClass("dynamo-entity");
        entity.setAttribute("fill", "#b7e3c0");
    }
}

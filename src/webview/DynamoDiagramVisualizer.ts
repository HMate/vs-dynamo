import IVisualizationBuilder from "./IVisualizationBuilder";

export class DynamoDiagramVisualizer {
    constructor(private readonly builder: IVisualizationBuilder) {}

    /**
     * drawClass
     */
    public drawEntity() {
        let entity = this.builder.drawRect();
        entity.addClass("dynamo-entity");
    }
}

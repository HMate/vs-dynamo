import { DiagramDescription, EntityDescription } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";
import { DynamoEntity } from "./DynamoEntity";
import * as dagre from "dagre";
import { DynamoArrow } from "./DynamoArrow";
import "./webview-style.scss";

export class DynamoDiagramVisualizer {
    constructor(private readonly builder: DynamoShapeBuilder) {}

    public createDiagram(desc: DiagramDescription) {
        let entities: { [id: string]: DynamoEntity } = {};
        let maxHeight = 0;
        for (const entityDesc of desc.entities) {
            let entity = this.addEntity(entityDesc);
            entities[entityDesc.name] = entity;
            let root = entity.getRoot();
            maxHeight = Math.max(root?.height() ?? 0, maxHeight);
        }

        var g = new dagre.graphlib.Graph();
        g.setGraph({ ranksep: 80, ranker: "tight-tree" });

        g.setDefaultEdgeLabel(function () {
            return {};
        });

        for (let [key, entity] of Object.entries(entities)) {
            let root = entity.getRoot();
            if (root == null) {
                continue;
            }

            g.setNode(key, { width: root.width(), height: root.height() });
            if (entity.description.parent != null) {
                g.setEdge(entity.description.parent, key);
            }
        }

        dagre.layout(g);
        for (const v of g.nodes()) {
            let node = g.node(v);
            let root = entities[v].getRoot();
            root?.cx(node.x);
            root?.cy(node.y);
        }

        for (const e of g.edges()) {
            this.addEdge(entities[e.v], entities[e.w]);
        }
    }

    public addEntity(desc: EntityDescription) {
        // TODO: Expand validations
        // TODO: Entity containment arrows

        return new DynamoEntity(this.builder, desc);
    }

    private addEdge(start: DynamoEntity, end: DynamoEntity) {
        let arrow = new DynamoArrow(this.builder, start, end);
    }
}

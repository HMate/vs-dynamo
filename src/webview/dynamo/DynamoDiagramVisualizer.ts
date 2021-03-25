import { DiagramDescription, EntityDescription } from "./Descriptors";
import { DynamoShapeBuilder } from "./DynamoShapeBuilder";
import "./webview-style.scss";
import { DynamoEntity } from "./DynamoEntity";
import * as dagre from "dagre";
import { DynamoArrow } from "./DynamoArrow";

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
            if (entity.desc.parent != null) {
                g.setEdge(entity.desc.parent, key);
            }
        }

        dagre.layout(g);
        for (const v of g.nodes()) {
            let node = g.node(v);
            console.log("Node " + v + " -> " + JSON.stringify(node));
            let root = entities[v].getRoot();
            root?.cx(node.x);
            root?.cy(node.y);
        }

        for (const e of g.edges()) {
            console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
            let edge = g.edge(e);
            this.addEdgeNumbered(edge.points[0], edge.points[edge.points.length - 1]);
        }
    }

    public addEntity(desc: EntityDescription) {
        // TODO: Expand validations
        // TODO: Entity inheritance arrows
        // TODO: Entity containment arrows

        return new DynamoEntity(this.builder, desc);
    }

    private addEdgeNumbered(start: { x: number; y: number }, end: { x: number; y: number }) {
        let arrow = new DynamoArrow(this.builder, start, end);
    }
    private addEdge(start: DynamoEntity, end: DynamoEntity) {}
}

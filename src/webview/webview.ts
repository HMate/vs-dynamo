import { DiagramDescription, SlotRelationship } from "./dynamo/Descriptors";
import { DynamoDiagramVisualizer } from "./dynamo/DynamoDiagramVisualizer";
import TextToSVG from "./TextToSvg";
import "./font/RobotoMono.ttf";
import { DynamoShapeBuilder } from "./dynamo/DynamoShapeBuilder";

export function main(mediaUri: string) {
    TextToSVG.load(`${mediaUri}/font/RobotoMono.ttf`, (err: any, tts: TextToSVG | null) => {
        if (err || tts == null) {
            console.error(`Error while loading opentype text: ${err} | ${tts}`);
            return;
        }
        buildVisualization("dynamo-svg", tts);
    });
}

function buildVisualization(svgId: string, tts: TextToSVG) {
    const builder = new DynamoShapeBuilder(`#${svgId}`, tts);
    builder.addCameraHandlers();
    const visualizer = new DynamoDiagramVisualizer(builder);

    let diagram: DiagramDescription = {
        entities: [
            {
                name: "BicycleEntity",
                slots: [
                    {
                        name: "ComplexEntity.Children",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.CLONE,
                    },
                    {
                        name: "Base.GammaValidation",
                        type: "validation",
                        validationType: "Base.GammaValidation",
                    },
                    {
                        name: "CheckPhysical",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.PARTITION,
                        constraints: [
                            { name: "$T", value: "OperationDefinition" },
                            { name: "$C", value: "0..1" },
                        ],
                    },
                    {
                        name: "AbstractEntity",
                        type: "slot",
                        value: { text: "23" },
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.PARTITION,
                        constraints: [
                            { name: "$T", value: "Bool" },
                            { name: "$C", value: "0..1" },
                        ],
                    },
                    {
                        name: "AlphaValidation",
                        type: "validation",
                        validationType: "Base.AlphaValidation",
                        value: {
                            text: `operation Bool ID::BicycleEntityAlpha(ID instance)
                        {
                            //Note: here we check whether the slot exists, not its value!
                            Object isEntityAbstract = call $GetRelevantAttribute(instance, $BicycleEntity.AbstractEntity);
                                            
                            //If the entity is not abstract any more, we check whether it fulfills the conditions of being a physical artefact
                            if (isEntityAbstract==null)
                            {
                                //We get all CheckPhysical method from the meta hierarchy and call them
                                //Note: it is not enough to call the most specific one
                                if(!(call $CallCheckPhysicalOnMetaHierarchy(instance, instance)))	
                                {	
                                    call $Log(call $StrConcat("\t Validation error: The entity is not marked as abstract, but it is not fully concrete either: ", instance));
                                    return false;
                                }
                            }
                                 
                            return true;	
                        }`,
                            new: true,
                        },
                    },
                ],
            },
            {
                name: "Configuration",
                parent: "BicycleEntity",
                slots: [
                    {
                        name: "Components",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.PARTITION,
                        constraints: [{ name: "$T", value: "Component" }],
                    },
                    {
                        name: "BicycleEntity.AbstractEntity",
                        type: "slot",
                        parentSlot: "BicycleEntity.AbstractEntity",
                        relation: SlotRelationship.CLONE,
                    },
                    {
                        name: "ComplexEntity.Children",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.CLONE,
                    },
                    {
                        name: "BicycleEntity.AlphaValidation",
                        type: "validation",
                        validationType: "BicycleEntity.AlphaValidation",
                    },
                    {
                        name: "CheckPhysical",
                        type: "slot",
                        parentSlot: "BicycleEntity.CheckPhysical",
                        value: {
                            text: `operation Bool ID::CheckPhysical()
                        {
                            Object[] components = call $GetRelevantAttributeValues(this, $Configuration.Components);
                            
                            //A configuration without components is a valid, physical artefact
                            if(components == null) return true;
                                
                            for(Object component : components)
                            {
                                //If it has an abstract component, it is not a physical artefact
                                //Note: It is not necessary to call CheckPhysical on the components, since their alpha validation already called the method
                                if (call $GetRelevantAttribute(component, $BicycleEntity.AbstractEntity)!=null) return false;
                            }
                            
                            return true;
                        }`,
                        },
                        relation: SlotRelationship.SPECIALIZE,
                    },
                ],
            },
            {
                name: "Component",
                parent: "BicycleEntity",
                slots: [
                    {
                        name: "Components",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.PARTITION,
                        constraints: [{ name: "$T", value: "Component" }],
                    },
                    {
                        name: "BicycleEntity.AbstractEntity",
                        type: "slot",
                        parentSlot: "BicycleEntity.AbstractEntity",
                        relation: SlotRelationship.CLONE,
                    },
                    {
                        name: "ComplexEntity.Children",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.CLONE,
                    },
                    {
                        name: "BicycleEntity.AlphaValidation",
                        type: "validation",
                        validationType: "BicycleEntity.AlphaValidation",
                    },
                    {
                        name: "Weight",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.PARTITION,
                        constraints: [
                            { name: "$T", value: "Number" },
                            { name: "$C", value: "1" },
                        ],
                    },
                    {
                        name: "Size",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.PARTITION,
                        constraints: [
                            { name: "$T", value: "Number" },
                            { name: "$C", value: "1" },
                        ],
                    },
                    {
                        name: "Colour",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.PARTITION,
                        constraints: [
                            { name: "$T", value: "String" },
                            { name: "$C", value: "1" },
                        ],
                    },
                    {
                        name: "SerialNumber",
                        type: "slot",
                        parentSlot: "ComplexEntity.Children",
                        relation: SlotRelationship.PARTITION,
                        constraints: [
                            { name: "$T", value: "String" },
                            { name: "$C", value: "1" },
                        ],
                    },
                    {
                        name: "ComponentGamma",
                        type: "validation",
                        validationType: "Base.GammeValidation",
                        value: {
                            text: `operation Bool ID::UniqueFrameId()
                    {				
                        String[] ids = String:[];
                        ID[] entities = call $GetEntities();
                        for(ID entity : entities)
                        {
                            //We collect all entities derived from $Component
                            if(call $DerivesFrom($Component, entity))
                            {
                                //Uniqueness is checked only for concrete components, since they are part of the physical world. 
                                if (call $GetRelevantAttribute(entity, $BicycleEntity.AbstractEntity)==null)
                                {							
                                    Object id = call $GetRelevantAttributeValue(entity, $Component.SerialNumber);
                                    if(id != null)
                                    {								
                                        if(contains(ids, id))
                                        {
                                             // ID already found => validation fails
                                            call $Log(call $StrConcat("Duplicated serial number found: ", id));
                                            return false;
                                        }
                                        else
                                        {	
                                            append<String>(ids, id); //We add the new ID to the list of known IDs
                                        }
                                    }
                                }						
                            }
                        }
                        
                        
                        return true;
                    }`,
                        },
                    },
                    {
                        name: "CheckPhysical",
                        type: "slot",
                        parentSlot: "BicycleEntity.CheckPhysical",
                        value: {
                            text: `operation Bool ID::CheckPhysical()
                            {
                                if(call $GetRelevantAttributeValue(this, $Component.Weight) == null) return false;
                                if(call $GetRelevantAttributeValue(this, $Component.Size) == null) return false;
                                if(call $GetRelevantAttributeValue(this, $Component.Colour) == null) return false;
                                if(call $GetRelevantAttributeValue(this, $Component.SerialNumber) == null) return false;
                                
                                Object[] components = call $GetRelevantAttributeValues(this, $Component.Components);
                                
                                //A component without components is a valid, physical artefact
                                if(components == null) return true;
                                    
                                for(Object component : components)
                                {
                                    //If it has an abstract component, it is not a physical artefact
                                    //Note: It is not necessary to call CheckPhysical on the components, since their alpha validation already called the method
                                    if (call $GetRelevantAttributeValue(component, $BicycleEntity.AbstractEntity)!=null) return false;
                                }
                                
                                return true;
                            }`,
                        },
                        relation: SlotRelationship.SPECIALIZE,
                    },
                ],
            },
            {
                name: "BasicPart",
                parent: "Component",
                slots: [
                    {
                        name: "Component.Weight",
                        type: "slot",
                        parentSlot: "Component.Weight",
                        relation: SlotRelationship.CLONE,
                    },
                    {
                        name: "Component.Size",
                        type: "slot",
                        parentSlot: "Component.Size",
                        relation: SlotRelationship.CLONE,
                    },
                    {
                        name: "Component.Colour",
                        type: "slot",
                        parentSlot: "Component.Colour",
                        relation: SlotRelationship.CLONE,
                    },
                    {
                        name: "Component.SerialNumber",
                        type: "slot",
                        parentSlot: "Component.SerialNumber",
                        relation: SlotRelationship.CLONE,
                    },
                    {
                        name: "BicycleEntity.AbstractEntity",
                        type: "slot",
                        parentSlot: "BicycleEntity.AbstractEntity",
                        relation: SlotRelationship.CLONE,
                    },
                ],
            },
        ],
    };

    visualizer.createDiagram(diagram);
}

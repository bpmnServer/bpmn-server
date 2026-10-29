// Adding to an element's bpmn:extensionElements as one undoable change, creating the container if needed.

export function addExtensionElement(element, bo, value, bpmnFactory, commandStack) {
    const commands = [];
    let extensionElements = bo.get('extensionElements');
    if (!extensionElements) {
        extensionElements = bpmnFactory.create('bpmn:ExtensionElements', { values: [] });
        extensionElements.$parent = bo;
        commands.push({ cmd: 'element.updateModdleProperties', context: { element, moddleElement: bo, properties: { extensionElements } } });
    }
    value.$parent = extensionElements;
    commands.push({
        cmd: 'element.updateModdleProperties',
        context: { element, moddleElement: extensionElements, properties: { values: [...extensionElements.get('values'), value] } }
    });
    commandStack.execute('properties-panel.multi-command-executor', commands);
}

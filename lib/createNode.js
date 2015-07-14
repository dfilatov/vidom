var TextNode = require('./nodes/TextNode'),
    TagNode = require('./nodes/TagNode'),
    ComponentNode = require('./nodes/ComponentNode');

function createNode(type) {
    switch(typeof type) {
        case 'string':
            return new TagNode(type);

        case 'function':
            return new ComponentNode(type);

        default:
            return new TextNode();
    }
}

module.exports = createNode;

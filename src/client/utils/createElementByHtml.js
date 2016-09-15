const TOP_LEVEL_NS_TAGS = {
        'http://www.w3.org/2000/svg' : 'svg',
        'http://www.w3.org/1998/Math/MathML' : 'math'
    },
    parentTags = {
        thead : 'table',
        tbody : 'table',
        tfoot : 'table',
        tr : 'tbody',
        td : 'tr'
    },
    helperDomNodes = {};

export default function createElementByHtml(html, tag, ns) {
    const parentTag = parentTags[tag] || 'div',
        helperDomNode = helperDomNodes[parentTag] ||
            (helperDomNodes[parentTag] = document.createElement(parentTag));

    if(!ns || !TOP_LEVEL_NS_TAGS[ns] || TOP_LEVEL_NS_TAGS[ns] === tag) {
        helperDomNode.innerHTML = html;
        return helperDomNode.removeChild(helperDomNode.firstChild);
    }

    const topLevelTag = TOP_LEVEL_NS_TAGS[ns];
    helperDomNode.innerHTML = '<' + topLevelTag + ' xmlns="' + ns + '">' + html + '</' + topLevelTag + '>';
    return helperDomNode.removeChild(helperDomNode.firstChild).firstChild;
}

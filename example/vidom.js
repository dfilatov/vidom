var vidom = require('../lib/vidom'),
    batch = [];

function scheduleUpdate(patch) {
    if(!batch.length) {
        window.requestAnimationFrame(performUpdate);
    }

    batch = batch.concat(patch);
}

function performUpdate() {
    vidom.patchDom(batch);
    batch = [];
}

var tree = {
        tag : 'a',
        children : [
            { tag : 'i', key : 1 },
            { tag : 'i', key : 2 },
            { tag : 'i', key : 3 }
        ]
    };

document.body.appendChild(vidom.renderToDom(tree));

[{
        tag : 'a',
        attrs : { disabled : true, tabIndex : 10 },
        children : [
            {
                tag : 'b',
                attrs : { className : 'aa' }
            },
            { tag : 'i', key : 2 },
            { tag : 'i', children : [{ text : 'text12' }], key : 3, attrs : { className : 'test test_a' } },
            { tag : 'i', key : 1, children : [] }
        ]
},
{
    tag : 'a',
    children : [
        {
            tag : 'b',
            attrs : { className : 'aa' },
            children : []
        },
        { tag : 'i', children : [], key : 1 },
        { tag : 'i', children : [{ text : 'text' }], key : 2 },
        { tag : 'i', children : [{ text : 'text123' }], key : 3, attrs : { className : 'test test_a' } }
    ]
},
{
    tag : 'a',
    children : [
        {
            tag : 'b',
            attrs : { className : 'aa' },
            children : []
        },
        { tag : 'i', children : [], key : 1 },
        { tag : 'i', children : [{ text : 'text' }], key : 2 },
        { tag : 'i', children : [{ text : 'text1234' }], key : 3, attrs : { className : 'test test_a' } }
    ]
},
{
    tag : 'a',
    children : [
        {
            tag : 'b',
            attrs : { className : 'aa' },
            children : []
        },
        { tag : 'i', children : [], key : 1 },
        { tag : 'i', children : [{ text : 'text' }], key : 2 },
        { tag : 'i', children : [{ text : 'text12345' }], key : 3, attrs : { className : 'test test_a' } }
    ]
},

{
    tag : 'a',
    attrs : { disabled : 'disabled', tabIndex : 10 },
    children : [
        { tag : 'i', children : [] },
        {
            tag : 'b',
            children : []
        },
        { tag : 'a', attrs : { href : '/' }, children : [{ text : 'link' }] },
        { tag : 'input', attrs : { type : 'radio', checked : true }, children : [] },
        { text : 'text1' }
    ]
},
{
    tag : 'a',
    attrs : { disabled : 'disabled', tabIndex : 10 },
    children : [
        { tag : 'i', children : [] },
        {
            tag : 'b',
            children : []
        },
        { tag : 'a', children : [{ text : 'link' }] },
        { tag : 'input', attrs : { type : 'radio', checked : false }, children : [] },
        { tag : 'b', children : [] }
    ]
},
{
    tag : 'a',
    attrs : { disabled : 'disabled', tabIndex : 10 },
    children : [
        { tag : 'i', children : [] },
        {
            tag : 'b',
            children : []
        },
        { tag : 'a', children : [{ text : 'link2' }] },
        { tag : 'input', attrs : { type : 'radio', checked : false }, children : [] },
        { tag : 'b', children : [] }
    ]
}
].reduce(
    function(treeA, treeB) {
        scheduleUpdate(
            vidom.calcPatch(
                treeA,
                treeB,
                {
                    after : function(nodeA, nodeB) {
                        nodeB.prev = nodeA;
                    }
                }));
        return treeB;
    },
    tree);

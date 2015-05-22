var vidom = require('../lib/vidom'),
    batch = [];

//function scheduleUpdate(patch) {
//    if(!batch.length) {
//        window.requestAnimationFrame(performUpdate);
//    }
//
//    batch = batch.concat(patch);
//}
//
//function performUpdate() {
//    vidom.patchDom(rootNode, batch);
//    batch = [];
//}
//
//var tree = {
//        tag : 'a'
//    };
//
//var rootNode = vidom.renderToDom(tree);
//
//document.body.appendChild(rootNode);
//
//[
//{
//        tag : 'a',
//        attrs : { disabled : true, tabIndex : 10 },
//        children : [
//            {
//                tag : 'b',
//                attrs : { className : 'aa' }
//            },
//            { tag : 'i', key : 2 },
//            { tag : 'i', children : [{ text : 'text12' }], key : 3, attrs : { className : 'test test_a' } },
//            { tag : 'i', key : 1, children : [] }
//        ]
//},
//{
//    tag : 'a',
//    children : [
//        {
//            tag : 'b',
//            attrs : { className : 'aa' },
//            children : []
//        },
//        { tag : 'i', children : [], key : 1 },
//        { tag : 'i', children : [{ text : 'text' }], key : 2 },
//        { tag : 'i', children : [{ text : 'text123' }], key : 3, attrs : { className : 'test test_a' } }
//    ]
//},
//{
//    tag : 'a',
//    children : [
//        {
//            tag : 'b',
//            attrs : { className : 'aa' },
//            children : []
//        },
//        { tag : 'i', children : [], key : 1 },
//        { tag : 'i', children : [{ text : 'text' }], key : 2 },
//        { tag : 'i', children : [{ text : 'text1234' }], key : 3, attrs : { className : 'test test_a' } }
//    ]
//},
//{
//    tag : 'a',
//    children : [
//        {
//            tag : 'b',
//            attrs : { className : 'aa' },
//            children : []
//        },
//        { tag : 'i', children : [], key : 1 },
//        { tag : 'i', children : [{ text : 'text' }], key : 2 },
//        { tag : 'i', children : [{ text : 'text12345' }], key : 3, attrs : { className : 'test test_a' } }
//    ]
//},
//
//{
//    tag : 'a',
//    attrs : { disabled : 'disabled', tabIndex : 10 },
//    children : [
//        { tag : 'i', children : [] },
//        {
//            tag : 'b',
//            children : []
//        },
//        { tag : 'a', attrs : { href : '/' }, children : [{ text : 'link' }] },
//        { tag : 'input', attrs : { type : 'radio', checked : true }, children : [] },
//        { text : 'text1' }
//    ]
//},
//{
//    tag : 'a',
//    attrs : { disabled : 'disabled', tabIndex : 10 },
//    children : [
//        { tag : 'i', children : [] },
//        {
//            tag : 'b',
//            children : []
//        },
//        { tag : 'a', children : [{ text : 'link' }] },
//        { tag : 'input', attrs : { type : 'radio', checked : false }, children : [] },
//        { tag : 'b', children : [] }
//    ]
//},
//{
//    tag : 'a',
//    attrs : { disabled : 'disabled', tabIndex : 10 },
//    children : [
//        { tag : 'i', children : [] },
//        {
//            tag : 'b',
//            children : []
//        },
//        { tag : 'a', children : [{ text : 'link2' }] },
//        { tag : 'input', attrs : { type : 'radio', checked : true, disabled : true }, children : [] },
//        { tag : 'b', children : [] }
//    ]
//}
//].reduce(
//    function(treeA, treeB) {
//        scheduleUpdate(
//            vidom.calcPatch(
//                treeA,
//                treeB
//                ));
//        return treeB;
//    },
//    tree);

function generateTable(rowsCount, cellsCount, content) {
    var res = { tag : 'table', children : [] };
    for(var i = 0; i < rowsCount; i++) {
        for(var j = 0, tr = { tag : 'tr', key : i, children : [] }; j < cellsCount; j++) {
            tr.children.push({ tag : 'td', key : j, children : [{ text : content }] });
        }
        res.children.push(tr);
    }
    return res;
}

var tree = generateTable(100, 10, 0),
    counter = 1,
    rootNode = document.body.appendChild(vidom.renderToDom(tree));

function draw() {
    var prevTree = tree;
    tree = generateTable(100, 10, counter++);
    vidom.patchDom(rootNode, vidom.calcPatch(prevTree, tree, { after : function(nodeA, nodeB) { nodeB.prev = nodeA; } }));
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

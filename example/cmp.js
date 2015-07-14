var vidom = require('../lib/vidom'),
    virtualDomH = require('virtual-dom/h'),
    virtualDomDiff = require('virtual-dom/diff'),
    virtualDomPatch = require('virtual-dom/patch'),
    virtualDomCreateElement = require('virtual-dom/create-element'),
    //react = require('react'),
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

var SIZE = 100,
    ITERATIONS = 21,
    rootDomNode = document.getElementById('root');

function generateTable(rowsCount, cellsCount, content, invertKeys) {
    var tableChildren = [];
    for(var i = 0, trKey; i < rowsCount; i++) {
        trKey = invertKeys? rowsCount - i - 1 : i;
        for(var j = 0, trChildren = [], key; j < cellsCount; j++) {
            key = invertKeys? cellsCount - j - 1 : j;
            trChildren.push(vidom.createNode('td').key(key).children(trKey + ' ' + key + ' ' + content));
        }
        tableChildren.push(vidom.createNode('tr').key(trKey).children(trChildren));
    }
    return vidom.createNode('table').children(tableChildren);
}

var invertKeys = false,
    tree = generateTable(SIZE, SIZE, 0, invertKeys),
    counter = 1,
    t = +new Date,
    t0 = +new Date,
    tRender = 0,
    tGenerate = 0,
    tDiff = 0,
    tPatch = 0;

vidom.mountToDom(rootDomNode, tree, function() {
    tRender = +new Date - t;
    t = +new Date;

    tree = generateTable(SIZE, SIZE, counter++, invertKeys = !invertKeys);

    tGenerate = +new Date - t;
    t = +new Date;

    vidom.mountToDom(rootDomNode, tree, function() {
        tPatch = +new Date - t;
        document.title = 'r: ' + tRender + ', g: ' + tGenerate + ', d: ' + tDiff + ', p: ' + tPatch + ', a: ' + (+new Date - t0);
    });

    tDiff = +new Date - t;
    t = +new Date;

    //}
    //console.log(JSON.stringify(patch, null, 4));
    //var t3 = +new Date;
    //document.title = Math.ceil(tDiff / ITERATIONS) + ' ' + Math.ceil(tPatch / ITERATIONS) + ' ' + Math.ceil((t3 - t0) / ITERATIONS);


});

//function generateTable(rowsCount, cellsCount, content, invertKeys) {
//    var children = [];
//    for(var i = 0, trKey; i < rowsCount; i++) {
//        trKey = invertKeys? rowsCount - i - 1 : i;
//        for(var j = 0, trChildren = [], key; j < cellsCount; j++) {
//            key = invertKeys? cellsCount - j - 1 : j;
//            trChildren.push(virtualDomH('td', { key : key }, [trKey + ' ' + key + ' ' + content]));
//        }
//        children.push(virtualDomH('tr', { key : trKey }, trChildren));
//    }
//
//    return virtualDomH('table', {}, children);
//}
//
//var invertKeys = false,
//    t = +new Date,
//    tree = generateTable(SIZE, SIZE, 0, invertKeys),
//    counter = 1,
//    rootNode = document.body.appendChild(virtualDomCreateElement(tree));
//
//function draw() {
//    var t0 = +new Date,
//        tDiff = 0,
//        tPatch = 0;
//    for(var i = 0; i < ITERATIONS; i++) {
//        var prevTree = tree;
//        tree = generateTable(SIZE, SIZE, counter++, invertKeys = !invertKeys);
//        var t1 = +new Date;
//        var patch = virtualDomDiff(prevTree, tree);
//        tDiff += +new Date - t1;
//        var t1 = +new Date;
//        virtualDomPatch(rootNode, patch);
//        tPatch += +new Date - t1;
//    }
//    //console.log(JSON.stringify(patch, null, 4));
//    var t3 = +new Date;
//    document.title = Math.ceil(tDiff / ITERATIONS) + ' ' + Math.ceil(tPatch / ITERATIONS) + ' ' + Math.ceil((t3 - t0) / ITERATIONS);
//
//    //requestAnimationFrame(draw);
//}
//
//requestAnimationFrame(draw);

//function generateTable(rowsCount, cellsCount, content, invertKeys) {
//    var tableChildren = [];
//    for(var i = 0, trKey; i < rowsCount; i++) {
//        trKey = invertKeys? rowsCount - i - 1 : i;
//        for(var j = 0, trChildren = [], key; j < cellsCount; j++) {
//            key = invertKeys? cellsCount - j - 1 : j;
//            trChildren.push(React.createElement('td', { key : key }, trKey + ' ' + key + ' ' + content));
//        }
//        tableChildren.push(React.createElement('tr', { key : trKey }, trChildren));
//    }
//    return React.createElement('table', null, React.createElement('tbody', null, tableChildren));
//}
//
//var App = React.createClass({
//        getInitialState : function() {
//            return {
//                invertKeys : false,
//                counter : 0
//            };
//        },
//
//        render : function() {
//            var t = +new Date;
//            var res = generateTable(SIZE, SIZE, this.state.counter, this.state.invertKeys);
//            document.title += ' ' + (+new Date - t);
//            return res;
//        },
//
//        componentDidMount : function() {
//            var _this = this,
//                fn = function() {
//                    _this.state.counter++;
//                    _this.state.invertKeys = !_this.state.invertKeys;
//                    var t = +new Date;
//                    _this.forceUpdate(function() {
//                        document.title += ' ' + (+new Date - t);
//                    });
//                };
//            requestAnimationFrame(fn);
//        }
//    });
//
////react.addons.Perf.start();
//React.render(React.createElement(App), rootDomNode);
////react.addons.Perf.stop();
////react.addons.Perf.printInclusive();

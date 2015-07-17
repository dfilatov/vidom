var vidom = require('../lib/vidom');

var f = true;

var C1 = vidom.createComponent({
        onMount : function() {
            console.log('onMount C1');
        },

        onUnmount : function() {
            console.log('onUnmount C1');
        },

        onRender : function(_, children) {
            //console.log('onRender C1');
            return vidom.createNode(C2)
                .children(children);
        }
    }),
    C2 = vidom.createComponent({
        onMount : function() {
            console.log('onMount C2');
            setTimeout(function() {
                this._className = 'c22';
                this.update();
            }.bind(this), 100);
        },

        onUnmount : function() {
            console.log('onUnmount C2');
        },

        onRender : function(_, children) {
            return vidom.createNode(f? 'div' : 'span')
                .attrs({ className : this._className || 'c2' })
                .children(children);
        }
    }),
    C3 = vidom.createComponent({
        onMount : function() {
            console.log('onMount C3');
        },

        onUnmount : function() {
            console.log('onUnmount C3');
        },

        onRender : function(attrs) {
            //console.log('onRender C3');
            return vidom.createNode('i').children(attrs.value);
        }
    }),
    C4 = vidom.createComponent({
        onMount : function() {
            console.log('onMount C4', this._domNode);
        },

        onUnmount : function() {
            console.log('onUnmount C4');
        },

        onRender : function(attrs) {
            return vidom.createNode('i', null, attrs.value);
        }
    });

var tree1 = vidom.createNode('div')
        .children(
            vidom.createNode(C1)
                .key(1)
                .attrs({ value : '1' })
                .children([
                    vidom.createNode(C3).key(1).attrs({ value : '1' }),
                    vidom.createNode(C3).key(2).attrs({ value : '2' }),
                    vidom.createNode(C3).key(3).attrs({ value : '3' })
                ])),
    tree2 = vidom.createNode('div')
        .children(
            vidom.createNode(C1)
                .key(1)
                .attrs({ value : '1' })
                .children([
                    vidom.createNode(C3).key(3).attrs({ value : '3' }),
                    vidom.createNode(C3).key(2).attrs({ value : '2' })
                ])),
    parentDomNode = document.body,
    root1DomNode = document.getElementById('root1');

vidom.mountToDom(root1DomNode, tree1, function() {
    f=false;
})
//vidom.mountToDom(root1DomNode, tree2);
//vidom.mountToDom(root1DomNode, tree1);
//vidom.mountToDom(root1DomNode, tree2);
//f=true;
//vidom.mountToDom(root1DomNode, tree2);
setTimeout(function() {
    //vidom.unmountFromDom(root1DomNode);
    vidom.mountToDom(root1DomNode, tree1);
}, 50);

//vidom.mountToDom(root1DomNode, tree1);
//vidom.mountToDom(root1DomNode, vidom.createNode(C4, { key : 3, attrs : { value : 'C4' } }));

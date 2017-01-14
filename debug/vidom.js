import { Component, mount, unmount, node, renderToString } from '../src/vidom';
import patchOps from '../src/client/patchOps';

const origPatchOps = {};

Object.keys(patchOps).forEach(op => {
    origPatchOps[op] = patchOps[op];
});

Object.keys(patchOps).forEach(op => {
    patchOps[op] = function() {
        console.log(op, arguments);
        origPatchOps[op].apply(null, arguments);
    };
});

class A extends Component {
    onRender({ a }) {
        switch(a) {
            case 1:
                return node('div').children([node('fragment').children([
                    node('div').children('A1'),
                    node('div').children('A2'),
                    node('fragment').children([
                        node('div').children('A3'),
                        node('div').children('A4')
                    ]),
                    node('div').children('A5'),
                    // node(B).key('B'),
                    // node('div').children('A3')
                ])]);

            case 2:
                return node('div').children([node('fragment').children([
                    node('div').children('A1'),
                    node('div').children('A2'),
                    node('fragment').children([
                        node('div').key('A3').children('A3'),
                        node('div').children('A4'),
                        node('div').key('a').children('A44'),
                        node('div').children('A4_1')
                    ]),
                    node('div').children('A5'),
                    // node(B).key('B'),
                    // node('div').children('A3')
                ])]);

            case 3:
                return node('div').children([node('fragment').children([
                    node('div').children('A1'),
                    node('div').children('A2'),
                    node('fragment').children([
                        node(B),
                        node('div').key('A3').children('A3'),
                        node('div').children('A4'),
                        node('div').children('A4_1')
                    ]),
                    node('div').children('A5'),
                    node('div').children('A6'),
                    // node(B).key('B'),
                    // node('div').children('A3')
                ])]);
        }
    }

    onMount() {
        console.log('A', this.getDomNode());
    }
}

class B extends Component {
    onInitialStateRequest() {
        return { b : 1 };
    }

    onRender() {
        switch(this.getState().b) {
            case 1:
                return node('a').children('a');

            case 2:
                return node('b').children('b');

            case 3:
                return node('i').children('i');
        }
    }

    onMount() {
        console.log('B', this.getDomNode());
        setTimeout(function() {
            this.setState({ b : 2 });
            setTimeout(function() {
                this.setState({ b : 3 });
            }.bind(this), 100);
        }.bind(this), 100);
    }
}

const root = document.getElementById('root'),
    tree = node(A).attrs({ a : 1 });

console.log(renderToString(tree));
root.innerHTML = renderToString(tree);

mount(root, tree);

setTimeout(function() {
    mount(root, node(A).attrs({ a : 2 }));
    setTimeout(function() {
        console.log('before 3');
        mount(root, node(A).attrs({ a : 3 }));
// // //     //     setTimeout(function() {
// // //     //         mount(document.getElementById('root'), node('div').children([
// // //     //             node('div').children('-1'),
// // //     //             node(A).attrs({ a : false }),
// // //     //             node('div').children('+1')
// // //     //         ]));
// // //     //     }, 100);
    }, 70);
}, 100);

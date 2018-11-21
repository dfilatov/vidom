import { Component, mount, unmount, elem, renderToString } from 'vidom';
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
    onInit() {
        this.setState({ b : 1 });
    }

    onRender() {
        switch(this.state.b) {
            case 1:
                return <a>a</a>;

            case 2:
                return <b>b</b>;

            case 3:
                return <i>c</i>;
        }
    }

    onMount() {
        setTimeout(function() {
            // this.attrs = {};
            this.setState({ b : 2 });
            setTimeout(function() {
                this.setState({ b : 3 });
            }.bind(this), 100);
        }.bind(this), 100);
    }
}

const root = document.getElementById('root');

// console.log(renderToString(tree));
// root.innerHTML = renderToString(tree);

mount(root, ['a', 'b']);

setTimeout(() => {
    mount(root, ['b', 'a']);
}, 500)

setTimeout(function() {
    mount(root, <A b={ 2 }/>);
    setTimeout(function() {
        console.log('before 3');
        mount(root, <A b={ 3 }/>);
// //     //     setTimeout(function() {
// //     //         mount(document.getElementById('root'), node('div').children([
// //     //             node('div').children('-1'),
// //     //             node(A).attrs({ a : false }),
// //     //             node('div').children('+1')
// //     //         ]));
// //     //     }, 100);
    }, 70);
}, 100);

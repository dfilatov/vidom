import * as vidom from './vidom';

class A extends vidom.Component<{ a: string; }>{
    onRender(): vidom.Node {
        return null;
    }
}


const f = vidom.h('fragment', { key : 'sds' });

import { IS_DEBUG } from './utils/debug';
import console from './utils/console';

function Ref() {
    this._resolver = null;
}

Ref.prototype = {
    setResolver(resolver) {
        this._resolver = resolver;
    },

    resolve() {
        if(IS_DEBUG) {
            if(!this._resolver) {
                console.error('Reference can\'t be resolved.');
            }
        }

        return this._resolver();
    }
};

export default function createRef() {
    return new Ref();
}

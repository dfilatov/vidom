import { IS_DEBUG } from './debug';

const obj = {};

if(IS_DEBUG) {
    Object.freeze(obj);
}

export default obj;
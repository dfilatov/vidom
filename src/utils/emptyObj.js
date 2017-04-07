import { IS_DEBUG } from './debug';

const obj = Object.create(null);

if(IS_DEBUG) {
    Object.freeze(obj);
}

export default obj;

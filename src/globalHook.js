import Emitter from './utils/Emitter';
import { getMountedRootNodes } from './client/mounter';

const hook = new Emitter();

hook.getRootNodes = getMountedRootNodes;

if(process.env.NODE_ENV !== 'production') {
    if(typeof window !== 'undefined') {
        window.__vidom__hook__ = hook;
    }
}

export default hook;

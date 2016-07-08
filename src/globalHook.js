import Emitter from './utils/Emitter';
import { IS_DEBUG } from './utils/debug';
import { getMountedRootNodes } from './client/mounter';

const hook = new Emitter();

hook.getRootNodes = getMountedRootNodes;

if(IS_DEBUG) {
    if(typeof window !== 'undefined') {
        window['__vidom__hook__'] = hook;
    }
}

export default hook;

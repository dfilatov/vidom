import { IS_DEBUG } from '../../utils/debug';

const KEY_SET = 1,
    REF_SET = 2;

export function setKey(key) {
    if(IS_DEBUG) {
        if(this._sets & KEY_SET) {
            console.warn('Key is already set and shouldn\'t be set again');
        }

        this.__isFrozen = false;
    }

    this.key = key;

    if(IS_DEBUG) {
        this._sets |= KEY_SET;
        this.__isFrozen = true;
    }

    return this;
}

export function setRef(ref) {
    if(IS_DEBUG) {
        if(this._sets & REF_SET) {
            console.warn('Ref is already set and shouldn\'t be set again.');
        }
    }

    this._ref = ref == null? null : ref;

    if(IS_DEBUG) {
        this._sets |= REF_SET;
    }

    return this;
}

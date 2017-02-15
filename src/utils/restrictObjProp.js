export default function restrictObjProp(obj, prop) {
    const hiddenProp = `__${prop}__`;

    Object.defineProperty(obj, prop, {
        get() {
            return obj[hiddenProp];
        },

        set(value) {
            if(obj.__isFrozen) {
                throw TypeError(`vidom: ${prop} is readonly`);
            }

            obj[hiddenProp] = value;
        }
    });
}

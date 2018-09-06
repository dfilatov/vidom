export default function merge(source1, source2, overrideWithUndefined) {
    const res = {};

    for(const key in source1) {
        res[key] = source1[key];
    }

    for(const key in source2) {
        const val = source2[key];

        if(overrideWithUndefined || typeof val !== 'undefined') {
            res[key] = val;
        }
    }

    return res;
}

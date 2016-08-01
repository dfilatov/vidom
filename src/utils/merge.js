export default function merge(source1, source2) {
    const res = {};

    for(let key in source1) {
        res[key] = source1[key];
    }

    for(let key in source2) {
        res[key] = source2[key];
    }

    return res;
};

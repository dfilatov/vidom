function calcPatch(treeA, treeB, res) {
    res || (res = []);
    treeA.calcPatch(treeB, res);
    return res;
}

module.exports = calcPatch;

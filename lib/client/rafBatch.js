var raf = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            return setTimeout(callback, 1000 / 60);
        },
    batch = [];

function applyBatch() {
    var i = 0,
        item;

    while(i < batch.length) {
        item = batch[i++];
        item.fn.call(item.fnCtx || this);
    }

    batch = [];
}

function rafBatch(fn, fnCtx) {
    batch.push({ fn : fn, fnCtx : fnCtx }) === 1 && raf(applyBatch);
}

module.exports = rafBatch;

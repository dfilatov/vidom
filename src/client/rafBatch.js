const raf = global.requestAnimationFrame ||
    global.webkitRequestAnimationFrame ||
    global.mozRequestAnimationFrame ||
    function(callback) {
        return setTimeout(callback, 1000 / 60);
    };

let batch = [];

function applyBatch() {
    let i = 0;

    while(i < batch.length) {
        batch[i++]();
    }

    batch = [];
}

function rafBatch(fn) {
    batch.push(fn) === 1 && raf(applyBatch);
}

export default rafBatch;

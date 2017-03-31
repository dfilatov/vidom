const raf = typeof window !== 'undefined' &&
    (window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame) ||
    (callback => {
        setTimeout(callback, 1000 / 60);
    });

let batch = [];

function applyBatch() {
    let i = 0;

    while(i < batch.length) {
        batch[i++]();
    }

    batch = [];
}

export default function rafBatch(fn) {
    if(batch.push(fn) === 1) {
        raf(applyBatch);
    }
}

export { applyBatch };

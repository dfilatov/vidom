const raf = typeof window !== 'undefined' &&
    (window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame) ||
    (callback => {
        setTimeout(callback, 1000 / 60);
    });

let batch = [];

function compareBatchItems(itemA, itemB) {
    return itemA.priority - itemB.priority;
}

function applyBatch() {
    let i = 0;

    while(i < batch.length) {
        batch.sort(compareBatchItems);

        const batchLen = batch.length;

        while(i < batchLen) {
            const { fn, ctx } = batch[i++];

            fn.call(ctx);
        }

        if(batch.length > batchLen) {
            batch = batch.slice(batchLen);
            i = 0;
        }
    }

    batch = [];
}

export default function rafBatch(item) {
    if(batch.push(item) === 1) {
        raf(applyBatch);
    }
}

export { applyBatch };

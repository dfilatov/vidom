import patchOps from '../../client/patchOps';

export default function patchChildren(nodeA, nodeB) {
    const childrenA = nodeA.children,
        childrenB = nodeB.children,
        childrenALen = childrenA.length,
        childrenBLen = childrenB.length;

    if(childrenALen === 1 && childrenBLen === 1) {
        childrenA[0].patch(childrenB[0]);
        return;
    }

    let leftIdxA = 0,
        rightIdxA = childrenALen - 1,
        leftChildA = childrenA[leftIdxA],
        leftChildAKey = leftChildA.key,
        rightChildA = childrenA[rightIdxA],
        rightChildAKey = rightChildA.key,
        leftIdxB = 0,
        rightIdxB = childrenBLen - 1,
        leftChildB = childrenB[leftIdxB],
        leftChildBKey = leftChildB.key,
        rightChildB = childrenB[rightIdxB],
        rightChildBKey = rightChildB.key,
        updateIdxs = 0, // 1 — left A, 2 — right A, 4 — left B, 8 — right B
        childrenAKeys = null,
        foundAChildIdx, foundAChild;
    const childrenAIndicesToSkip = Object.create(null);

    while(leftIdxA <= rightIdxA && leftIdxB <= rightIdxB) {
        if(leftIdxA in childrenAIndicesToSkip) {
            updateIdxs = 1;
        }
        else if(rightIdxA in childrenAIndicesToSkip) {
            updateIdxs = 2;
        }
        else if(leftChildAKey === leftChildBKey) {
            leftChildA.patch(leftChildB);
            updateIdxs = 5;
        }
        else if(rightChildAKey === rightChildBKey) {
            rightChildA.patch(rightChildB);
            updateIdxs = 10;
        }
        else if(leftChildAKey !== null && leftChildAKey === rightChildBKey) {
            patchOps.moveChild(leftChildA, rightChildA, true);
            leftChildA.patch(rightChildB);
            updateIdxs = 9;
        }
        else if(rightChildAKey !== null && rightChildAKey === leftChildBKey) {
            patchOps.moveChild(rightChildA, leftChildA, false);
            rightChildA.patch(leftChildB);
            updateIdxs = 6;
        }
        else if(leftChildAKey !== null && leftChildBKey === null) {
            patchOps.insertChild(leftChildB, leftChildA);
            updateIdxs = 4;
        }
        else if(leftChildAKey === null && leftChildBKey !== null) {
            patchOps.removeChild(leftChildA);
            updateIdxs = 1;
        }
        else {
            if(childrenAKeys === null) {
                childrenAKeys = buildKeys(childrenA, leftIdxA, rightIdxA);
            }

            if(leftChildBKey in childrenAKeys) {
                foundAChildIdx = childrenAKeys[leftChildBKey];
                foundAChild = childrenA[foundAChildIdx];
                childrenAIndicesToSkip[foundAChildIdx] = true;
                patchOps.moveChild(foundAChild, leftChildA, false);
                foundAChild.patch(leftChildB);
            }
            else {
                patchOps.insertChild(leftChildB, leftChildA);
            }

            updateIdxs = 4;
        }

        if((updateIdxs & 1) === 1) {
            if(++leftIdxA <= rightIdxA) {
                leftChildA = childrenA[leftIdxA];
                leftChildAKey = leftChildA.key;
            }
        }

        if((updateIdxs & 2) === 2) {
            if(--rightIdxA >= leftIdxA) {
                rightChildA = childrenA[rightIdxA];
                rightChildAKey = rightChildA.key;
            }
        }

        if((updateIdxs & 4) === 4) {
            if(++leftIdxB <= rightIdxB) {
                leftChildB = childrenB[leftIdxB];
                leftChildBKey = leftChildB.key;
            }
        }

        if((updateIdxs & 8) === 8) {
            if(--rightIdxB >= leftIdxB) {
                rightChildB = childrenB[rightIdxB];
                rightChildBKey = rightChildB.key;
            }
        }

        updateIdxs = 0;
    }

    while(leftIdxA <= rightIdxA) {
        if(!(leftIdxA in childrenAIndicesToSkip)) {
            patchOps.removeChild(childrenA[leftIdxA]);
        }
        ++leftIdxA;
    }

    while(leftIdxB <= rightIdxB) {
        if(rightIdxB < childrenBLen - 1) {
            patchOps.insertChild(childrenB[leftIdxB], childrenB[rightIdxB + 1]);
        }
        else {
            patchOps.appendChild(nodeB, childrenB[leftIdxB]);
        }

        ++leftIdxB;
    }
};

function buildKeys(children, idxFrom, idxTo) {
    const res = Object.create(null);
    let childKey;

    while(idxFrom < idxTo) {
        childKey = children[idxFrom].key;
        if(childKey !== null) {
            res[childKey] = idxFrom;
        }
        ++idxFrom;
    }

    return res;
}

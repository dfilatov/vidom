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
        updateLeftIdxA = false,
        updateRightIdxA = false,
        updateLeftIdxB = false,
        updateRightIdxB = false,
        childrenAKeys, foundAChildIdx, foundAChild;
    const childrenAIndicesToSkip = {};

    while(leftIdxA <= rightIdxA && leftIdxB <= rightIdxB) {
        if(childrenAIndicesToSkip[leftIdxA]) {
            updateLeftIdxA = true;
        }
        else if(childrenAIndicesToSkip[rightIdxA]) {
            updateRightIdxA = true;
        }
        else if(leftChildAKey === leftChildBKey) {
            leftChildA.patch(leftChildB);
            updateLeftIdxA = true;
            updateLeftIdxB = true;
        }
        else if(rightChildAKey === rightChildBKey) {
            rightChildA.patch(rightChildB);
            updateRightIdxA = true;
            updateRightIdxB = true;
        }
        else if(leftChildAKey != null && leftChildAKey === rightChildBKey) {
            patchOps.moveChild(leftChildA, rightChildA, true);
            leftChildA.patch(rightChildB);
            updateLeftIdxA = true;
            updateRightIdxB = true;
        }
        else if(rightChildAKey != null && rightChildAKey === leftChildBKey) {
            patchOps.moveChild(rightChildA, leftChildA, false);
            rightChildA.patch(leftChildB);
            updateRightIdxA = true;
            updateLeftIdxB = true;
        }
        else if(leftChildAKey != null && leftChildBKey == null) {
            patchOps.insertChild(leftChildB, leftChildA);
            updateLeftIdxB = true;
        }
        else if(leftChildAKey == null && leftChildBKey != null) {
            patchOps.removeChild(leftChildA);
            updateLeftIdxA = true;
        }
        else {
            childrenAKeys || (childrenAKeys = buildKeys(childrenA, leftIdxA, rightIdxA));
            if((foundAChildIdx = childrenAKeys[leftChildBKey]) == null) {
                patchOps.insertChild(leftChildB, leftChildA);
            }
            else {
                foundAChild = childrenA[foundAChildIdx];
                childrenAIndicesToSkip[foundAChildIdx] = true;
                patchOps.moveChild(foundAChild, leftChildA, false);
                foundAChild.patch(leftChildB);
            }
            updateLeftIdxB = true;
        }

        if(updateLeftIdxA) {
            updateLeftIdxA = false;
            if(++leftIdxA <= rightIdxA) {
                leftChildA = childrenA[leftIdxA];
                leftChildAKey = leftChildA.key;
            }
        }

        if(updateRightIdxA) {
            updateRightIdxA = false;
            if(--rightIdxA >= leftIdxA) {
                rightChildA = childrenA[rightIdxA];
                rightChildAKey = rightChildA.key;
            }
        }

        if(updateLeftIdxB) {
            updateLeftIdxB = false;
            if(++leftIdxB <= rightIdxB) {
                leftChildB = childrenB[leftIdxB];
                leftChildBKey = leftChildB.key;
            }
        }

        if(updateRightIdxB) {
            updateRightIdxB = false;
            if(--rightIdxB >= leftIdxB) {
                rightChildB = childrenB[rightIdxB];
                rightChildBKey = rightChildB.key;
            }
        }
    }

    while(leftIdxA <= rightIdxA) {
        if(!childrenAIndicesToSkip[leftIdxA]) {
            patchOps.removeChild(childrenA[leftIdxA]);
        }
        ++leftIdxA;
    }

    while(leftIdxB <= rightIdxB) {
        rightIdxB < childrenBLen - 1?
            patchOps.insertChild(childrenB[leftIdxB], childrenB[rightIdxB + 1]) :
            patchOps.appendChild(nodeB, childrenB[leftIdxB]);
        ++leftIdxB;
    }
};

function buildKeys(children, idxFrom, idxTo) {
    const res = {};
    let child;

    while(idxFrom < idxTo) {
        child = children[idxFrom];
        child.key != null && (res[child.key] = idxFrom);
        ++idxFrom;
    }

    return res;
}

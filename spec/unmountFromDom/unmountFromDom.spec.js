import sinon from 'sinon';
import createNode from '../../lib/createNode';
import { mountToDom, unmountFromDom } from '../../lib/client/mounter';

describe('unmountFromDom', () => {
    var domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        document.body.removeChild(domNode);
    });

    describe('callbacks', () => {
        it('should properly call callback on unmount', function(done) {
            mountToDom(domNode, createNode('div'), () => {
                unmountFromDom(domNode, () => {
                    expect(domNode.childNodes.length).to.equal(0);
                    done();
                });
            });
        });

        it('should properly call callback if there\'s no mounted tree', function(done) {
            unmountFromDom(domNode, () => {
                done();
            });
        });
    });
});

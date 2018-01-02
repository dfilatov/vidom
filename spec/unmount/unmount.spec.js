import { elem, mount, unmount } from '../../src/vidom';

describe('unmount', () => {
    var domNode;
    beforeEach(() => {
        document.body.appendChild(domNode = document.createElement('div'));
    });

    afterEach(() => {
        document.body.removeChild(domNode);
    });

    describe('callbacks', () => {
        it('should properly call callback on unmount', function(done) {
            mount(domNode, elem('div'), () => {
                unmount(domNode, () => {
                    expect(domNode.childNodes.length).to.equal(0);
                    done();
                });
            });
        });

        it('should properly call callback if there\'s no mounted tree', function(done) {
            unmount(domNode, () => {
                done();
            });
        });
    });
});

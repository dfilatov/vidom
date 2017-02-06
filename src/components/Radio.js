import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';
import SimpleMap from '../utils/SimpleMap';

const namedRadioInputs = new SimpleMap();

export default createComponent({
    onInit() {
        this._addAttrs = {
            onChange : e => {
                this.onChange(e);
            }
        };
    },

    onRender() {
        return new TagNode('input').attrs(merge(this.attrs, this._addAttrs));
    },

    onMount() {
        const { name } = this.attrs;

        if(name) {
            addToNamedRadioInputs(name, this);
        }
    },

    onUpdate({ name : prevName }) {
        const { name } = this.attrs;

        if(name !== prevName) {
            if(prevName) {
                removeFromNamedRadioInputs(prevName, this);
            }

            if(name) {
                addToNamedRadioInputs(name, this);
            }
        }
    },

    onUnmount() {
        const { name } = this.attrs;

        if(name) {
            removeFromNamedRadioInputs(name, this);
        }
    },

    onChange(e) {
        const { onChange } = this.attrs;

        onChange && onChange(e);

        applyBatch();

        if(this.isMounted()) {
            const control = this.getDomNode(),
                { name, checked } = this.attrs; // attrs could be changed during applyBatch()

            if(typeof checked !== 'undefined' && control.checked !== checked) {
                if(name) {
                    const radioInputs = namedRadioInputs.get(name),
                        len = radioInputs.length;
                    let i = 0,
                        radioInput,
                        checked;

                    while(i < len) {
                        radioInput = radioInputs[i++];
                        checked = radioInput.attrs.checked;

                        if(typeof checked !== 'undefined') {
                            const radioControl = radioInput.getDomNode();

                            if(checked !== radioControl.checked) {
                                radioControl.checked = checked;
                            }
                        }
                    }
                }
                else {
                    control.checked = checked;
                }
            }
        }
    },

    onRefRequest() {
        return this.getDomNode();
    }
});

function addToNamedRadioInputs(name, input) {
    const radioInputs = namedRadioInputs.get(name);

    if(radioInputs) {
        radioInputs.push(input);
    }
    else {
        namedRadioInputs.set(name, [input]);
    }
}

function removeFromNamedRadioInputs(name, input) {
    const radioInputs = namedRadioInputs.get(name),
        len = radioInputs.length;
    let i = 0;

    while(i < len) {
        if(radioInputs[i] === input) {
            if(len === 1) {
                namedRadioInputs.delete(name);
            }
            else {
                radioInputs.splice(i, 1);
            }

            return;
        }

        i++;
    }
}

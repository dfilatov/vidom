import createComponent from '../createComponent';
import TagNode from '../nodes/TagNode';
import { applyBatch } from '../client/rafBatch';
import merge from '../utils/merge';

const namedRadioInputs = {};

export default createComponent({
    onInit() {
        this.onInput = e => {
            let attrs = this.getAttrs();

            attrs.onInput && attrs.onInput(e);
            attrs.onChange && attrs.onChange(e);

            applyBatch();

            if(this.isMounted()) {
                const control = this.getDomRef('control'),
                    { value } = this.getAttrs(); // attrs could be changed during applyBatch()

                if(typeof value !== 'undefined' && control.value !== value) {
                    control.value = value;
                }
            }
        };

        this.onChange = e => {
            const attrs = this.getAttrs(),
                control = this.getDomRef('control');

            attrs.onChange && attrs.onChange(e);

            applyBatch();

            if(this.isMounted()) {
                const { name, type, checked } = this.getAttrs(); // attrs could be changed during applyBatch()

                if(typeof checked !== 'undefined' && control.checked !== checked) {
                    if(type === 'radio' && name) {
                        const radioInputs = namedRadioInputs[name],
                            len = radioInputs.length;
                        let i = 0,
                            radioInput,
                            checked;

                        while(i < len) {
                            radioInput = radioInputs[i++];
                            checked = radioInput.getAttrs().checked;

                            if(typeof checked !== 'undefined') {
                                const radioControl = radioInput.getDomRef('control');

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
        };
    },

    onRender(attrs) {
        let controlAttrs;

        if(attrs.type === 'file') {
            controlAttrs = attrs;
        }
        else {
            controlAttrs = merge(attrs, { onChange : null });

            if(attrs.type === 'checkbox' || attrs.type === 'radio') {
                controlAttrs.onChange = this.onChange;
            }
            else {
                controlAttrs.onInput = this.onInput;
            }
        }

        return this.setDomRef(
            'control',
            new TagNode('input').attrs(controlAttrs));
    },

    onMount({ type, name }) {
        if(type === 'radio' && name) {
            addToNamedRadioInputs(name, this);
        }
    },

    onUpdate({ type, name }, { type : prevType, name : prevName }) {
        if(prevType === 'radio') {
            if(type !== prevType) {
                if(prevName) {
                    removeFromNamedRadioInputs(prevName, this);
                }
            }
            else if(name !== prevName) {
                if(prevName) {
                    removeFromNamedRadioInputs(prevName, this);
                }

                if(name) {
                    addToNamedRadioInputs(name, this);
                }
            }
        }
        else if(type === 'radio' && name) {
            addToNamedRadioInputs(name, this);
        }
    },

    onUnmount() {
        const { type, name } = this.getAttrs();

        if(type === 'radio' && name) {
            removeFromNamedRadioInputs(name, this);
        }
    }
});

function addToNamedRadioInputs(name, input) {
    (namedRadioInputs[name] || (namedRadioInputs[name] = [])).push(input);
}

function removeFromNamedRadioInputs(name, input) {
    const radioInputs = namedRadioInputs[name],
        len = radioInputs.length;
    let i = 0;

    while(i < len) {
        if(radioInputs[i] === input) {
            if(len === 1) {
                delete namedRadioInputs[name];
                return;
            }
            else {
                radioInputs.splice(i, 1);
                break;
            }
        }

        i++;
    }
}

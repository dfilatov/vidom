import createElement from '../../../src/createElement';

export default {
    'name' : 'removeAttr5',
    'trees' : [
        createElement('input'),
        createElement('input').setAttrs({ className : null })
    ],
    'patch' : []
};

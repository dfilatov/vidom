import createElement from '../../../src/createElement';

export default {
    'name' : 'removeAttr4',
    'trees' : [
        createElement('input').setAttrs({ className : null }),
        createElement('input')
    ],
    'patch' : []
};

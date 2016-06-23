"use strict";

const CHILDREN_NUM = 100;

module.exports = {
    'react' : require('./react')(CHILDREN_NUM),
    'inferno' : require('./inferno')(CHILDREN_NUM),
    'vidom' : require('./vidom')(CHILDREN_NUM)
};

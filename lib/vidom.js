var mounter = require('./client/mounter');

module.exports = {
    createComponent : require('./createComponent'),
    createNode : require('./createNode'),
    mountToDom : mounter.mountToDom,
    unmountFromDom : mounter.unmountFromDom
};

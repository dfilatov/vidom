function UpdateComponent(instance, patch) {
    this._instance = instance;
    this._patch = patch;
}

UpdateComponent.prototype = {
    applyTo : function(domNode) {
        this._instance.patchDom(this._patch);
    }
};

module.exports = UpdateComponent;

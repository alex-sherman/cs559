Component = Class.extend({
    type: "Component",
    init: function() {
        this.entity = null;
    }
})

EntityCallbackFunc = function(propertyName) {
    return function() {
        for (var i = 0; i < this.components.length; i++) {
            var comp = this.components[i];
            if(propertyName in comp && typeof comp[propertyName] == "function") {
                comp[propertyName].apply(comp, arguments);
            }
        }
    }
}
Entity = Class.extend({
    type: "Entity",
    init: function() {
        components = arguments || [];
        this.components = [];
        this.callbacks = {};
        for (var i = 0; i < components.length; i++) {
            this.addComponent(components[i]);
        };
    },
    addComponent: function(component) {
        var propName = component.getType().typeName;
        if(!propName) throw new Error("Components must have a type name defined");
        this.components.push(component);
        this[propName] = component;
        component.entity = this;
        if(component.callbacks) {
            for(cbname in component.callbacks) {
                if(!cbname in this.callbacks) {
                    this.callbacks[cbname] = [];
                    this[cbname] = Entity.callbackFunc;
                }
                this.callbacks[cbname].push(component.callbacks[cbname]);
            }
        }
    },
    update: EntityCallbackFunc("update"),
    draw: EntityCallbackFunc("draw")
});
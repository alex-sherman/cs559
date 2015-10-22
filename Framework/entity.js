Component = Class.extend({
    init: (function Component() {
        this.entity = null;
    })
})

EntityCallthrough = function(propertyName) {
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
    init: (function Entity() {
        Entity.entities.push(this);
        components = arguments || [];
        this.components = [];
        this.callbacks = {};
        for (var i = 0; i < components.length; i++) {
            this.addComponent(components[i]);
        };
    }),
    addComponent: function(component) {
        var propName = component.getType().name;
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
    update: EntityCallthrough("update"),
    draw: EntityCallthrough("draw")
});

Entity.entities = [];
Component = Class.extend({
    type: "Component",
    init: function() {
        this.entity = null;
    }
})

Entity = Class.extend({
    type: "Entity",
    init: function() {
        components = arguments || [];
        this.components = [];
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
    },
    update: function(dt) {
        for (var i = 0; i < this.components.length; i++) {
            var comp = this.components[i];
            if(comp.update && typeof comp.update == "function") {
                comp.update(dt);
            }
        };
    }
})
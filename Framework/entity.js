Component = Class.extend({
    init: (function Component() {
        this.loaded = false;
        this.entity = null;
        this.deferreds = []
    }),
    finalize: function() {
        return $.when.apply(null, this.deferreds);
    }
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
        components = arguments || [];
        this.components = [];
        this.finalized = false;
        for (var i = 0; i < components.length; i++) {
            this.addComponent(components[i]);
        };
    }),
    addComponent: function(component) {
        if(this.finalized) throw new Error("Can't add components to a finalized Entity");
        var propName = component.getType().name;
        if(!propName) throw new Error("Components must have a type name defined");
        this.components.push(component);
        this[propName] = component;
        component.entity = this;
    },
    update: EntityCallthrough("update"),
    draw: EntityCallthrough("draw"),
    finalize: function(callback) {
        this.finalized = true;
        var self = this;
        var promise = $.when.apply(null, this.components.map(function(comp) { return comp.finalize(); }));
        promise.then(
            function() { 
                Entity.entities.push(self);
                if(callback)
                    callback.apply(self);
            });
        return promise;
    }
});

Entity.entities = [];
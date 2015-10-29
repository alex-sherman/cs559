Behavior = Component.extend({
    init: (function Behavior(state, update) {
        Component.init.apply(this);
        for(var key in state)
            this[key] = state[key];
        this.update = update;
    })
});
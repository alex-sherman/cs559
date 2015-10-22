Behavior = Component.extend({
    init: (function Behavior(state, update) {
        for(var key in state)
            this[key] = state[key];
        this.update = update;
    })
});
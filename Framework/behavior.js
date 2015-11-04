Behavior = Component.extend({
    init: (function Behavior(state, update) {
        Component.init.apply(this);
        this._update = update;
        this.state = state;
    }),
    update: function(dt) {
        this._update.apply(this.entity, [dt, this.state])
    }
});
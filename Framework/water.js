Water = Component.extend({
    init: (function Water() {
        this.base.init.apply(this)
        this.reflectionTarget = new RenderTarget(1024, 1024);
    }),
});
Water.height = 5;
Water.drawToTargets = function(entities, camera) {

}
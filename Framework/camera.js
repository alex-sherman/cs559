Camera = Component.extend({
    init: (function Camera(){
        this.base.init.apply(this);
        this.offset = 10;
        this.view = mat4.create();
        this.reflectionView = mat4.create();
        this.position = vec3.create();
    }),
    update: function() {
        vec3.set(this.position, 0, 0, this.offset);
        vec3.transformQuat(this.position, this.position, this.entity.Pose.rotation);
        vec3.add(this.position, this.entity.Pose.position, this.position);
        mat4.lookAt(this.view, this.position, observer.Pose.position, [0, 1, 0]);
    }
});
Camera = Component.extend({
    init: (function Camera(){
        this.base.init.apply(this);
        this.offset = 20;
        this.view = mat4.create();
        this.reflectionView = mat4.create();
        this.position = vec3.create();
    }),
    update: function() {
        vec3.set(this.position, 0, 0, this.offset);
        vec3.transformQuat(this.position, this.position, this.entity.Pose.rotation);
        vec3.add(this.position, this.entity.Pose.position, this.position);
        mat4.lookAt(this.view, this.position, observer.Pose.position, [0, 1, 0]);
        mat4.lookAt(this.reflectionView,
            [this.position[0], Water.height + (Water.height - this.position[1]), this.position[2]],
            [observer.Pose.position[0], Water.height + (Water.height - observer.Pose.position[1]), observer.Pose.position[2]], [0, 1, 0]);
    }
});
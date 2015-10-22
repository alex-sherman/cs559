Pose = Component.extend({
    init: (function Pose() {
        Component.init.apply(this);
        this.transform = mat4.create();
        this.normalTransform = mat3.create();
        this.position = vec3.create();
        this.scale = vec3.fromValues(1,1,1);
        this.rotation = quat.create();
    }),
    face: function(direction) {
        quat.identity(this.rotation);
        quat.rotateY(this.rotation, this.rotation, Math.atan2(direction[0], direction[2]));
        quat.rotateX(this.rotation, this.rotation, -Math.PI / 2);
    },
    update: function(dt) {
        mat4.fromRotationTranslation(this.transform, this.rotation, this.position);
        mat4.scale(this.transform, this.transform, this.scale);
        mat3.normalFromMat4(this.normalTransform, this.transform);
    }
});
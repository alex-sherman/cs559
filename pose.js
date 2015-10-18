Pose = Component.extend({
    init: (function Pose() {
        Component.init.apply(this);
        this.transform = mat4.create();
        this.normalTransform = mat3.create();
        this.position = vec3.create();
        this.rotation = quat.create();
    }),
    update: function(dt) {
        mat4.fromRotationTranslation(this.transform, this.rotation, this.position);
        mat3.normalFromMat4(this.normalTransform, this.transform);
    }
});
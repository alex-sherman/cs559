Skeleton = Component.extend({
    type: "Skeleton",
    init: function(root) {
        Component.init.apply(this);
        this.bones = {}
    },
    addBone: function(bone, parent) {
        this.bones[bone.name] = bone;
        bone.skeleton = this;
        bone.parent = this.bones[parent];
    }
    
})

Bone = Class.extend({
    init: function(name, invBindPose) {
        this.name = name;
        this.skeleton = null;
        this.parent = null;
        this.invBindPose = invBindPose || new Matrix();
        this.prev_kf = new KeyFrame(0, this.name);
        this.next_kf = new KeyFrame(0, this.name);
        this.transform = new Matrix();
    },
    withParentTransform: function() {
        return this.parent == null ? this.transform : this.parent.withParentTransform().mul(this.transform);
    },
    absoluteTransform: function() {
        return this.withParentTransform().mul(this.invBindPose);
    }
});
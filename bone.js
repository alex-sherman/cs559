Skeleton = Component.extend({
    init: (function Skeleton() {
        Component.init.apply(this);
        this.bones = {}
    }),
    addBone: function(bone, parent) {
        this.bones[bone.name] = bone;
        bone.skeleton = this;
        bone.parent = parent;
    },
    update: function(dt) {
        for(bone in this.bones) {
            this.bones[bone].currentTransform = this.bones[bone].absoluteTransform();
        }
    }
})

Bone = Class.extend({
    init: (function Bone(name, invBindPose) {
        this.name = name;
        this.skeleton = null;
        this.parent = null;
        this.invBindPose = invBindPose || mat4.create();
        this.prev_kf = new KeyFrame(0, this.name);
        this.next_kf = new KeyFrame(0, this.name);
        this.transform = mat4.create();
        this._withParentTransform = mat4.create();
        this.currentTransform = mat4.create();
    }),
    withParentTransform: function() {
        if(this.parent == null)
            this._withParentTransform = this.transform;
        else
            mat4.mul(this._withParentTransform, this.parent.withParentTransform(), this.transform);
        return this._withParentTransform;
    },
    absoluteTransform: function() {
        return mat4.mul(this.currentTransform, this.withParentTransform(), this.invBindPose);
    }
});
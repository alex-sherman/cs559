Skeleton = Component.extend({
    init: (function Skeleton() {
        Component.init.apply(this);
        this.bones = {}
    }),
    addBone: function(bone) {
        this.bones[bone.name] = bone;
        bone.skeleton = this;
    },
    update: function(dt) {
        for(bone in this.bones) {
            this.bones[bone].update();
        }
    }
});

Bone = Class.extend({
    init: (function Bone(name, parent, rot, tran) {
        this.name = name;
        this.skeleton = null;
        this.parent = parent;
        this.defRot = rot;
        this.defTran = tran;
        this.transform = mat4.create();
        //mat4.fromQuat(this.transform, rot);
        //mat4.translate(this.transform, this.transform, tran);
        mat4.fromRotationTranslation(this.transform, rot, tran);
        this._withParentTransform = mat4.create();
        this.currentTransform = mat4.create();
        this.currentTransformN = mat4.create();
        this.invBindPose = mat4.create();
        mat4.invert(this.invBindPose, this.withParentTransform());
        this.bindPose = mat4.clone(this._withParentTransform);
        this.prev_kf = new KeyFrame(0, this.name);
        this.next_kf = new KeyFrame(0, this.name);
    }),
    withParentTransform: function() {
        return mat4.mul(this._withParentTransform, this.parent ? this.parent.withParentTransform() : mat4.create(), this.transform);
    },
    update: function() {
        mat4.mul(this.currentTransform, this.withParentTransform(), this.invBindPose);
        mat4.copy(this.currentTransformN, this.currentTransform);
        mat4.invert(this.currentTransformN, this.currentTransformN);
        mat4.transpose(this.currentTransformN, this.currentTransformN);
    }
});
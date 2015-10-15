KeyFrame = function(time, bone, translation, rotation) {
    this.time = time;
    this.translation = translation || null;
    this.rotation = rotation || null;
    this.bone = bone;
}
KeyFrame.lerp = function(bone, time, a, b) {
    var kf_delta = b.time - a.time;
    var kf_w = kf_delta == 0 ? 0 : (time - a.time) / kf_delta;
    var rot = quat.create();
    var tran = vec3.create();
    quat.slerp(rot, a.rotation || bone.defRot, b.rotation || bone.defRot, kf_w);
    vec3.lerp(tran, a.translation || bone.defTran, b.translation || bone.defTran, kf_w);
    mat4.fromRotationTranslation(bone.transform, rot, tran);
}

Animation = Component.extend({
    init: (function Animation() {
        Component.init.apply(this);
        this.keyFrames = [];
        this.time = 0;
        this.looping = true;
        this.length = 0;
        this.currentIndex = 0;
        this.speed = 1;
    }),
    addKeyFrame: function(time, bone, translation, rotation) {
        var i = 0;
        for (var i = 0; i < this.keyFrames.length && this.keyFrames[i].time < time; i++) {}
        this.keyFrames.splice(i, 0, new KeyFrame(time, bone, translation, rotation));
        this.length = Math.max.apply(null, this.keyFrames.map(function (kf) {
                return kf.time;
            }));
    },

    update: function(dt) { 
        this.time += dt * this.speed;
        var bones = this.entity.Skeleton.bones;
        //Updating keyframes we pass
        for (; this.keyFrames[this.currentIndex].time <= this.time; this.currentIndex ++) {
            var keyframe = this.keyFrames[this.currentIndex];
            var bone = bones[keyframe.bone];
            bone.prev_kf = keyframe;
            for(var i = this.currentIndex + 1; i < this.keyFrames.length; i++)
            {
                if(this.keyFrames[i].bone == bone.name) {
                    bone.next_kf = this.keyFrames[i];
                    break;
                }
            }
            if(this.currentIndex == this.keyFrames.length - 1) {
                this.time %= this.length;
                this.currentIndex = -1;
            }
        };

        //Interpolating all keyframes on each bone
        for(var bone_key in bones) {
            var bone = bones[bone_key];
            KeyFrame.lerp(bone, this.time, bone.prev_kf, bone.next_kf);
        }
    }
});
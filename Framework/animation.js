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
    init: (function Animation(clips) {
        Component.init.apply(this);
        this.clips = clips || {};
        this.time = 0;
        this.looping = true;
        this.currentIndex = 0;
        this.speed = 1;
        this.currentClip = null;
    }),
    play: function(clip) {
        this.time = 0;
        this.currentIndex = 0;
        this.currentClip = this.clips[clip];
        this.entity.Skeleton.resetKeyframes();
    },
    stop: function() { this.currentClip = null; },
    update: function(dt) {
        if(this.currentClip != null) {
            var keyFrames = this.currentClip.keyFrames;
            this.time += dt * this.speed;
            var bones = this.entity.Skeleton.bones;
            //Updating keyframes we pass
            for (; keyFrames[this.currentIndex].time <= this.time; this.currentIndex ++) {
                var keyframe = keyFrames[this.currentIndex];
                var bone = bones[keyframe.bone];
                bone.prev_kf = keyframe;
                for(var i = this.currentIndex + 1; i < keyFrames.length; i++)
                {
                    if(keyFrames[i].bone == bone.name) {
                        bone.next_kf = keyFrames[i];
                        break;
                    }
                }
                if(this.currentIndex == keyFrames.length - 1) {
                    if(this.currentClip.length == 0) {
                        this.time = 0;
                        break;
                    }
                    else
                        this.time %= this.currentClip.length;
                    this.currentIndex = -1;
                }
            };

            //Interpolating all keyframes on each bone
            for(var bone_key in bones) {
                var bone = bones[bone_key];
                KeyFrame.lerp(bone, this.time, bone.prev_kf, bone.next_kf);
            }
        }
    }
});
AnimationClip = Class.extend({
    init: (function AnimationClip(name) {
        this.name = name;
        this.length = 0;
        this.keyFrames = [];
    }),
    addKeyFrame: function(time, bone, translation, rotation) {
        var i = 0;
        for (var i = 0; i < this.keyFrames.length && this.keyFrames[i].time < time; i++) {}
        this.keyFrames.splice(i, 0, new KeyFrame(time, bone, translation, rotation));
        this.length = Math.max.apply(null, this.keyFrames.map(function (kf) {
                return kf.time;
            }));
    },
});
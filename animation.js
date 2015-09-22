KeyFrame = function(time, bone, translation, rotation) {
    this.time = time;
    this.translation = translation || new Vector(0,0,0);
    this.rotation = rotation || new Vector(0,0,0);
    this.bone = bone;
}
KeyFrame.lerp = function(time, a, b) {
    var kf_delta = b.time - a.time;
    var kf_w = kf_delta == 0 ? 0 : (time - a.time) / kf_delta;
    var rot = Vector.lerp(kf_w, a.rotation, b.rotation);
    var tran = Vector.lerp(kf_w, a.translation, b.translation);
    return MatrixCreateTranslationV(tran).mul(Matrix.CreateRotationV(rot));
}

Animation = Component.extend({
    type: "Animation",
    init: function() {
        Component.init.apply(this);
        this.keyFrames = [];
        this.time = 0;
        this.looping = true;
        this.length = 0;
        this.currentIndex = 0;
        this.speed = 1;
    },
    //TODO: Order on insert
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
        if(this.time > this.length)
        {
            for(var bone_key in bones) {
                var bone = bones[bone_key];
                bone.prev_kf = new KeyFrame(0, bone_key);
                bone.next_kf = new KeyFrame(0, bone_key);
            }
            this.time = 0;
            this.currentIndex = 0;
        }
        //Updating keyframes we pass
        for (; this.currentIndex < this.keyFrames.length && this.keyFrames[this.currentIndex].time <= this.time; this.currentIndex ++) {
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
        };

        //Interpolating all keyframes on each bone
        for(var bone_key in bones) {
            var bone = bones[bone_key];
            bone.transform = KeyFrame.lerp(this.time, bone.prev_kf, bone.next_kf);
        }
    }
});
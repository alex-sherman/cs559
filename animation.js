KeyFrame = function(time, bone, transform) {
    this.time = time;
    this.transform = transform;
    this.bone = bone;
}

Animation = function(root) {
    this.root = root;
    this.keyFrames = [];
    this.time = 0;
    this.looping = true;
    this.length = 0;
    this.currentIndex = 0;
    //TODO: Order on insert
    this.addKeyFrame = function(time, bone, transform) {
        this.keyFrames.push(new KeyFrame(time, bone, transform));
        this.length = Math.max.apply(null, this.keyFrames.map(function (kf) {
                return kf.time;
            }));
    }

    this.update = function(dt) { 
        this.time += dt;
        if(this.time > this.length)
        {
            for(var bone_key in this.root.bones) {
                var bone = this.root.bones[bone_key];
                bone.prev_kf = {time: 0, transform: new Matrix()};
                bone.next_kf = {time: 0, transform: new Matrix()};
            }
            this.time = 0;
            this.currentIndex = 0;
        }
        //Updating keyframes we pass
        for (; this.currentIndex < this.keyFrames.length && this.keyFrames[this.currentIndex].time <= this.time; this.currentIndex ++) {
            var keyframe = this.keyFrames[this.currentIndex];
            var bone = this.root.bones[keyframe.bone];
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
        for(var bone_key in this.root.bones) {
            var bone = this.root.bones[bone_key];
            var kf_delta = bone.next_kf.time - bone.prev_kf.time;
            var kf_w = kf_delta == 0 ? 0 : (this.time - bone.prev_kf.time) / kf_delta;
            bone.transform = bone.prev_kf.transform.lerp(kf_w, bone.next_kf.transform);
        }
    }
}
KeyFrame = function(time, values) {
    this.time = time;
    this.values = values;
    this.weightValues = function(weight) {
        output = this.values.slice(0);
        for (var i = 0; i < output.length; i++) {
            if(typeof output[i] == "object" && "type" in output[i]) {
                if(output[i].type == "Vector") {
                    output[i] = output[i].mul(weight);
                }
            }
            output[i] = output[i] * weight;
        };
        return output;
    }
}

Animation = function(keys) {
    this.keys = keys;
    this.keyFrames = [];
    this.time = 0;
    this.looping = true;
    this._length = 0;
    this._lengthDirty = false;
    this._currentState = {};
    this._currentStateDirty = true;
    //TODO: Order on insert
    this.addKeyFrame = function(time, values) {
        this.keyFrames.push(new KeyFrame(time, values));
        this._lengthDirty = true;
    }
    this.length = function() {
        if(this._lengthDirty) {
            this._length = Math.max.apply(null, this.keyFrames.map(function (kf) {
                    return kf.time;
                }));
            this._lengthDirty = false;
        }
        
        return this._length;
    }
    this.update = function(dt) { 
        this.time += dt;
        this.time %= this.length();
        this._currentStateDirty = true;
    }
    this.currentState = function() {
        if(this._currentStateDirty) {
            this._currentState = {};
            var next_kf = 0
            while (this.keyFrames[next_kf].time < this.time) {
                next_kf++;
            }
            next_kf %= this.keyFrames.length;

            var prev_kf = next_kf - 1;
            if (prev_kf == -1) prev_kf += this.keyFrames.length;
            next_kf = this.keyFrames[next_kf];
            prev_kf = this.keyFrames[prev_kf];

            var kf_delta = next_kf.time - (prev_kf.time % this.length());
            var kf_w = kf_delta > 0 ? (this.time - (prev_kf.time % this.length())) / kf_delta : 0;
            next_kf = next_kf.weightValues(kf_w);
            prev_kf = prev_kf.weightValues(1 - kf_w);
            for (var i = 0; i < this.keys.length; i++) {
                this._currentState[this.keys[i]] = next_kf[i] + prev_kf[i];
            };
            this._currentStateDirty = false;
        }
        return this._currentState;
    }
}
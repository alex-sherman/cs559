Bone = function(name, parent, invBindPose) {
    this.name = name;
    this.parent = parent;
    this.invBindPose = invBindPose || new Matrix();
    if(parent == null) {
        this.bones = {};
        this.bones[name] = this;
    }
    else {
        var curNode = this;
        while(curNode.parent != null) { curNode = curNode.parent; }
        curNode.bones[this.name] = this;
    }
    this.prev_kf = new KeyFrame(0, this.name);
    this.next_kf = new KeyFrame(0, this.name);
    this.transform = new Matrix();

    this.withParentTransform = function() {
        return this.parent == null ? this.transform : this.parent.withParentTransform().mul(this.transform);
    }
    this.absoluteTransform = function() {
        return this.withParentTransform().mul(this.invBindPose);
    }
}
Bone = function(name, parent) {
    this.name = name;
    this.parent = parent;
    if(parent == null) {
        this.bones = {};
        this.bones[name] = this;
    }
    else {
        var curNode = this;
        while(curNode.parent != null) { curNode = curNode.parent; }
        curNode.bones[this.name] = this;
    }
    this.prev_kf = {time: 0, transform: new Matrix()};
    this.next_kf = {time: 0, transform: new Matrix()};
    this.transform = new Matrix();

    this.withParentTransform = function() {
        return this.parent == null ? this.transform : this.parent.withParentTransform().mul(this.transform);
    }
}
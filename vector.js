Vector = function(x, y, z, w) {
    this.type = "Vector";
    this.x = typeof x == 'undefined' ? 0 : x;
    this.y = typeof y == 'undefined' ? 0 : y;
    this.z = typeof z == 'undefined' ? 0 : z;
    this.w = typeof w == 'undefined' ? 1 : w;

    this.dot = function(other) { 
        return this.x * other.x + this.y * other.y + this.z * other.z;
    };

    this.cross = function(other) {
        return new Vector(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x)
    };

    this.add = function(other) { 
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
    };

    this.sub = function(other) { 
        return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
    };

    this.mul = function(value) {
        return new Vector(this.x * value, this.y * value, this.z * value, this.w * value);
    };

    this.div = function(value) { return mul(1.0 / value); };

    this.normalize = function() {
        var length = this.length();
        if(length > 0){
            return this.mul(1 / length)
        }
        return new Vector();
    };

    this.length = function(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }
};
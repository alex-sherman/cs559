Matrix = Class.extend({
    init: (function Matrix(zero) {
        if(!zero)
            this.values = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
        else
            this.values = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    }),

    _mulIndex: function(other, i, j) {
        var output = 0;
        for (var k = 0; k < 4; k++) {
            output += this.values[k][j] * other.values[i][k];
        };
        return output;
    },

    mul: function(other) {
        var output = new Matrix();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                output.values[i][j] = this._mulIndex(other, i, j);
            };
        };
        return output;
    },
    derpLerp: function(w, other) {
        output = new Matrix();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                output.values[i][j] = this.values[i][j] + other.values[i][j] * w;
            };
        };
        return output;
    },
    lerp: function(w, other) {
        output = new Matrix();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                output.values[i][j] = this.values[i][j] * (1 - w) + other.values[i][j] * (w);
            };
        };
        return output;
    },
    _rowMul: function(j, v) {
            var output = 0;
            for (var i = 0; i < 4; i++) {
                output += this.values[i][j] * v[i];
            };
            return output;
    },
    transform: function(vector) {
        var vmatrix = [vector.x, vector.y, vector.z, vector.w];
        var output = new Vector(
            this._rowMul(0, vmatrix),
            this._rowMul(1, vmatrix),
            this._rowMul(2, vmatrix),
            this._rowMul(3, vmatrix));
        return output;
    }
});
Matrix.CreateRotationYPR = function(yaw, pitch, roll) {
    var RX = new Matrix();
    RX.values[1][1] = Math.cos(pitch)
    RX.values[2][2] = Math.cos(pitch)
    RX.values[2][1] = -Math.sin(pitch)
    RX.values[1][2] = Math.sin(pitch)

    var RY = new Matrix();
    RY.values[0][0] = Math.cos(yaw)
    RY.values[2][2] = Math.cos(yaw)
    RY.values[0][2] = -Math.sin(yaw)
    RY.values[2][0] = Math.sin(yaw)

    var RZ = new Matrix();
    RZ.values[0][0] = Math.cos(roll)
    RZ.values[1][1] = Math.cos(roll)
    RZ.values[1][0] = -Math.sin(roll)
    RZ.values[0][1] = Math.sin(roll)

    return RX.mul(RY).mul(RZ);
}
Matrix.CreateRotationV = function(vector) {
    var RX = new Matrix();
    RX.values[1][1] = Math.cos(vector.x)
    RX.values[2][2] = Math.cos(vector.x)
    RX.values[2][1] = -Math.sin(vector.x)
    RX.values[1][2] = Math.sin(vector.x)

    var RY = new Matrix();
    RY.values[0][0] = Math.cos(vector.y)
    RY.values[2][2] = Math.cos(vector.y)
    RY.values[0][2] = -Math.sin(vector.y)
    RY.values[2][0] = Math.sin(vector.y)

    var RZ = new Matrix();
    RZ.values[0][0] = Math.cos(vector.z)
    RZ.values[1][1] = Math.cos(vector.z)
    RZ.values[1][0] = -Math.sin(vector.z)
    RZ.values[0][1] = Math.sin(vector.z)

    return RX.mul(RY).mul(RZ);
}
Matrix.CreateTranslation = function(x, y, z) {
    T = new Matrix();
    T.values[3][0] = x;
    T.values[3][1] = y;
    T.values[3][2] = z;
    return T;
}
Matrix.CreateTranslationV = function(vector) {
    return Matrix.CreateTranslation(vector.x, vector.y, vector.z);
}
Matrix.CreateScale = function(x, y, z) {
    S = new Matrix();
    S.values[0][0] = x;
    S.values[1][1] = y;
    S.values[2][2] = z;
    return S;
}
Matrix.CreateProjection = function(fov, aspect, near, far) {
    P = new Matrix();
    P.values[0][0] = 1 / (aspect * Math.tan(fov / 2));
    P.values[1][1] = 1 / (Math.tan(fov / 2));
    //P.values[2][2] = (far + near) / (near - far)
    //P.values[3][2] = 2 * far * near / (near - far)
    P.values[2][2] = 0;
    P.values[2][3] = 1;
    P.values[3][2] = 1;
    P.values[3][3] = 0;
    return P;
}
Matrix.CreateView = function(yaw, pitch, position) {
    R = Matrix.CreateRotationYPR(-yaw, -pitch, 0);
    V = R.mul(Matrix.CreateTranslationV(position.mul(-1)));
    return V;
}
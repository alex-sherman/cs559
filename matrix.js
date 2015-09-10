Matrix = function() {
    this.type = "Matrix"
    this.values = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];

    this.mul = function(other) {
        function mulIndex(i, j) {
            var output = 0;
            for (var k = 0; k < 4; k++) {
                output += this.values[k][j] * other.values[i][k];
            };
            return output;
        }
        var output = new Matrix();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                output.values[i][j] = mulIndex.apply(this, [i, j]);
            };
        };
        return output;
    }
    this.lerp = function(w, other) {
        output = new Matrix();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                output.values[i][j] = this.values[i][j] * (1 - w) + other.values[i][j] * (w);
            };
        };
        return output;
    }
    this.transform = function(vector) {
        function rowMul(j, v) {
            var output = 0;
            for (var i = 0; i < 4; i++) {
                output += this.values[i][j] * v[i];
            };
            return output;
        }
        var vmatrix = [vector.x, vector.y, vector.z, vector.w];
        var output = new Vector(
            rowMul.apply(this, [0, vmatrix]),
            rowMul.apply(this, [1, vmatrix]),
            rowMul.apply(this, [2, vmatrix]),
            rowMul.apply(this, [3, vmatrix]));
        return output;
    }
}
MatrixCreateRotationYPR = function(yaw, pitch, roll) {
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
MatrixCreateTranslation = function(x, y, z) {
    T = new Matrix();
    T.values[3][0] = x;
    T.values[3][1] = y;
    T.values[3][2] = z;
    return T;
}
MatrixCreateTranslationV = function(vector) {
    return MatrixCreateTranslation(vector.x, vector.y, vector.z);
}
MatrixCreateScale = function(x, y, z) {
    S = new Matrix();
    S.values[0][0] = x;
    S.values[1][1] = y;
    S.values[2][2] = z;
    return S;
}
MatrixCreateProjection = function(fov, aspect, near, far) {
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
MatrixCreateView = function(yaw, pitch, position) {
    R = MatrixCreateRotationYPR(yaw, pitch, 0);
    V = R.mul(MatrixCreateTranslationV(position));
    return V;
}
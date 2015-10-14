RenderManager = Class.extend({
    init: (function RenderManager(canvas, width, height) {
        this.width = width;
        this.height = height;
        this.queue = [];
        this.lightDir = null;
        this.viewProjection = mat4.create();
        this.normalMatrix = mat3.create();
    }),
    drawMeshPart: function(meshPart, bones) {
        var tmp = mat3.create();
        for(var i = 0; i < meshPart.bones.length; i++){
            var uniformLocation = gl.getUniformLocation(glProgram, "boneTransforms[" + i + "]");
            gl.uniformMatrix4fv(uniformLocation, false, bones[meshPart.bones[i]].currentTransform);
            var uniformLocation = gl.getUniformLocation(glProgram, "boneTransformsN[" + i + "]");
            gl.uniformMatrix3fv(uniformLocation, false, mat3.fromMat4(tmp, bones[meshPart.bones[i]].currentTransformN));
        }

        var stride = meshPart.vertices.attributes.reduce(function(stride, attr) { return stride + attr.size; }, 0);
        var offset = 0;
        for(var i = 0; i < meshPart.vertices.attributes.length; i++) {
            var attr = meshPart.vertices.attributes[i];
            var attribName = attr.name;

            var attribLocation = gl.getAttribLocation(glProgram, attribName);
            if(attribLocation != -1) {
                gl.enableVertexAttribArray(attribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, meshPart.vertices.buffer);
                gl.vertexAttribPointer(attribLocation, attr.size, gl.FLOAT, false, stride * 4, offset * 4);
            }
            offset += attr.size;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshPart.indices);
        gl.drawElements(gl.TRIANGLES, meshPart.count, gl.UNSIGNED_SHORT, 0);
    },
    colorFromVec3: function(v) {
        var output = "#"
        for(var i = 0; i < 3; i++){
            output += ("0" + Math.floor(v[i] * 255).toString(16)).substr(-2);
        }
        return output;
    },
    transformVector: function(vout, vin, m) {
        v = vec4.transformMat4(vout, vin, m);
        if(v[3] != 0)
            vec4.scale(v, v, 1 / v[3]);
        v[0] = (v[0] / 2 + 0.5) * this.width;
        v[1] = (-v[1] / 2 + 0.5) * this.height;
    },
    beginDraw: function(lightDir, view, projection) {
        mat3.fromMat4(this.normalMatrix, view);
        mat3.invert(this.normalMatrix, this.normalMatrix);
        mat3.transpose(this.normalMatrix, this.normalMatrix);
        mat4.mul(this.viewProjection, projection, view);
        this.lightDir = lightDir;
        var uniformLocation = gl.getUniformLocation(glProgram, "projectionMatrix");
        gl.uniformMatrix4fv(uniformLocation, false, this.viewProjection);

        uniformLocation = gl.getUniformLocation(glProgram, "normalMatrix");
        gl.uniformMatrix3fv(uniformLocation, false, this.normalMatrix);

        uniformLocation = gl.getUniformLocation(glProgram, "lightDir");
        gl.uniform3fv(uniformLocation, lightDir);
    }
});
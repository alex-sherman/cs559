RenderManager = Class.extend({
    init: (function RenderManager(canvas, width, height) {
        this.width = width;
        this.height = height;
        this.queue = [];
        this.lightDir = null;
        this.viewProjection = mat4.create();
        this.normalMatrix = mat3.create();
    }),
    createTexture: function(image) {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        return texture;
    },
    setTextures: function(textures) {
        var i = 0;
        for(var textureName in textures) {
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, textures[textureName]);
            gl.uniform1i(gl.getUniformLocation(glProgram, textureName), i);
        }
    },
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
    beginDraw: function(time, lightDir, view, projection) {
        mat3.fromMat4(this.normalMatrix, view);
        mat3.invert(this.normalMatrix, this.normalMatrix);
        mat3.transpose(this.normalMatrix, this.normalMatrix);
        mat4.mul(this.viewProjection, projection, view);
        this.lightDir = lightDir;
        var uniformLocation = gl.getUniformLocation(glProgram, "time");
        gl.uniform1f(uniformLocation, time);

        uniformLocation = gl.getUniformLocation(glProgram, "projectionMatrix");
        gl.uniformMatrix4fv(uniformLocation, false, this.viewProjection);

        uniformLocation = gl.getUniformLocation(glProgram, "normalMatrix");
        gl.uniformMatrix3fv(uniformLocation, false, this.normalMatrix);

        uniformLocation = gl.getUniformLocation(glProgram, "lightDir");
        gl.uniform3fv(uniformLocation, lightDir);
    }
});
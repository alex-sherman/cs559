RenderManager = Class.extend({
    init: (function RenderManager(canvas, width, height) {
        this.width = width;
        this.height = height;
        this.queue = [];
        this.lightDir = null;
        this.viewProjection = mat4.create();
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
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, textures[textureName]);
            var uniformLocation = gl.getUniformLocation(this.shader, textureName);
            gl.uniform1i(uniformLocation, i);
            i++;
        }
    },
    setShader: function(shader) {
        this.shader = shader;
        gl.useProgram(shader);
    },
    setUniforms: function(uniforms) {
        for(var uniformName in uniforms) {
            this.setUniform(uniformName, uniforms[uniformName]);
        }
    },
    setUniform: function(name, value) {
        if(value.constructor === Array) {
            for(var i = 0; i < value.length; i++) {
                this.setUniform(name + "[" + i + "]", value[i]);
            }
        }
        else {
            var uniformLocation = gl.getUniformLocation(this.shader, name);
            if(uniformLocation == -1) return;
            if(value.constructor === Float32Array) {
                switch(value.length) {
                    case 1:
                        gl.uniform1fv(uniformLocation, value);
                        break;
                    case 3:
                        gl.uniform3fv(uniformLocation, value);
                        break;
                    case 9:
                        gl.uniformMatrix3fv(uniformLocation, false,  value);
                        break;
                    case 16:
                        gl.uniformMatrix4fv(uniformLocation, false, value);
                        break;
                }
            }
            else if(typeof value === "number") {
                gl.uniform1f(uniformLocation, value);
            }
        }
    },
    drawVertices: function(vertices, indices, count) {
        var tmp = mat3.create();
        var stride = vertices.attributes.reduce(function(stride, attr) { return stride + attr.size; }, 0);
        var offset = 0;
        for(var i = 0; i < vertices.attributes.length; i++) {
            var attr = vertices.attributes[i];
            var attribName = attr.name;

            var attribLocation = gl.getAttribLocation(this.shader, attribName);
            if(attribLocation != -1) {
                gl.enableVertexAttribArray(attribLocation);

                gl.bindBuffer(gl.ARRAY_BUFFER, vertices.buffer);
                gl.vertexAttribPointer(attribLocation, attr.size, gl.FLOAT, false, stride * 4, offset * 4);
            }
            offset += attr.size;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
        for(var i = 0; i < vertices.attributes.length; i++) {
            var attr = vertices.attributes[i];
            var attribName = attr.name;
            var attribLocation = gl.getAttribLocation(this.shader, attribName);
            if(attribLocation != -1) {
                gl.disableVertexAttribArray(attribLocation);
            }
        }
    },
    beginDraw: function(time, lightDir, view, projection, cameraPos) {
        mat4.mul(this.viewProjection, projection, view);
        this.lightDir = lightDir;
        for(var shaderName in Shaders) {
            this.setShader(Shaders[shaderName]);
            this.setUniforms({
                time: time,
                projectionMatrix: this.viewProjection,
                lightDir: lightDir,
                cameraPosition: cameraPos
            });
        }
        this.shader = null;
    }
});
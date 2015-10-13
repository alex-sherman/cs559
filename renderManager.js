RenderManager = Class.extend({
    init: (function RenderManager(canvas, width, height) {
        this.width = width;
        this.height = height;
        this.queue = [];
        this.lightDir = null;
        this.viewProjection = null;
    }),
    drawMeshPart: function(meshPart) {
        for(var attribName in meshPart.vertices) {

            var attribLocation = gl.getAttribLocation(glProgram, attribName);
            if(attribLocation == -1) continue;
            gl.enableVertexAttribArray(attribLocation);

            gl.bindBuffer(gl.ARRAY_BUFFER, meshPart.vertices[attribName]);
            gl.vertexAttribPointer(attribLocation, G3DJAttrType(attribName).size, gl.FLOAT, false, 0, 0);
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
    beginDraw: function(lightDir, viewProjection) {
        this.lightDir = lightDir;
        this.viewProjection = viewProjection;
        var uniformLocation = gl.getUniformLocation(glProgram, "projectionMatrix");
        gl.uniformMatrix4fv(uniformLocation, false, viewProjection);

        uniformLocation = gl.getUniformLocation(glProgram, "lightDir");
        gl.uniform3fv(uniformLocation, lightDir);
    }
});
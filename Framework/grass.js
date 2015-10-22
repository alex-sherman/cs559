Grass = Component.extend({
    init: (function Grass(positions) {
        this.positions = positions;
        this.texture = null;
        this.shader = Shaders.grass;
    }),
    draw: function(renderManager) {
        gl.enable(gl.BLEND);
        if(!Grass.vertices) return;
        renderManager.setShader(this.shader);
        if(this.entity.Pose) {
            renderManager.setUniform("worldMatrix", this.entity.Pose.transform);
            renderManager.setUniform("normalMatrix", this.entity.Pose.normalTransform);
        }
        else {
            renderManager.setUniform("worldMatrix", mat4.create());
            renderManager.setUniform("normalMatrix", mat3.create());
        }
        renderManager.setTextures({diffuse: Grass.texture});
        for(var i = 0; i < this.positions.length; i++) {
            renderManager.setUniform("offset", this.positions[i]);
            renderManager.drawVertices(Grass.vertices, Grass.indices, 18);
        }
        gl.disable(gl.BLEND);
    }
});
$(document).ready(function() {
    Grass.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Grass.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0,1,2, 0,2,3, 4,5,6, 4,6,7, 8,9,10, 8,10,11]), gl.STATIC_DRAW);
    Grass.vertices = {
        attributes: [
            {name: "POSITION", size: 3},
            {name: "TEXCOORD0", size: 2},
            {name: "NORMAL", size: 3},
        ],
        buffer: gl.createBuffer()
    }
    var A = 4 / 3;
    var L = A / 2 / Math.sqrt(3);
    var O = L;
    var O2 = O / Math.sqrt(2);
    var N = 1 / Math.sqrt(2);
    gl.bindBuffer(gl.ARRAY_BUFFER, Grass.vertices.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        O2-A, 0, -O2-4 * L,   0,1, -N,N,0,
        O2-A, 1, -O2-4 * L,   0,0, -N,N,0,
        O2+A / 2, 1, -O2+5 * L, 1,0, -N,N,0,
        O2+A / 2, 0, -O2+5 * L, 1,1, -N,N,0,

        -O2+A, 0, -O2-4 * L,   0,1, N,N,0,
        -O2+A, 1, -O2-4 * L,   0,0, N,N,0,
        -O2-A / 2, 1, -O2+5 * L, 1,0, N,N,0,
        -O2-A / 2, 0, -O2+5 * L, 1,1, N,N,0,

        -A * 1.5, 0, O-L,  0,1, 0,0,-1,
        -A * 1.5, 1, O-L,  0,0, 0,0,-1,
        A * 1.5, 1, O-L, 1,0, 0,0,-1,
        A * 1.5, 0, O-L, 1,1, 0,0,-1,

        ]), gl.STATIC_DRAW);
    Grass.image = new Image();
    Grass.image.crossOrigin = "anonymous";
    Grass.image.onload = function() { Grass.texture = renderManager.createTexture(Grass.image); }
    Grass.image.src = "http://static.vector57.net/cs559/P7/Models/grass.png";
});
Heightmap = Mesh.extend({
    init: (function Heightmap(url) {
        Mesh.init.apply(this);
        var image = new Image();
        image.crossOrigin = "anonymous";
        var self = this;
        image.onload = function() {
            var vertices = self.verticesFromImage(this);
            var indices = self.indicesFromBounds();
            self.parts["main"] = new MeshPart("main", vertices, indices.buffer, indices.length);
        }
        image.src = url;
    }),
    verticesFromImage: function(image) {
        var output = {
            attributes: [{name: "POSITION", size: 3}, {name: "NORMAL", size: 3}],
            buffer: gl.createBuffer()
        }
        var vertices = [
            0,0,0, 0,1,0,
            10,0,0, 0,1,0,
            10,0,10, 0,1,0,
            0,0,10, 0,1,0
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, output.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return output;
    },
    indicesFromBounds: function(bounds) {
        var herp = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, herp);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
        return {length: 6, buffer: herp};
    },
    draw: function(renderManager) {
        Mesh.draw.apply(this, [renderManager]);
    }
})
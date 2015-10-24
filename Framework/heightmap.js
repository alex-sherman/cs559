Heightmap = Mesh.extend({
    init: (function Heightmap(url, width, height) {
        Mesh.init.apply(this);
        var image = new Image();
        var self = this;
        this.width = width || null;
        this.height = height || null;
        image.onload = function() {
            //Use the image's width and height it wasn't sepicifed earlier
            self.width = self.width || this.width;
            self.height = self.height || this.height;

            var vertices = self.verticesFromImage(this, self.width, self.height);
            var indices = self.indicesFromBounds(self.width, self.height);
            self.parts["main"] = new MeshPart("main", vertices, indices.buffer, indices.length);
        }
        image.src = url;
    }),
    verticesFromImage: function(image, width, height) {
        var output = {
            attributes: [{name: "POSITION", size: 3}, {name: "NORMAL", size: 3}],
            buffer: gl.createBuffer()
        }
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        var vertices = [];
        var heights = ctx.getImageData(0, 0, width, height).data
        for(var y = 0; y < height; y++) {
            for(var x = 0; x < width; x++) {
                var heightValue = heights[4 * (x + y * width)] / 255 * 10;
                vertices.push.apply(vertices, [x, heightValue, y, 0,1,0]);
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, output.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return output;
    },
    indicesFromBounds: function(width, height) {
        var indices = new Uint16Array((width - 1) * (height - 1) * 6);
        for(var x = 0; x < width - 1; x++)
        {
            for (var y = 0; y < height - 1; y++)
            {
                var i = x + y * (width - 1);
                indices[i * 6] = (x + y * width);
                indices[i * 6 + 1] = (indices[i * 6] + (width + 1));
                indices[i * 6 + 2] = (indices[i * 6] + 1);
                indices[i * 6 + 3] = (indices[i * 6]);
                indices[i * 6 + 4] = (indices[i * 6] + (width + 1));
                indices[i * 6 + 5] = (indices[i * 6] + (width));
            }
        }
        var herp = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, herp);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices), gl.STATIC_DRAW);
        return {length: indices.length, buffer: herp};
    }
})
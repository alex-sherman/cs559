Heightmap = Mesh.extend({
    init: (function Heightmap(url, yScale, xzScale, width, height) {
        Mesh.init.apply(this);
        this.shader = "multitexture";
        var image = new Image();
        var self = this;
        this.yScale = yScale || 1;
        this.xzScale = xzScale || 1;
        this.width = width || null;
        this.height = height || null;
        this.onload = onload || null;
        this.loadTexture("texture0", "Textures/sand.jpg");
        this.loadTexture("texture1", "Textures/grass.png");
        this.loadTexture("texture2", "Textures/rock.png");
        this.loadTexture("texture3", "Textures/snow.jpg");
        this.heights = null;
        this.loaded = $.Deferred();
        this.deferreds.push(this.loaded);
        image.onload = function() {
            //Use the image's width and height it wasn't sepicifed earlier
            self.width = self.width || this.width;
            self.height = self.height || this.height;

            var vertices = self.verticesFromImage(this, self.width, self.height);
            var indices = self.indicesFromBounds(self.width, self.height);
            self.parts["main"] = new MeshPart("main", vertices, indices.buffer, indices.length);
            self.loaded.resolve(self);
        }
        image.src = url;
    }),
    verticesFromImage: function(image, width, height) {
        var output = {
            attributes: [{name: "POSITION", size: 3}, {name: "NORMAL", size: 3}, {name: "TEXCOORD0", size: 2}, {name: "BLENDWEIGHT0", size: 4}],
            buffer: gl.createBuffer()
        }
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        var vertices = [];
        var heights = ctx.getImageData(0, 0, width, height).data
        this.heights = [];
        for(var x = 0; x < width; x++) {
            this.heights.push([]);
            for(var y = 0; y < height; y++) {
                var heightValue = heights[4 * (x + y * width)] / 255;
                this.heights[x].push(heightValue);
            }
        }
            for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
                var heightValue = this.heights[x][y];
                var normal = this.getNormal(x, y);
                vertices.push.apply(vertices, [
                    x * this.xzScale, (heightValue - 0.5) * this.yScale, y * this.xzScale,
                    normal[0], normal[1], normal[2],
                    x / 16, y / 16,
                    this.getBlendWeight(-1, 0.2, heightValue),
                    this.getBlendWeight(0.2, 0.6, heightValue),
                    this.getBlendWeight(0.6, 0.9, heightValue),
                    this.getBlendWeight(0.9, 2, heightValue)
                ]);
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
    },
    getBlendWeight: function(minHeight, maxHeight, height) {
        var transferWidth = 0.2;
        minHeight += transferWidth / 2;
        maxHeight -= transferWidth / 2;
        if (height < minHeight)
            return Math.clamp((height - minHeight + transferWidth) / transferWidth, 0, 1);
        if (height > maxHeight)
            return Math.clamp((maxHeight + transferWidth - height) / transferWidth, 0, 1);
        return 1;
    },
    getNormal: function(x, y) {
        if(!this.heights) return vec3.create();
        var height = this.heights[x][y];
        var diff = vec3.create();
        var normal = vec3.create();
        if (x > 0)
        {
            vec3.set(diff, -this.xzScale, -(height - this.heights[x - 1][y]) * this.yScale, 0);
            vec3.add(normal, normal, vec3.cross(diff, diff, [0,0,1]));
        }
        if (x < this.width - 1)
        {
            vec3.set(diff, this.xzScale, -(height - this.heights[x + 1][y]) * this.yScale, 0);
            vec3.add(normal, normal, vec3.cross(diff, [0,0,1], diff));
        }
        if (y > 0)
        {
            vec3.set(diff, 0, (height - this.heights[x][y - 1]) * this.yScale, this.xzScale);
            vec3.add(normal, normal, vec3.cross(diff, diff, [1,0,0]));
        }
        if (y < this.height - 1)
        {
            vec3.set(diff, 0, -(height - this.heights[x][y + 1]) * this.yScale, this.xzScale);
            vec3.add(normal, normal, vec3.cross(diff, diff, [1,0,0]));
        }
        vec3.normalize(normal, normal);
        return normal;
    },
    surfaceAt: function(x, z) {
        if(!this.heights) return 0;
        var xW = (x - this.entity.Pose.position[0]) / this.xzScale
        var zW = (z - this.entity.Pose.position[2]) / this.xzScale;
        x = Math.floor(xW);
        z = Math.floor(zW);
        xW -= x;
        zW -= z;
        var height = 0;
        height += this.heights[x][z] * (1 - xW) * (1 - zW);
        height += this.heights[x + 1][z] * (xW) * (1 - zW);
        height += this.heights[x][z + 1] * (1 - xW) * (zW);
        height += this.heights[x + 1][z + 1] * (xW) * (zW);
        return (height - 0.5) * this.yScale;
    }

})
Mesh = function(skeleton, meshParts) {
    this.skeleton = skeleton || null;
    this.parts = meshParts || [];
    this.draw = function(ctx, viewProjection, width, height) {
        for (var i = 0; i < this.parts.length; i++) {
            this.parts[i].draw(ctx, viewProjection, this.skeleton, width, height);
        };
    }
}

MeshPart = function(vertices, indices, bones) {
    this.vertices = vertices || [];
    this.indices = indices || [];
    this.bones = bones || [];
    this.draw = function(ctx, viewProjection, skeleton, width, height) {
        var transformedVertices = []
        var self = this;
        function transformedPosition(vertex) {
            var worldViewProjection = viewProjection;
            if(self.bones.length > 0) {
                var world = new Matrix(true);
                for (var i = 0; i < vertex.weights.length; i++) {
                    var boneTransform = skeleton.bones[self.bones[i]].withParentTransform();
                    world = world.derpLerp(vertex.weights[i], boneTransform);
                };
                worldViewProjection = worldViewProjection.mul(world);
            }
            var position = worldViewProjection.transform(vertex.position);
            if(position.w > 0)
            {
                position = position.mul(1 / position.w);
                position.x *= width;
                position.y *= height;
            }
            return position;
        }
        for (var i = 0; i < indices.length; i+= 3) {
            var V1 = this.vertices[indices[i]];
            var P1 = transformedPosition(V1);
            var V2 = this.vertices[indices[i + 1]];
            var P2 = transformedPosition(V2);
            var V3 = this.vertices[indices[i + 2]];
            var P3 = transformedPosition(V3);

            if(P1.w <= 0 || P2.w <= 0 || P3.w <= 0) continue;
            if(this.color)
                ctx.fillStyle = this.color;
            var path=new Path2D();
            path.moveTo(P1.x, P1.y);
            path.lineTo(P2.x, P2.y);
            path.lineTo(P3.x, P3.y);
            ctx.fill(path);
        };
    }
}
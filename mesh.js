Mesh = function(skeleton, meshParts) {
    this.skeleton = skeleton || null;
    this.parts = meshParts || [];
    this.draw = function(renderManager) {
        for (var i = 0; i < this.parts.length; i++) {
            this.parts[i].draw(renderManager, this.skeleton);
        };
    }
}

MeshPart = function(vertices, indices, bones) {
    this.vertices = vertices || [];
    this.indices = indices || [];
    this.bones = bones || [];
    this.draw = function(renderManager, skeleton) {
        var transformedVertices = []
        var self = this;
        function transformedPosition(vertex) {
            var world = new Matrix();
            if(self.bones.length > 0) {
                world = new Matrix(true);
                for (var i = 0; i < vertex.weights.length; i++) {
                    var boneTransform = skeleton.bones[self.bones[i]].absoluteTransform();
                    world = world.derpLerp(vertex.weights[i], boneTransform);
                };
            }
            return world.transform(vertex.position);
        }
        for (var i = 0; i < indices.length; i+= 3) {
            var V1 = this.vertices[indices[i]];
            var P1 = transformedPosition(V1);
            var V2 = this.vertices[indices[i + 1]];
            var P2 = transformedPosition(V2);
            var V3 = this.vertices[indices[i + 2]];
            var P3 = transformedPosition(V3);
            renderManager.addTriangle(P1, P2, P3, this.color);
        };
    }
}
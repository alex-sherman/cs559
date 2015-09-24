Mesh = Component.extend({
    type: "Mesh",
    init: function(meshParts) {
        this.parts = meshParts || [];
    },
    draw: function(renderManager) {
        for (var i = 0; i < this.parts.length; i++) {
            this.parts[i].draw(renderManager, this.entity.Skeleton);
        };
    }
});
    
MeshPart = Class.extend({
    init: function(vertices, indices, bones) {
        this.vertices = vertices || [];
        this.indices = indices || [];
        this.bones = bones || [];
    },
    transformedPosition: function(vertex, skeleton) {
        var world = new Matrix();
        if(this.bones.length > 0) {
            world = new Matrix(true);
            for (var i = 0; i < vertex.weights.length; i++) {
                var boneTransform = skeleton.bones[this.bones[i]].absoluteTransform();
                world = world.derpLerp(vertex.weights[i], boneTransform);
            };
        }
        return world.transform(vertex.position);
    },
    draw: function(renderManager, skeleton) {
        var transformedVertices = []
        
        for (var i = 0; i < this.indices.length; i+= 3) {
            var V1 = this.vertices[this.indices[i]];
            var P1 = this.transformedPosition(V1, skeleton);
            var V2 = this.vertices[this.indices[i + 1]];
            var P2 = this.transformedPosition(V2, skeleton);
            var V3 = this.vertices[this.indices[i + 2]];
            var P3 = this.transformedPosition(V3, skeleton);
            renderManager.addTriangle(P1, P2, P3, this.color);
        };
    }
});
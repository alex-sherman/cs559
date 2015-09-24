Mesh = Component.extend({
    init: (function Mesh(vertices, meshParts) {
        this.parts = meshParts || {};
        this.vertices = vertices || [];
    }),
    draw: function(renderManager) {
        for (var i = 0; i < this.parts.length; i++) {
            this.parts[i].draw(renderManager, this.vertices, this.entity.Skeleton);
        };
    }
});
    
MeshPart = Class.extend({
    init: (function MeshPart(id, indices, bones) {
        this.id = id;
        this.indices = indices || [];
        this.bones = bones || [];
    }),
    transformedPosition: function(vertex, skeleton) {
        var world = new Matrix();
        if(skeleton && this.bones.length > 0) {
            world = new Matrix(true);
            for (var i = 0; i < vertex.weights.length; i++) {
                var weight = vertex.weights[i];
                var boneTransform = skeleton.bones[this.bones[weight.index]].currentTransform;
                world = world.derpLerp(weight.weight, boneTransform);
            };
        }
        return world.transform(vertex.position);
    },
    draw: function(renderManager, vertices, skeleton) {
        var transformedVertices = []
        
        for (var i = 0; i < this.indices.length; i+= 3) {
            var V1 = vertices[this.indices[i]];
            var P1 = this.transformedPosition(V1, skeleton);
            var V2 = vertices[this.indices[i + 1]];
            var P2 = this.transformedPosition(V2, skeleton);
            var V3 = vertices[this.indices[i + 2]];
            var P3 = this.transformedPosition(V3, skeleton);
            renderManager.addTriangle(P1, P2, P3, this.color);
        };
    }
});
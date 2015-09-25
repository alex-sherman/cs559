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
        var v = vec4.create();
        vec3.add(v, v, vertex);
        var vtmp = vec4.create();
        if(skeleton && this.bones.length > 0) {
            vec4.set(v, 0,0,0,0);
            for (var i = 0; i < vertex.weights.length; i++) {
                var weight = vertex.weights[i];
                if(weight.weight == 0) continue;
                vec4.set(vtmp, 0,0,0,0);
                vtmp[3] = 1;
                var boneTransform = skeleton.bones[this.bones[weight.index]].currentTransform;
                vec3.transformMat4(vtmp, vertex.position, boneTransform)
                vec4.scale(vtmp, vtmp, weight.weight);
                vec4.add(v, v, vtmp);
            };
        }
        return v;
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
            renderManager.addTriangle(P1, P2, P3, "black");
        };
    }
});
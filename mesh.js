Mesh = Component.extend({
    init: (function Mesh(meshParts) {
        this.parts = meshParts || {};
    }),
    draw: function(renderManager) {
        for (meshPartId in this.parts) {
            this.parts[meshPartId].draw(renderManager, this.entity.Skeleton);
        };
    }
});
    
MeshPart = Class.extend({
    init: (function MeshPart(id, vertices, indices) {
        this.id = id;
        this.vertices = vertices;
        this.indices = indices;
        this.bones = [];
    }),
    transformVertex: function(vertex, skeleton) {
        var v = vertex.positionOut;
        var n = vertex.normalOut;
        vec4.set(v, 0,0,0,1);
        vec3.set(n, 0,0,0);
        vec3.add(v, v, vertex.position);
        vec3.add(n, n, vertex.normal);
        var vtmp = vec4.create();
        if(skeleton && this.bones.length > 0) {
            vec4.set(v, 0,0,0,0);
            vec3.set(n, 0,0,0);
            for (var i = 0; i < vertex.weights.length; i++) {
                var weight = vertex.weights[i];
                if(weight.weight == 0) continue;
                var boneTransform = mat4.clone(skeleton.bones[this.bones[weight.index]].currentTransform);

                vec4.set(vtmp, 0,0,0,0);
                vtmp[3] = 1;
                vec3.transformMat4(vtmp, vertex.position, boneTransform)
                vec4.scale(vtmp, vtmp, weight.weight);
                vec4.add(v, v, vtmp);

                mat4.invert(boneTransform, boneTransform);
                mat4.transpose(boneTransform, boneTransform)
                vec4.set(vtmp, 0,0,0,0);
                vec3.add(vtmp, vtmp, vertex.normal);
                vec4.transformMat4(vtmp, vtmp, boneTransform)
                vec3.scale(vtmp, vtmp, weight.weight);
                vec3.add(n, n, vtmp);
            };
        }
    },
    draw: function(renderManager, skeleton) {
        var transformedVertices = []
        for (var i = 0; i < this.vertices.length; i++) {
            this.transformVertex(this.vertices[i], skeleton);
        };
        
        for (var i = 0; i < this.indices.length; i+= 3) {
            renderManager.addTriangle(
                this.vertices[this.indices[i]],
                this.vertices[this.indices[i + 1]],
                this.vertices[this.indices[i + 2]]
                );
        };
    }
});
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
        var v = vertex.worldPosition;
        var n = vertex.normalOut;
        vec4.set(v, 0,0,0,1);
        vec3.set(n, 0,0,0);
        vec3.add(v, v, vertex.POSITION[0]);
        vec3.add(n, n, vertex.NORMAL[0]);
        var vtmp = vec4.create();
        if(skeleton && this.bones.length > 0) {
            vec4.set(v, 0,0,0,0);
            vec3.set(n, 0,0,0);
            for (var i = 0; i < vertex.BLENDWEIGHT.length; i++) {
                var weight = vertex.BLENDWEIGHT[i];
                if(weight[0] == 0) continue;

                vec4.set(vtmp, 0,0,0,0);
                vtmp[3] = 1;
                vec3.transformMat4(vtmp, vertex.POSITION[0], skeleton.bones[this.bones[weight[0]]].currentTransform);
                vec4.scale(vtmp, vtmp, weight[1]);
                vec4.add(v, v, vtmp);

                vec4.set(vtmp, 0,0,0,0);
                vec3.add(vtmp, vtmp, vertex.NORMAL[0]);
                vec4.transformMat4(vtmp, vtmp, skeleton.bones[this.bones[weight[0]]].currentTransformN);
                vec3.scale(vtmp, vtmp, weight[1]);
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
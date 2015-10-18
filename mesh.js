Mesh = Component.extend({
    init: (function Mesh(meshParts) {
        this.parts = meshParts || {};
        this.textures = {};
        this.shader = Shaders.diffuse.program;
    }),
    draw: function(renderManager) {
        renderManager.setShader(this.shader);
        if(this.entity.Pose) {
            renderManager.setUniform("worldMatrix", this.entity.Pose.transform);
            renderManager.setUniform("normalMatrix", this.entity.Pose.normalTransform);
        }
        else {
            renderManager.setUniform("worldMatrix", mat4.create());
            renderManager.setUniform("normalMatrix", mat3.create());
        }
        renderManager.setTextures(this.textures);
        for (meshPartId in this.parts) {
            var meshPart = this.parts[meshPartId];
            if(this.entity.Skeleton && meshPart.bones) {
                var bones = this.entity.Skeleton.bones;
                boneTransforms = meshPart.bones.map(function(boneName) {
                    return bones[boneName].currentTransform;
                });
                boneTransformsN = meshPart.bones.map(function(boneName) {
                    return bones[boneName].currentTransformN;
                });
                renderManager.setUniforms({
                    boneTransforms: boneTransforms,
                    boneTransformsN: boneTransformsN
                })
            }
            renderManager.drawMeshPart(meshPart);
        };
    }
});
    
MeshPart = Class.extend({
    init: (function MeshPart(id, vertices, indices, count) {
        this.id = id;
        this.vertices = vertices;
        this.indices = indices;
        this.count = count;
    })
});
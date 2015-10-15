Mesh = Component.extend({
    init: (function Mesh(meshParts) {
        this.parts = meshParts || {};
        this.textures = {};
    }),
    draw: function(renderManager) {
        renderManager.setTextures(this.textures);
        for (meshPartId in this.parts) {
            this.parts[meshPartId].draw(renderManager, this.entity.Skeleton.bones);
        };
    }
});
    
MeshPart = Class.extend({
    init: (function MeshPart(id, vertices, indices, count) {
        this.id = id;
        this.vertices = vertices;
        this.indices = indices;
        this.bones = [];
        this.count = count;
    }),
    draw: function(renderManager, bones) {
        renderManager.drawMeshPart(this, bones);
    }
});
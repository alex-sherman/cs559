Water = Mesh.extend({
    init: (function Water(width, height) {
        this.base.init.apply(this, [{}, "water"]);
        this.width = width;
        this.height = height;
        var self = this;
        this.vertices = {
            attributes: [
                {name: "POSITION", size: 3},
                {name: "TEXCOORD0", size: 2},
                {name: "NORMAL", size: 3},
            ],
            buffer: gl.createBuffer()
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0,Water.height,0, 0,0, 0,1,0,
            width,Water.height,0, 1,0, 0,1,0,
            0,Water.height,height, 0,1, 0,1,0,
            width,Water.height,height, 1,1, 0,1,0
        ]), gl.STATIC_DRAW);
        self.loadTexture("bumpMap", "Textures/waterbump.jpg");
        self.uniforms["bumpResolution"] = 20;
        Water.loaded.done(function() {
            self.parts["surface"] = new MeshPart(
                "surface",
                self.vertices,
                Water.indices,
                6
            );
            self.textures.reflection = Water.reflectionTarget.texture;
            self.textures.refraction = Water.refractionTarget.texture;
        });
        this.deferreds.push(Water.loaded);
    }),
    draw: function(renderManager) {
        if(renderManager.renderTarget == null) {
            this.uniforms["reflectionView"] = Water.camera.reflectionView;
            this.uniforms["reflectionProj"] = Water.projection;
            this.base.draw.apply(this, arguments);
        }
    }
});
Water.height = -32;
Water.camera = null;
Water.drawToTargets = function(entities, renderManager, camera) {
    Water.camera = camera;
    renderManager.setRenderTarget(Water.reflectionTarget);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderManager.beginDraw(camera.reflectionView, Water.projection, observer.Camera.position,
        {
            clipPlane: vec4.fromValues(0, 1, 0, -Water.height)
        });
    Entity.entities.map(function(entity) { entity.draw(renderManager); });

    renderManager.setRenderTarget(Water.refractionTarget);
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderManager.beginDraw(camera.view, Water.projection, observer.Camera.position,
        {
            clipPlane: vec4.fromValues(0, 0, 0, 0)
        });
    Entity.entities.map(function(entity) { entity.draw(renderManager); });
}
Water.loaded = $.Deferred();
$(document).ready(function() {
    Water.reflectionTarget = new RenderTarget(512, 512);
    Water.refractionTarget = new RenderTarget(512, 512);
    Water.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Water.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0,1,2, 1,2,3]), gl.STATIC_DRAW);
    Water.projection = projection;
    Water.loaded.resolve();
});
RenderManager = Class.extend({
    init: (function RenderManager(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.queue = [];
    }),
    addTriangle: function(P1, P2, P3, color) {
        this.queue.push({points: [P1, P2, P3], color: color});
    },
    draw: function(viewProjection) {
        var self = this;
        this.queue.map(function(tri, i, q) {
            tri.z = 0;
            tri.points.map(function(vertex, j, triPoints) {
                vertex = vec4.transformMat4(vertex, vertex, viewProjection);
                if(vertex[3] != 0)
                    vec4.scale(vertex, vertex, 1 / vertex[3]);
                vertex[0] = (vertex[0] / 2 + 0.5) * self.width;
                vertex[1] = (-vertex[1] / 2 + 0.5) * self.height;
                triPoints[j] = vertex;
                tri.z += vertex[2]; 
            });
            tri.z /= 3;
        });
        this.queue.sort(function(a, b) { return a.z - b.z; });
        var transformedQueue = [];
        for (var i = 0; i < this.queue.length; i++) {
            var tri = this.queue[i];
            if(tri.points.some(function(p) { return p[2] > 1; })) continue;
            if(tri.color)
                ctx.fillStyle = tri.color;
            var path=new Path2D();
            path.moveTo(tri.points[0][0], tri.points[0][1]);
            path.lineTo(tri.points[1][0], tri.points[1][1]);
            path.lineTo(tri.points[2][0], tri.points[2][1]);
            path.closePath();
            this.ctx.strokeStyle = tri.color;
            this.ctx.stroke(path);
            //this.ctx.fill(path);

        };
        this.queue = []
    }
});
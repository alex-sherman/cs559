RenderManager = Class.extend({
    init: function(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.queue = [];
    },
    addTriangle: function(P1, P2, P3, color) {
        this.queue.push({points: [P1, P2, P3], color: color});
    },
    draw: function(viewProjection) {
        var self = this;
        this.queue.map(function(tri, i, q) {
            tri.z = 0;
            tri.points.map(function(vertex, j, triPoints) {
                vertex = viewProjection.transform(vertex);
                if(vertex.w > 0)
                    vertex = vertex.mul(1 / vertex.w);
                vertex.x = (vertex.x / 2 + 0.5) * self.width;
                vertex.y = (-vertex.y / 2 + 0.5) * self.height;
                triPoints[j] = vertex;
                tri.z += vertex.z; 
            });
            tri.z /= 3;
        });
        this.queue.sort(function(a, b) { return a.z - b.z; });
        var transformedQueue = [];
        for (var i = 0; i < this.queue.length; i++) {
            var tri = this.queue[i];
            if(tri.points.some(function(p) { return p.w <= 0; })) continue;
            if(tri.color)
                ctx.fillStyle = tri.color;
            var path=new Path2D();
            path.moveTo(tri.points[0].x, tri.points[0].y);
            path.lineTo(tri.points[1].x, tri.points[1].y);
            path.lineTo(tri.points[2].x, tri.points[2].y);
            path.closePath();
            this.ctx.strokeStyle = tri.color;
            this.ctx.stroke(path);
            //this.ctx.fill(path);

        };
        this.queue = []
    }
});
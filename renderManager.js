RenderManager = Class.extend({
    init: (function RenderManager(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.queue = [];
    }),
    addTriangle: function(P1, P2, P3, color) {
        var normal = vec3.create();
        vec3.add(normal, normal, P1.normalOut);
        vec3.add(normal, normal, P2.normalOut);
        vec3.add(normal, normal, P3.normalOut);
        vec3.scale(normal, normal, 1/3);
        this.queue.push({
            points: [P1.positionOut, P2.positionOut, P3.positionOut],
            normal: normal
        });
    },
    colorFromVec3: function(v) {
        var output = "#"
        for(var i = 0; i < 3; i++){
            output += ("0" + Math.floor(v[i] * 255).toString(16)).substr(-2);
        }
        return output;
    },
    transformVector: function(v, m) {
        v = vec4.transformMat4(v, v, m);
        if(v[3] != 0)
            vec4.scale(v, v, 1 / v[3]);
        v[0] = (v[0] / 2 + 0.5) * this.width;
        v[1] = (-v[1] / 2 + 0.5) * this.height;
    },
    draw: function(lightDir, viewProjection) {
        var lightDebug = vec4.fromValues(0,0,0,1);
        this.transformVector(lightDebug, viewProjection);
        this.ctx.strokeStyle = "green";
        this.ctx.beginPath();
        this.ctx.moveTo(lightDebug[0], lightDebug[1]);
        vec4.set(lightDebug, 0,0,0,1);
        vec3.add(lightDebug, lightDebug, lightDir);
        this.transformVector(lightDebug, viewProjection);
        this.ctx.lineTo(lightDebug[0], lightDebug[1]);
        this.ctx.stroke();


        var self = this;
        this.queue.map(function(tri, i, q) {
            tri.z = 0;
            tri.points.map(function(vertex, j, triPoints) {
                //Important clone, the vertex may be shared from the original triangle
                triPoints[j] = vec4.clone(vertex);
                self.transformVector(triPoints[j], viewProjection);
                tri.z += triPoints[j][2];
            });
            tri.z /= 3;
        });
        this.queue.sort(function(a, b) {
            return b.z - a.z;
        });
        var transformedQueue = [];
        for (var i = 0; i < this.queue.length; i++) {
            var tri = this.queue[i];
            if(tri.points.some(function(p) { return p[2] >= 1; })) continue;

            var color = vec3.fromValues(0, 1, 0);
            vec3.scale(color, color, Math.max(0, vec3.dot(lightDir, tri.normal)));
            color = this.colorFromVec3(color);
            this.ctx.fillStyle = color;
            var path=new Path2D();
            path.moveTo(tri.points[0][0], tri.points[0][1]);
            path.lineTo(tri.points[1][0], tri.points[1][1]);
            path.lineTo(tri.points[2][0], tri.points[2][1]);
            path.closePath();
            this.ctx.strokeStyle = color;
            this.ctx.stroke(path);
            this.ctx.fill(path);

        };
        this.queue = []
    }
});
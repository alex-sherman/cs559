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
            points: [P1, P2, P3],
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
    transformVector: function(vout, vin, m) {
        v = vec4.transformMat4(vout, vin, m);
        if(v[3] != 0)
            vec4.scale(v, v, 1 / v[3]);
        v[0] = (v[0] / 2 + 0.5) * this.width;
        v[1] = (-v[1] / 2 + 0.5) * this.height;
    },
    draw: function(lightDir, viewProjection) {
        var lightDebug = vec4.fromValues(0,0,0,1);
        this.transformVector(lightDebug, lightDebug, viewProjection);
        this.ctx.strokeStyle = "green";
        this.ctx.beginPath();
        this.ctx.moveTo(lightDebug[0], lightDebug[1]);
        vec4.set(lightDebug, 0,0,0,1);
        vec3.add(lightDebug, lightDebug, lightDir);
        this.transformVector(lightDebug, lightDebug, viewProjection);
        this.ctx.lineTo(lightDebug[0], lightDebug[1]);
        this.ctx.stroke();


        var self = this;
        this.queue.map(function(tri, i, q) {
            tri.z = 0;
            tri.points.map(function(vertex, j, triPoints) {
                self.transformVector(triPoints[j].viewPosition, triPoints[j].worldPosition, viewProjection);
                tri.z += triPoints[j].viewPosition[2];
            });
            tri.z /= 3;
        });
        this.queue.sort(function(a, b) {
            return b.z - a.z;
        });
        var transformedQueue = [];
        var ambientLight = 0.1
        for (var i = 0; i < this.queue.length; i++) {
            var tri = this.queue[i];
            if(tri.points.some(function(p) { return p[2] >= 1; })) continue;

            var color = vec3.create();

            vec3.add(color, [ambientLight, ambientLight, ambientLight], vec3.scale(color, [0,1,0], Math.max(ambientLight, vec3.dot(lightDir, tri.normal) - ambientLight)));
            color = this.colorFromVec3(color);
            this.ctx.fillStyle = color;
            var path=new Path2D();
            path.moveTo(tri.points[0].viewPosition[0], tri.points[0].viewPosition[1]);
            path.lineTo(tri.points[1].viewPosition[0], tri.points[1].viewPosition[1]);
            path.lineTo(tri.points[2].viewPosition[0], tri.points[2].viewPosition[1]);
            path.closePath();
            this.ctx.strokeStyle = "green";
            this.ctx.stroke(path);
            this.ctx.fill(path);

        };
        this.queue = []
    }
});
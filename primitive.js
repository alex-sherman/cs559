Primitive = {
    Empty: function() {
        return {vertices: [], indices: []};
    },
    Cube: function(min, max) {
        min = min || new Vector(-1,-1,-1);
        max = max || new Vector(1,1,1);
        var vertices = [{position: new Vector(min.x, min.y, min.z), color: "red", weights: [1]},
                        {position: new Vector(min.x, min.y, max.z), color: "red", weights: [1]},
                        {position: new Vector(max.x, min.y, max.z), color: "red", weights: [1]},
                        {position: new Vector(max.x, min.y, min.z), color: "red", weights: [1]},
                        {position: new Vector(min.x, max.y, min.z), color: "red", weights: [1]},
                        {position: new Vector(min.x, max.y, max.z), color: "red", weights: [1]},
                        {position: new Vector(max.x, max.y, max.z), color: "red", weights: [1]},
                        {position: new Vector(max.x, max.y, min.z), color: "red", weights: [1]},];
        var indices = [
                        0,1,2, 0,2,3, //Bottom
                        4,5,6, 4,6,7, //Top
                        0,4,7, 0,3,7, //Front
                        1,2,5, 5,2,6, //Back
                        0,1,4, 1,4,5, //Left
                        2,3,6, 3,6,7, //Right
                      ];
        var output = new MeshPart(vertices, indices);

        return output;
    }
}
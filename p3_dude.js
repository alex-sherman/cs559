function Dude() {
    var dude = new Entity();
    var skeleton = new Skeleton();
    dude.addComponent(skeleton);
    chest = new Bone("chest");
    skeleton.addBone(chest, null);
    head = new Bone("head", MatrixCreateTranslation(0, -3, 0));
    skeleton.addBone(head, "chest");
    leftThigh = new Bone("leftThigh", MatrixCreateTranslation(1, 2, 0));
    skeleton.addBone(leftThigh, "chest");
    leftCalf = new Bone("leftCalf", MatrixCreateTranslation(1, 4, 0));
    skeleton.addBone(leftCalf, "leftThigh");
    rightThigh = new Bone("rightThigh", MatrixCreateTranslation(-1, 2, 0));
    skeleton.addBone(rightThigh, "chest");
    rightCalf = new Bone("rightCalf", MatrixCreateTranslation(-1, 4, 0));
    skeleton.addBone(rightCalf, "rightThigh");
    rightBicep = new Bone("rightBicep", MatrixCreateTranslation(-2.5, -2, 0));
    skeleton.addBone(rightBicep, "chest");
    rightForearm = new Bone("rightForearm", MatrixCreateTranslation(-2.5, 0, 0));
    skeleton.addBone(rightForearm, "rightBicep");
    leftBicep = new Bone("leftBicep", MatrixCreateTranslation(2.5, -2, 0));
    skeleton.addBone(leftBicep, "chest");
    leftForearm = new Bone("leftForearm", MatrixCreateTranslation(2.5, 0, 0));
    skeleton.addBone(leftForearm, "leftBicep");

    anim = new Animation();
    dude.addComponent(anim);

    var mesh = new Mesh();
    dude.addComponent(mesh);
    var meshPart = Primitive.Cube(new Vector(-2, -2, -1.5), new Vector(2, 2, 1.5));
    meshPart.bones = ["chest", "leftThigh", "rightThigh"];
    meshPart.vertices[0].weights = [0.8, 0.2, 0];
    meshPart.vertices[1].weights = [0.8, 0.2, 0];
    meshPart.vertices[2].weights = [0.8, 0, 0.2];
    meshPart.vertices[3].weights = [0.8, 0, 0.2];

    meshPart.color = "red";
    mesh.parts.push(meshPart);

    ["leftThigh", "leftCalf", "rightThigh", "rightCalf", ].map(function(bone, i, bones) {
        var offset = new Vector(0, -3, 0);
        if(i < 2) offset.x -= 1;
        else offset.x += 1;
        if(i % 2) offset.y -= 2;
        meshPart = Primitive.Cube(new Vector(-1,-1,-1).add(offset), new Vector(1,1,1).add(offset));
        meshPart.bones = i % 2 ? [bone, bones[i - 1], bone] : [bone, "chest", bones[i + 1]];
        meshPart.color = i % 2 ? "green" : "blue";
        //if(i % 2) {
            meshPart.vertices.map(function(vertex, j, vertices) {
                if(j > 3)
                    vertex.weights = [0.2, 0.8, 0];
                else
                    vertex.weights = [0.8, 0, 0.2];
            })
        //}
        mesh.parts.push(meshPart);
    });

    ["leftBicep", "leftForearm", "rightBicep", "rightForearm"].map(function(bone, i, bones) {
        var offset = new Vector(0, 2, 0);
        if(i < 2) offset.x -= 2.5;
        else offset.x += 2.5;
        if(i % 2) offset.y -= 2;
        meshPart = Primitive.Cube(new Vector(-0.5,-2,-0.5).add(offset), new Vector(0.5,0,0.5).add(offset));
        meshPart.bones = i % 2 ? [bone, bones[i - 1], bone] : [bone, "chest", bones[i + 1]];
        meshPart.color = i % 2 ? "green" : "blue";
        //if(i % 2) {
            meshPart.vertices.map(function(vertex, j, vertices) {
                if(j > 3)
                    vertex.weights = [0.6, 0.4, 0];
                else
                    vertex.weights = [0.4, 0, 0.6];
            })
        //}
        mesh.parts.push(meshPart);
    });

    meshPart = Primitive.Cube(new Vector(-1,2,-1), new Vector(1,4,1));
    meshPart.bones = ["head"];
    meshPart.color = "orange"
    mesh.parts.push(meshPart);

    anim.addKeyFrame(0, "chest", new Vector(0, 0, 0));
    anim.addKeyFrame(0, "head", new Vector(0, 3,0));
    function insertLegFrames(t) {
        anim.addKeyFrame(t + 0, "leftThigh", new Vector(-1, -2, 0), new Vector(-Math.PI/4,0));
        anim.addKeyFrame(t + 0, "rightThigh", new Vector(1, -2, 0), new Vector(Math.PI/4,0,0));
        anim.addKeyFrame(t + 0, "leftCalf", new Vector(0, -2, 0), new Vector(0,0,0));
        anim.addKeyFrame(t + 0, "rightCalf", new Vector(0, -2, 0), new Vector(Math.PI/8,0,0));

        anim.addKeyFrame(t + 1, "leftThigh", new Vector(-1, -2, 0), new Vector(-Math.PI/8,0,0));
        anim.addKeyFrame(t + 1, "rightThigh", new Vector(1, -2, 0), new Vector(Math.PI/8,0,0));

        anim.addKeyFrame(t + 2, "leftThigh", new Vector(-1, -2, 0), new Vector(0,0,0));
        anim.addKeyFrame(t + 2, "leftCalf", new Vector(0, -2, 0), new Vector(0,0,0));
        anim.addKeyFrame(t + 2, "rightThigh", new Vector(1, -2, 0), new Vector(0,0,0));
        anim.addKeyFrame(t + 2, "rightCalf", new Vector(0, -2, 0), new Vector(Math.PI/2,0,0));

        anim.addKeyFrame(t + 3, "leftThigh", new Vector(-1, -2, 0), new Vector(Math.PI/8,0,0));
        anim.addKeyFrame(t + 3, "rightThigh", new Vector(1, -2, 0), new Vector(-Math.PI/8,0,0));
        anim.addKeyFrame(t + 3, "rightCalf", new Vector(0, -2, 0), new Vector(Math.PI/4,0,0));

        anim.addKeyFrame(t + 4, "leftThigh", new Vector(-1, -2, 0), new Vector(Math.PI/4,0,0));
        anim.addKeyFrame(t + 4, "leftCalf", new Vector(0, -2, 0), new Vector(Math.PI/8,0,0));
        anim.addKeyFrame(t + 4, "rightThigh", new Vector(1, -2, 0), new Vector(-Math.PI/4,0,0));
        anim.addKeyFrame(t + 4, "rightCalf", new Vector(0, -2, 0), new Vector(0,0,0));

        anim.addKeyFrame(t + 5, "rightThigh", new Vector(1, -2, 0), new Vector(-Math.PI/8,0,0));
        anim.addKeyFrame(t + 5, "leftThigh", new Vector(-1, -2, 0), new Vector(Math.PI/8,0,0));

        anim.addKeyFrame(t + 6, "rightThigh", new Vector(1, -2, 0), new Vector(0,0,0));
        anim.addKeyFrame(t + 6, "rightCalf", new Vector(0, -2, 0), new Vector(0,0,0));
        anim.addKeyFrame(t + 6, "leftThigh", new Vector(-1, -2, 0), new Vector(0,0,0));
        anim.addKeyFrame(t + 6, "leftCalf", new Vector(0, -2, 0), new Vector(Math.PI/2,0,0));

        anim.addKeyFrame(t + 7, "rightThigh", new Vector(1, -2, 0), new Vector(Math.PI/8,0,0));
        anim.addKeyFrame(t + 7, "leftThigh", new Vector(-1, -2, 0), new Vector(-Math.PI/8,0,0));
        anim.addKeyFrame(t + 7, "leftCalf", new Vector(0, -2, 0), new Vector(Math.PI/4,0,0));

        anim.addKeyFrame(t + 8, "rightThigh", new Vector(1, -2, 0), new Vector(Math.PI/4,0,0));
        anim.addKeyFrame(t + 8, "rightCalf", new Vector(0, -2, 0), new Vector(Math.PI/8,0,0));
        anim.addKeyFrame(t + 8, "leftThigh", new Vector(-1, -2, 0), new Vector(-Math.PI/4,0,0));
        anim.addKeyFrame(t + 8, "leftCalf", new Vector(0, -2, 0), new Vector(0,0,0));
    }

    function insertArmFrames(t) {
        anim.addKeyFrame(t + 0, "rightBicep", new Vector(2.5, 2, 0), new Vector(-Math.PI/4));
        anim.addKeyFrame(t + 0, "rightForearm", new Vector(0, -2, 0), new Vector(-Math.PI/2));
        anim.addKeyFrame(t + 2.5, "rightForearm", new Vector(0, -2, 0), new Vector());
        anim.addKeyFrame(t + 4, "rightBicep", new Vector(2.5, 2, 0), new Vector(Math.PI/2));
        anim.addKeyFrame(t + 8, "rightBicep", new Vector(2.5, 2, 0), new Vector(-Math.PI/4));
        anim.addKeyFrame(t + 8, "rightForearm", new Vector(0, -2, 0), new Vector(-Math.PI/2));

        anim.addKeyFrame(t + 0, "leftBicep", new Vector(-2.5, 2, 0), new Vector(Math.PI/4));
        anim.addKeyFrame(t + 0, "leftForearm", new Vector(0, -2, 0), new Vector());
        anim.addKeyFrame(t + 2.5, "leftForearm", new Vector(0, -2, 0), new Vector(-Math.PI/2));
        anim.addKeyFrame(t + 4, "leftBicep", new Vector(-2.5, 2, 0), new Vector(-Math.PI/2));
        anim.addKeyFrame(t + 8, "leftBicep", new Vector(-2.5, 2, 0), new Vector(Math.PI/4));
        anim.addKeyFrame(t + 8, "leftForearm", new Vector(0, -2, 0), new Vector());
    }
    insertArmFrames(0);
    insertLegFrames(0);
    insertArmFrames(8);
    insertLegFrames(8);
    insertArmFrames(16);
    insertLegFrames(16);
    insertArmFrames(24);
    insertLegFrames(24);
    for (var i = 0; i < anim.keyFrames.length; i++) {
        anim.keyFrames[i].time /= 8;
    };
    anim.length /= 8;
    return dude;
}
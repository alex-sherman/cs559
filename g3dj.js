function G3DJToMesh(obj) {
    function Vector3(vertex, i, vertices, attribute, attributeIndex) {
        vertex[attribute.toLowerCase()] = vec3.fromValues(vertices[i], vertices[i + 1], vertices[i + 2]);
        return i + 3;
    }
    function Vector2(vertex, i, vertices, attribute, attributeIndex) {
        vertex[attribute.toLowerCase()] = vec3.fromValues(vertices[i], vertices[i + 1]);
        return i + 2;
    }
    function Blendweight(vertex, i, vertices, attribute, attributeIndex) {
        if(!("weights" in vertex)) vertex.weights = [];
        vertex.weights.push({
            index: vertices[i],
            weight: vertices[i + 1],
        });
        return i + 2;
    }
    var attributeTypes = {
        POSITION: Vector3,
        NORMAL: Vector3,
        TEXCOORD: Vector2,
        BLENDWEIGHT: Blendweight
    };
    var meshObj = obj.meshes[0];
    var attributes = meshObj.attributes.map(function(attribute) {
        var attributeType = attribute.slice(0);
        var index = 0;
        while(!isNaN(Number(attributeType.charAt( attributeType.length-1 ))))
        {
            attributeType = attributeType.slice(0, -1)
            index = Number(attributeType.charAt( attributeType.length-1 )) + index * 10;
        }
        return [attributeType, index];
    });
    var vertices = [];
    for (var i = 0; i < meshObj.vertices.length;) {
        var vertex = {};
        var offset = 0;
        for (var j = 0; j < attributes.length; j++) {
            
            i = attributeTypes[attributes[j][0]](vertex, i, meshObj.vertices, attributes[j][0], attributes[j][1]);
        };
        vertices.push(vertex);
    };
    var meshIndices = {};
    for(var i = 0; i < meshObj.parts.length; i++) {
        meshIndices[meshObj.parts[i].id] = meshObj.parts[i].indices;
    }
    var meshParts = [];
    for (var i = 0; i < obj.nodes[0].parts.length; i++) {
        var nodePart = obj.nodes[0].parts[i];
        var meshPartId = nodePart.meshpartid;
        var bones = nodePart.bones.map(function(bone) {
            return bone.node;
        });
        meshParts.push(new MeshPart(meshPartId, meshIndices[meshPartId], bones));
    };
    return new Mesh(vertices, meshParts);
}
function G3DJToSkeleton(obj) {
    function objToBone(obj, skeleton, parent) {
        var rot = obj.rotation ? quat.fromValues.apply(this, obj.rotation) : quat.create();
        var tran = obj.translation ? vec3.fromValues.apply(this, obj.translation) : vec3.create();
        var bone = new Bone(obj.id, parent, rot, tran);
        if(!parent) quat.rotateX(bone.defRot, bone.defRot, -Math.PI / 2)
        if(obj.children){
            for (var i = 0; i < obj.children.length; i++) {
                objToBone(obj.children[i], skeleton, bone);
            }
        }
        skeleton.addBone(bone);
    }
    var skeleton = new Skeleton();
    var nodeObj = obj.nodes[1];
    objToBone(nodeObj, skeleton, null);
    return skeleton;
}
function G3DJToAnimation(obj) {
    var animObj = obj.animations[2];
    var anim = new Animation();
    for (var i = 0; i < animObj.bones.length; i++) {
        var bone = animObj.bones[i];
        for (var j = 0; j < bone.keyframes.length; j++) {
            var kf = bone.keyframes[j];
            anim.addKeyFrame(
                Math.max(0, kf.keytime) / 1000,
                bone.boneId,
                kf.translation ? vec3.fromValues.apply(this, kf.translation) : null,
                kf.rotation ? quat.fromValues.apply(this, kf.rotation) : null
                )
        };
    };
    return anim;
}
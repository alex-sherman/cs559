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
    var meshParts = {};
    for (var m = 0; m < obj.meshes.length; m++) {
        var meshObj = obj.meshes[m];
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
            vertex.positionOut = vec4.create();
            vertex.normalOut = vec3.create();
            vertices.push(vertex);
        };
        for(var i = 0; i < meshObj.parts.length; i++) {
            meshParts[meshObj.parts[i].id] = new MeshPart(meshObj.parts[i].id, vertices, meshObj.parts[i].indices);
        }
    }
    for (var j = 0; j < obj.nodes.length; j++) {
        var objNode = obj.nodes[j];
        if(!("parts" in objNode)) continue;
        for (var i = 0; i < objNode.parts.length; i++) {
            var nodePart = objNode.parts[i];
            var meshPartId = nodePart.meshpartid;
            var bones = [];
            if(("bones" in nodePart)) {
                bones = nodePart.bones.map(function(bone) {
                    return bone.node;
                });
            }
            meshParts[meshPartId].bones = bones;
        }
    }
    return new Mesh(meshParts);
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
    for (var i = 0; i < obj.nodes.length; i++) {
        if(obj.nodes[i].children){
            objToBone(obj.nodes[i], skeleton, null);
            break;
        }
    };
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
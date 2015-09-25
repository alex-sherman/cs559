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
        if(!isNaN(Number(attribute.charAt( attribute.length-1 )))) {
            attributeType = attribute.slice(0, -1)
            index = Number(attribute.charAt( attribute.length-1 ));
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
        var invBind = mat4.create();
        if("translation" in obj)
            invBind = mat4.translate(invBind, invBind, vec3.fromValues(obj.translation[0],obj.translation[2],obj.translation[1]))
        mat4.invert(invBind, invBind);
        var bone = new Bone(obj.id, invBind);
        if(obj.children){
            for (var i = 0; i < obj.children.length; i++) {
                objToBone(obj.children[i], skeleton, bone);
            }
        }
        skeleton.addBone(bone, parent);
    }
    var skeleton = new Skeleton();
    var nodeObj = obj.nodes[1];
    objToBone(nodeObj, skeleton, null);
    return skeleton;
}
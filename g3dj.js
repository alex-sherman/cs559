
var G3DJAttributeTypes = {
    POSITION: 3,
    NORMAL: 3,
    TEXCOORD: 2,
    BLENDWEIGHT: 2
};

function G3DJAttrType(attrName) {
    //Regex is courtesy of Peter Den Hartog
    var re = /^(\w+?)(\d*)$/;
    var m = re.exec(attrName);
    var index = parseInt(m[2]);
    index = (isNaN(index) ? 0 : index);
    return {name: attrName, size: G3DJAttributeTypes[m[1]]};
}

function G3DJToMesh(obj) {
    var meshParts = {};
    for (var m = 0; m < obj.meshes.length; m++) {
        var meshObj = obj.meshes[m];
        var attributes = meshObj.attributes.map(G3DJAttrType);
        var vertices = attributes.reduce(function(obj, attribute) {
            obj[attribute.name] = [];
            return obj;
        }, {});

        vertices = {
            attributes: attributes,
            buffer: gl.createBuffer()
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertices.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshObj.vertices), gl.STATIC_DRAW);

        for(var i = 0; i < meshObj.parts.length; i++) {
            var indices = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
              new Uint16Array(meshObj.parts[i].indices), gl.STATIC_DRAW);
            meshParts[meshObj.parts[i].id] = new MeshPart(meshObj.parts[i].id, vertices, indices, meshObj.parts[i].indices.length);
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
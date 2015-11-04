Observer = Entity.extend({
    init: (function Observer(terrain) {
        this.base.init.apply(this);
        this.addComponent(new Pose());
        this.addComponent(new Camera());
        this.addComponent(new Behavior({moveDir: vec3.create(), theta: Math.PI / 4, phi: -Math.PI / 8}, function(dt, state) {
            state.moveDir[0] = 0;
            state.moveDir[1] = 0;
            state.moveDir[2] = 0;
            this.Camera.offset -= mouseState.wheelDelta / 200;
            this.Camera.offset = Math.max(1, this.Camera.offset);
            if(keyboardState[87]) state.moveDir[2] -= 1;
            if(keyboardState[83]) state.moveDir[2] += 1;
            if(keyboardState[68]) state.moveDir[0] += 1;
            if(keyboardState[65]) state.moveDir[0] -= 1;
            if(keyboardState[32]) state.moveDir[1] += 1;
            if(keyboardState[67]) state.moveDir[1] -= 1;

            if(keyboardState[38]) state.phi -= Observer.cameraSensitivity * dt;
            if(keyboardState[40]) state.phi += Observer.cameraSensitivity * dt;
            if(keyboardState[37]) state.theta += Observer.cameraSensitivity * dt;
            if(keyboardState[39]) state.theta -= Observer.cameraSensitivity * dt;
            if(mouseState.buttons.left) {
                state.theta -= mouseState.delta[0] * mouseSensitivity;
                state.phi -= mouseState.delta[1] * mouseSensitivity;
            }
            if(state.theta > Math.PI * 2) state.theta -= Math.PI * 2;
            quat.identity(this.Pose.rotation);
            quat.rotateY(this.Pose.rotation, this.Pose.rotation, state.theta);
            vec3.transformQuat(state.moveDir, state.moveDir, this.Pose.rotation);
            quat.rotateX(this.Pose.rotation, this.Pose.rotation, state.phi);

            vec3.scale(state.moveDir, state.moveDir, Observer.moveSpeed * dt);
            if(keyboardState[16])
                vec3.scale(state.moveDir, state.moveDir, 10);
            vec3.add(this.Pose.position, this.Pose.position, state.moveDir);
            this.Pose.position[1] = terrain.Heightmap.surfaceAt(this.Pose.position[0], this.Pose.position[2]);
        }))
    })
})

Observer.moveSpeed = 5;
Observer.cameraSensitivity = 1;
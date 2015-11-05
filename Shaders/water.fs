precision highp float;
varying vec3 fNormal;
varying vec3 fReflCoord;
varying vec3 fRefrCoord;
varying vec3 fPosition;
uniform vec3 lightDir;
uniform sampler2D reflectionTexture;
uniform sampler2D refractionTexture;

void main()
{
    float base = 0.4;
    gl_FragColor = vec4(1,0,1,1);
    vec3 reflCoord = fReflCoord / fReflCoord.z / 2.0 + 0.5;
    vec3 refrCoord = fRefrCoord / fRefrCoord.z / 2.0 + 0.5;
    gl_FragColor.a = 1.0;
    gl_FragColor.xyz = vec3(0);
    gl_FragColor.xyz += texture2D(reflectionTexture, vec2(reflCoord.x, reflCoord.y)).xyz / 2.0;
    gl_FragColor.xyz += texture2D(refractionTexture, vec2(refrCoord.x, refrCoord.y)).xyz / 2.0;
    gl_FragColor.b += 0.15;
}
const fragCode = `
    void main(void) {
      gl_FragColor = vec4(vec3(gl_FragCoord.x),1.0);
    }
    `;

export default fragCode;
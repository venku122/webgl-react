const fragCode = `
    void main(void) {
      gl_FragColor = vec4(0.25 * gl_FragCoord.x, 0.25 * gl_FragCoord.y, 0.25, 0.5);
    }
    `;

export default fragCode;
const shader1 = `
attribute vec2 coordinates;
void main(void) {
  gl_Position = vec4(coordinates, 0.0, 1.0);
}
`
export default shader1;


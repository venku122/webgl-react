const vertex3 = `
attribute vec3 coordinates;
void main(void) {
  gl_Position = vec4(coordinates, 1.0);
}
`
export default vertex3;

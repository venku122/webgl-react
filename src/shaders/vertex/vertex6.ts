const vertex6 = `
attribute vec4 coordinates;
uniform mat4 u_xformMatrix;
void main(void) {
  gl_Position = u_xformMatrix * coordinates;
}
`
export default vertex6;

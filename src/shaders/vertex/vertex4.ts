const vertex4 = `
attribute vec3 coordinates;
attribute vec3 color;
varying vec3 vColor;
void main(void) {
  gl_Position = vec4(coordinates, 1.0);
  vColor = color;
}
`
export default vertex4;

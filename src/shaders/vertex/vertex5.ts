const vertex5 = `
attribute vec4 coordinates;
uniform vec4 translation;
void main(void) {
  gl_Position = coordinates + translation;
}
`
export default vertex5;

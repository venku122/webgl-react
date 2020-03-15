import React, { Component } from 'react';
import shader1 from './shaders/vertex/shader1';
import vertex2 from './shaders/vertex/vertex2';
import vertex3 from './shaders/vertex/vertex3';
import vertex4 from './shaders/vertex/vertex4';
import vertex5 from './shaders/vertex/vertex5';
import vertex6 from './shaders/vertex/vertex6';
import vertex7 from './shaders/vertex/vertex7';
import frag1 from './shaders/fragment/frag1';
import frag2 from './shaders/fragment/frag2';
import frag3 from './shaders/fragment/frag3';
import frag5 from './shaders/fragment/frag5';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  private gl!: WebGLRenderingContext;
  private frames: number = 0;
  private currentRenderMethod: number = 0;

  componentDidMount = () => {
    this.initializeCanvas();
    this.initializeRotatingTriangle();
    setInterval(() => {
      this.currentRenderMethod = this.currentRenderMethod + 1;
    }, 1000)
  }

  createArrayBuffer = (vertices: number[]): WebGLBuffer => {
    const { gl } = this;
    // create new buffer object
    const vertex_buffer = gl.createBuffer()!;

    // bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // pass the verticies data to the buffer;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // unbind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vertex_buffer;
  }

  createElementBuffer = (indices: number[]): WebGLBuffer => {
    const { gl } = this;
    const index_buffer = gl.createBuffer()!;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return index_buffer;
  }


  createShader = (shaderCode: string, shaderType: number, ): WebGLShader => {
    const { gl } = this;
    // create a shader object
    const shader = gl.createShader(shaderType)!;

    // attach shader source code
    gl.shaderSource(shader, shaderCode);

    // compile shader
    gl.compileShader(shader);

    const message = gl.getShaderInfoLog(shader)!;

    if (message.length > 0) {
      /* message may be an error or a warning */
      console.log(`shader error: ${message}`);
    }

    return shader;
  }

  createVertexShader = (shaderCode: string) => {
    const { gl } = this;
    return this.createShader(shaderCode, gl.VERTEX_SHADER);
  }

  createFragmentShader = (shaderCode: string) => {
    const { gl } = this;
    return this.createShader(shaderCode, gl.FRAGMENT_SHADER);
  }

  createShaderProgram = (shaders: WebGLShader[]): WebGLProgram => {
    const { gl } = this;
    // create shader program
    const shaderProgram = gl.createProgram()!;

    shaders.forEach((shader) => {
      gl.attachShader(shaderProgram, shader);
    });

    // link both programs
    gl.linkProgram(shaderProgram);

    // use the combined program shader object
    gl.useProgram(shaderProgram);
    return shaderProgram;
  }

  createAttribute = (shaderProgram: WebGLProgram, attributeName: string, size: number) => {
    const { gl } = this;

    let attribPointer = gl.getAttribLocation(shaderProgram, attributeName);

    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(attribPointer, size, gl.FLOAT, false, 0, 0);

    // enable attribute
    gl.enableVertexAttribArray(attribPointer);
  }

  initializeCanvas = () => {
    const canvas: HTMLCanvasElement = document.getElementById('webgl-target')! as HTMLCanvasElement;
    // const gl: WebGL2RenderingContext = canvas.getContext('webgl') as WebGL2RenderingContext;
    const gl: WebGLRenderingContext = canvas.getContext('webgl')!;

    this.gl = gl;
  }

  initializeRotatingTriangle = () => {
    const { gl } = this;

    const vertices = [ -1,-1,-1, 1,-1,-1, 1, 1,-1 ];
    const vertex_buffer = this.createArrayBuffer(vertices);

    const colors = [ 1,1,1, 1,1,1, 1,1,1 ];
    const color_buffer = this.createArrayBuffer(colors);

    const indices = [ 0,1,2 ];
    const index_buffer = this.createElementBuffer(indices);

    const vertShader = this.createVertexShader(vertex7);
    const fragShader = this.createFragmentShader(frag5);

    const shaderProgram = this.createShaderProgram([vertShader, fragShader]);

    let Pmatrix = gl.getUniformLocation(shaderProgram, 'Pmatrix');
    let Vmatrix = gl.getUniformLocation(shaderProgram, 'Vmatrix');
    let Mmatrix = gl.getUniformLocation(shaderProgram, 'Mmatrix');

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    this.createAttribute(shaderProgram, 'position', 3);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    this.createAttribute(shaderProgram, 'color', 3);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

    function get_projection(angle:number, a:number, zMin:number, zMax:number) {
      var ang = Math.tan((angle*.5)*Math.PI/180);//angle*.5
      return [
         0.5/ang, 0 , 0, 0,
         0, 0.5*a/ang, 0, 0,
         0, 0, -(zMax+zMin)/(zMax-zMin), -1,
         0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
      ];
   }

    let proj_matrix = get_projection(40, gl.canvas.width/gl.canvas.height, 1, 100);
    let mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    let view_matrix = [2,0,0,0, 0,2,0,0, 0,0,2,0, 0,0,0,1];

    // zooming in
    view_matrix[14] = view_matrix[14] - 6; // zoom

    function rotateZ(m: number[], angle: number) {
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      var mv0 = m[0], mv4 = m[4], mv8 = m[8]; 

      m[0] = c*m[0]-s*m[1];
      m[4] = c*m[4]-s*m[5];
      m[8] = c*m[8]-s*m[9];
      m[1] = c*m[1]+s*mv0;
      m[5] = c*m[5]+s*mv4;
    }
    

    var time_old = 0;
    var animate = function(time: number) {
       var dt = time-time_old;
       rotateZ(mov_matrix, dt*0.002);
       time_old = time;

       console.log(`time: ${time}, dt: ${dt}`);

       gl.enable(gl.DEPTH_TEST);
       gl.depthFunc(gl.LEQUAL);
       gl.clearColor(0.5, 0.5, 0.5, 0.9);
       gl.clearDepth(1.0);
       gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

       gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
       gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
       gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

       // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
       gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
       window.requestAnimationFrame(animate);
    }
    animate(0);

  }

  initializeScaledTriangle = () => {
    const { gl } = this;
    const vertices = [
      -0.5,0.5,0.0,
      -0.5,-0.5,0.0,
      0.5,-0.5,0.0,
    ];

    const vertex_buffer = this.createArrayBuffer(vertices);

    const vertShader = this.createVertexShader(vertex6);
    const fragShader = this.createFragmentShader(frag3);

    const shaderProgram = this.createShaderProgram([vertShader, fragShader]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    this.createAttribute(shaderProgram, 'coordinates', 3);

    var Sx = 1.0, Sy = 1.5, Sz = 1.0;
    var xformMatrix = new Float32Array([
       Sx,   0.0,  0.0,  0.0,
       0.0,  Sy,   0.0,  0.0,
       0.0,  0.0,  Sz,   0.0,
       0.0,  0.0,  0.0,  1.0  
    ]);
    const uniformMatrixPoint = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
    gl.uniformMatrix4fv(uniformMatrixPoint, false, xformMatrix);

    gl.enable(gl.DEPTH_TEST);

    // set the viewport
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    this.drawTriangles();
  }

  initializeTranslatedTriangle = () => {
    const { gl } = this;
    const vertices = [
      -0.5,0.5,0.0,
      -0.5,-0.5,0.0,
      0.5,-0.5,0.0,
    ];

    const vertex_buffer = this.createArrayBuffer(vertices);

    const vertShader = this.createVertexShader(vertex5);
    const fragShader = this.createFragmentShader(frag3);

    const shaderProgram = this.createShaderProgram([vertShader, fragShader]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    this.createAttribute(shaderProgram, 'coordinates', 3);

    const tX = 0.5;
    const tY = 0.5;
    const tZ = 0.0;
    const translationPointer = gl.getUniformLocation(shaderProgram, 'translation');
    gl.uniform4f(translationPointer, tX, tY, tZ, 0.0);

    gl.enable(gl.DEPTH_TEST);

    // set the viewport
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    this.drawTriangles();
  }

  initializeQuad = () => {
    const { gl } = this;

    const vertices = [
      -0.5,0.5,0.0,
      -0.5,-0.5,0.0,
      0.5,-0.5,0.0,
      0.5,0.5,0.0 
   ];
   const vertex_buffer = this.createArrayBuffer(vertices);

   const indices = [3,2,1,3,1,0];
   const index_buffer = this.createElementBuffer(indices);

   const colors = [ 0,0,1, 1,0,0, 0,1,0, 1,0,1,];
   const color_buffer = this.createArrayBuffer(colors);

   const vertShader = this.createVertexShader(vertex4);
   const fragShader = this.createFragmentShader(frag5);

   const shaderProgram = this.createShaderProgram([vertShader, fragShader]);

   // bind vertex buffer object
   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
   
   this.createAttribute(shaderProgram, 'coordinates', 3);

   gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);

   this.createAttribute(shaderProgram, 'color', 3);

   gl.enable(gl.DEPTH_TEST);

   // set the viewport
   gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

   this.drawElements(indices.length);
  }

  intializeLines = () => {
    const { gl } = this;
    const vertices = [
      -0.7,-0.1,0,
      -0.3,0.6,0,
      -0.3,-0.3,0,
      0.2,0.6,0,
      0.3,-0.3,0,
      0.7,0.6,0 
    ];

   const vertex_buffer = this.createArrayBuffer(vertices);

   const vertShader = this.createVertexShader(vertex3);

   const fragShader = this.createFragmentShader(frag2);

   const shaderProgram = this.createShaderProgram([vertShader, fragShader]);

    // bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // get attribute location
    this.createAttribute(shaderProgram, 'coordinates', 3);

    // enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // set the viewport
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    this.drawLines();
  }

  intializeComplexTriangle = () => {
    const { gl } = this;

    const vertices = [
      -0.5,0.5,0.0,
      -0.5,-0.5,0.0,
      0.5,-0.5,0.0, 
    ];
    const vertex_buffer = this.createArrayBuffer(vertices);

    const indices = [0, 1, 2];
    const index_buffer = this.createElementBuffer(indices);
    
    const vertexShader = this.createVertexShader(vertex3);
    const fragShader = this.createFragmentShader(frag3);

    const shaderProgram = this.createShaderProgram([vertexShader, fragShader]);

    // bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

    // get attribute location
    this.createAttribute(shaderProgram, 'coordinates', 3);

    // enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // set the viewport
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    this.drawElements(indices.length);
  }

  initializePoints = () => {
    const { gl } = this;
    const verticies = [
      -0.5,0.5,0.0,
      0.0,0.5,0.0,
      -0.25,0.25,0.0, 
   ];

   const vertex_buffer = this.createArrayBuffer(verticies);

   const vertexShader = this.createVertexShader(vertex2);

   const fragShader = this.createFragmentShader(frag2);

   const shaderProgram = this.createShaderProgram([vertexShader, fragShader]);

    // bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // get attribute location
    this.createAttribute(shaderProgram, 'coordinates', 3);

    // enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // set the viewport
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    this.drawPoints();
  }

  initializeTriangle = () => {
    const { gl } = this;
    let vertices = [-0.9, 0.9, -0.1, -0.9, 0.8, 0.2,];

    // create new buffer object
    const vertex_buffer = this.createArrayBuffer(vertices);

    /* Create and compile shader programs */
    // create a vertex shader object
    let vertShader = this.createVertexShader(shader1);

    // fragment shader source

    // create fragment shader
    let fragShader = this.createFragmentShader(frag1);

    // create shader program
    const shaderProgram = this.createShaderProgram([vertShader, fragShader]);

    /* Associate the shader programs to buffer objects */

    // bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // get attribute location
    this.createAttribute(shaderProgram, 'coordinates', 2);

    // enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // set the viewport
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

    this.drawTriangles();
  }

  drawElements = (length: number) => {
    /* Drawing the required objects (triangle) */
    const { gl } = this;
    // clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(() => this.drawElements(length));
  }

  drawTriangles = () =>{
    /* Drawing the required objects (triangle) */
    const { gl } = this;
    // clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(this.drawTriangles);
  }

  
  drawPoints = () =>{
    /* Drawing the required objects (point) */
    const { gl } = this;
    // clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, 3);

    requestAnimationFrame(this.drawPoints);
  }

  drawLines = () => {
    /* Drawing the required objects (point) */
    this.frames = this.frames + 1;
    const { gl } = this;
    const renderMethods = [
      gl.POINTS,
      gl.LINE_STRIP,
      gl.LINE_LOOP,
      gl.LINES,
      gl.TRIANGLE_STRIP,
      gl.TRIANGLE_FAN,
      gl.TRIANGLES
    ];
    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the triangle
    gl.drawArrays(renderMethods[this.currentRenderMethod % renderMethods.length], 0, 6);

    requestAnimationFrame(this.drawLines);
  }

  render() {

    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <canvas id="webgl-target" width={400} height={400} />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    );
  }
}

export default App;

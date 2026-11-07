import * as THREE from "three";

export class Renderer {
  constructor({ vertex, fragment, uniforms, scale, onError = console.error }) {
    this.scale = scale;
    this.uniforms = { uRes: { value: new THREE.Vector2(1, 1) }, ...uniforms };
    this.gl = new THREE.WebGLRenderer({ antialias: false });
    if (!this.gl.capabilities.isWebGL2) {
      throw new Error("WebGL2 is not available in this browser or GPU driver");
    }
    this.gl.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
      const log =
        gl.getShaderInfoLog(fragmentShader) ||
        gl.getShaderInfoLog(vertexShader) ||
        gl.getProgramInfoLog(program);
      onError("Shader compile error:\n" + log);
    };
    this.gl.setPixelRatio(1);
    this.canvas = this.gl.domElement;
    document.body.appendChild(this.canvas);
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vertex,
        fragmentShader: fragment
      })
    );
    quad.frustumCulled = false;
    this.scene.add(quad);
    addEventListener("resize", () => this.resize());
    this.resize();
  }

  resize() {
    const w = Math.max(2, Math.floor(innerWidth * this.scale));
    const h = Math.max(2, Math.floor(innerHeight * this.scale));
    this.gl.setSize(w, h, false);
    this.uniforms.uRes.value.set(w, h);
  }

  setScale(scale) {
    this.scale = scale;
    this.resize();
  }

  start(frame) {
    this.gl.setAnimationLoop(frame);
  }

  render() {
    this.gl.render(this.scene, this.camera);
  }
}

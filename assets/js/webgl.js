(() => {
  'use strict';

  const canvas = document.querySelector('#data-field');
  if (!canvas || matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 720) return;

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false
  });
  if (!gl) return;

  const vertexSource = `
    attribute vec3 aPosition;
    attribute float aSeed;
    uniform float uTime;
    uniform vec2 uPointer;
    uniform float uAspect;
    varying float vPulse;

    void main() {
      float t = uTime * 0.12;
      vec3 p = aPosition;
      float wave = sin(p.x * 3.5 + t + aSeed * 6.283) * 0.08;
      p.y += wave;
      p.x += cos(p.y * 2.8 - t + aSeed * 3.1) * 0.045;
      p.xy += uPointer * vec2(0.08, 0.06) * (0.25 + aSeed);
      p.x /= uAspect;
      float depth = 1.0 / (1.55 + p.z * 0.3);
      gl_Position = vec4(p.xy * depth * 1.7, p.z * 0.08, 1.0);
      gl_PointSize = (1.2 + 3.2 * aSeed) * depth;
      vPulse = 0.35 + 0.65 * sin(t * 2.0 + aSeed * 15.0) * 0.5 + 0.35;
    }
  `;

  const fragmentSource = `
    precision mediump float;
    varying float vPulse;
    void main() {
      vec2 point = gl_PointCoord - 0.5;
      float circle = smoothstep(0.5, 0.12, length(point));
      vec3 cyan = vec3(0.282, 0.851, 1.0);
      vec3 acid = vec3(0.722, 1.0, 0.239);
      vec3 color = mix(cyan, acid, vPulse * 0.34);
      gl_FragColor = vec4(color, circle * (0.18 + vPulse * 0.26));
    }
  `;

  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  const count = Math.min(900, Math.floor(innerWidth * .62));
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const radius = .25 + Math.random() * 1.55;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
    positions[i * 3 + 2] = Math.cos(phi) * radius;
    seeds[i] = Math.random();
  }

  const makeBuffer = (data, location, size) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  };

  gl.useProgram(program);
  makeBuffer(positions, gl.getAttribLocation(program, 'aPosition'), 3);
  makeBuffer(seeds, gl.getAttribLocation(program, 'aSeed'), 1);
  const timeLocation = gl.getUniformLocation(program, 'uTime');
  const pointerLocation = gl.getUniformLocation(program, 'uPointer');
  const aspectLocation = gl.getUniformLocation(program, 'uAspect');

  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  let visible = true;
  addEventListener('pointermove', (event) => {
    targetX = event.clientX / innerWidth * 2 - 1;
    targetY = -(event.clientY / innerHeight * 2 - 1);
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    const width = Math.floor(innerWidth * ratio);
    const height = Math.floor(innerHeight * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };
  addEventListener('resize', resize, { passive: true });
  resize();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(0, 0, 0, 0);
  const started = performance.now();

  const render = (now) => {
    if (visible) {
      pointerX += (targetX - pointerX) * .025;
      pointerY += (targetY - pointerY) * .025;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLocation, (now - started) / 1000);
      gl.uniform2f(pointerLocation, pointerX, pointerY);
      gl.uniform1f(aspectLocation, innerWidth / innerHeight);
      gl.drawArrays(gl.POINTS, 0, count);
    }
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
})();

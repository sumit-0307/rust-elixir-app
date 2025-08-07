import { useState, useRef } from 'react';

export default function ShaderTab() {
  const [description, setDescription] = useState('');
  const [shaderCode, setShaderCode] = useState('');
  const canvasRef = useRef(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://elixir-backend-hs9d.onrender.com/api/shader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: description }),
      });

      const data = await response.json();
      const code = (data.shader || '// No shader returned')
  .replace(/```glsl|```/g, '') 
  .trim();

      console.log("Shader Code:\n", code);

      setShaderCode(code);
      renderShader(canvasRef.current, code);
    } catch (err) {
      setShaderCode(`// Error: ${err.message}`);
    }
  };


function renderShader(canvas, fragShaderCode) {
  if (!canvas || !fragShaderCode) return;

  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  // Vertex shader (pass position through)
  const vertShaderSrc = `
    attribute vec4 position;
    void main() {
      gl_Position = position;
    }
  `;

  const createShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Shader compile error: ' + gl.getShaderInfoLog(shader));
    }
    return shader;
  };

  try {
    const vertexShader = createShader(gl.VERTEX_SHADER, vertShaderSrc);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragShaderCode);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Program link error: ' + gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    // Setup position buffer for full screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
      ]),
      gl.STATIC_DRAW
    );

    const posAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    // Get location of time uniform (if exists)
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');

    // Animation loop
    let startTime = null;

    function renderLoop(time) {
      if (!startTime) startTime = time;
      const elapsedTime = (time - startTime) / 1000; // seconds

      gl.viewport(0, 0, canvas.width, canvas.height);

      if (timeUniformLocation)
        gl.uniform1f(timeUniformLocation, elapsedTime);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(renderLoop);
    }

    // Start animation
    requestAnimationFrame(renderLoop);

  } catch (e) {
    console.error(e.message);
  }
}


  return (
    <div className="flex flex-col items-center p-6 space-y-6 min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex flex-col items-center w-full space-y-6 bg-gray-800 p-8 rounded-2xl shadow-2xl ">
        <h2 className="text-3xl font-bold text-blue-400">Text to Shader</h2>

        <input
          type="text"
          className="w-[400px] p-2 rounded-lg outline-2 outline-blue-400 "
          placeholder="Describe your shader..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className="w-[400px] font-semibold rounded-lg px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={handleSubmit}>Generate Shader</button>
        <canvas
          ref={canvasRef}
          width={640}
  height={360}
          className="w-[70%] h-150 bg-black rounded shadow"/>
        <pre className="w-[70%] p-4 bg-gray-900 text-green-400 overflow-auto rounded">
          {shaderCode || '// Shader code will appear here...'}
        </pre>
      </div>
    </div>
  );
}

//"Only return valid GLSL shader code (no explanations, markdown, or extra text). Draw a spinning cube."
//Return strictly only a complete GLSL fragment shader program that draws a spinning cube. Do not include any comments, explanations, or markdown formatting. Output only valid GLSL code.
//Return strictly only a complete GLSL fragment shader program that shows a colorful moving gradient based on time. Do not include any comments, explanations, or markdown formatting. Output only valid GLSL code.
//Return strictly only a complete GLSL fragment shader program that shows a rotating cube with a gradient background. Do not include any comments, explanations, or markdown formatting. Output only valid GLSL code.

//Return strictly only a complete GLSL fragment shader program that uses raymarching to render a spinning cube, no comments or markdown.


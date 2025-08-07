defmodule ElixirBackendWeb.ElixirController do
  use ElixirBackendWeb, :controller
  require Logger

 @gemini_api_key "AIzaSyAXK__h4tmdSGv72tlwQolQLt2cixTnQlc"
@gemini_url "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=#{@gemini_api_key}"

  def generate(conn, %{"prompt" => prompt}) do
    case call_gemini(prompt) do
      {:ok, shader_code} ->
        json(conn, %{shader: shader_code})

      {:error, reason} ->
        json(conn, %{shader: "// Error: #{reason}"})
    end
  end

  defp clean_shader_code(raw_code) do
  raw_code
  |> String.replace(~r/```(glsl)?/, "")
  |> String.replace(~r/\/\/.*$/, "")
  |> String.trim()
end

  defp call_gemini(prompt) do
    body =
      Jason.encode!(%{
        contents: [%{parts: [%{text: 
"Generate a standalone GLSL ES 1.0 fragment shader compatible with WebGL. It must follow these strict rules:

- Use `precision mediump float;` at the top
- Use only `gl_FragColor` for output (do not use `out` variables)
- Do not include any `#version` directive
- Use only `gl_FragCoord` and `uniform float u_time` as inputs
- Do not use varyings, attributes, or external uniforms
- Must be valid for WebGL 1.0 (GLSL ES 1.0)

The shader should either:
1. Render an abstract or realistic 3D object using raymarching (e.g. a spinning cube, torus, blob, etc.)
2. Or render a colorful animated gradient based on time

Output only the valid fragment shader code with no markdown or explanation.
Generate for the following idea: #{prompt}"}]}]
      })

    headers = [{"Content-Type", "application/json"}]

    case Finch.build(:post, @gemini_url, headers, body)
         |> Finch.request(ElixirBackendFinch) do
      {:ok, %Finch.Response{status: 200, body: body}} ->
        case Jason.decode(body) do
          {:ok, %{"candidates" => [%{"content" => %{"parts" => [%{"text" => text}]} }]}} ->
            {:ok, clean_shader_code(text)}

          _ ->
            {:error, "Invalid response from Gemini"}
        end

      {:ok, %Finch.Response{status: code, body: body}} ->
        Logger.error("Gemini API error #{code}: #{body}")
        {:error, "Gemini API error: #{code}"}

      {:error, err} ->
        {:error, "Request failed: #{inspect(err)}"}
    end
  end
end


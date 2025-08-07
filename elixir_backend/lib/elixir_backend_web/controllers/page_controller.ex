defmodule ElixirBackendWeb.PageController do
  use ElixirBackendWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end

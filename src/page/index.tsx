import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { RickEditor } from "../components";
import '../components/rich-editor/style'

const App = () => (
  <div>
    <RickEditor maxLength={5000} />
  </div>
);

function renderWithHotReload() {
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById("root")
  );
}

renderWithHotReload();

if (module.hot) {
  module.hot.accept("./index.tsx", () => {
    renderWithHotReload();
  });
}

import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Zimage } from "../components";
import "../components/zimage/style";
import homeImg from "../components/assets/images/home.png";
import ayiImg from "../components/assets/images/ayi.jpg";

const App = () => (
  <div>
    <Zimage srcs={[homeImg, ayiImg, 'https://img.91xbz.com/test/customer_life_photo/758702db00384ea7ac9feae80236cda1/2019110417118d5cec5c.jpg']} />
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

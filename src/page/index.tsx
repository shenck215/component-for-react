import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { SelectCity, Calendar } from "../components";
import "../components/select-city/style";
import "../components/calendar/style";
import address from "../components/assets/address.json";

const App = () => (
  <div>
    <SelectCity
      params={{
        address,
        deepMap: [{ name: "省" }, { name: "市" }, { name: "区" }],
        search: true,
        getPopupContainer: () => document.querySelector('.nextlc-calendar'),
        onChange: (cityIds: number[], cityNames: string[]) => {
          console.log(cityIds, cityNames);
        }
      }}
    />
    <Calendar />
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

import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Calendar } from '../components';
import '../components/calendar/style';

const App = () => (
  <div>
    <Calendar />
  </div>
);

function renderWithHotReload() {
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('root')
  );
}

renderWithHotReload();

if (module.hot) {
  module.hot.accept('./index.tsx', () => {
    renderWithHotReload();
  });
}

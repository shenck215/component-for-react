import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { HelloWorld } from '@components/index'
import '@components/HelloWorld/style'

const App = () => (
  <div>
    <HelloWorld text='呵呵！' />
  </div>
)

function renderWithHotReload(){
  render(
  <AppContainer>
    <App />
  </AppContainer>, 
  document.getElementById('root'))
}

renderWithHotReload()

if(module.hot){
  module.hot.accept('./index.jsx', () => {
    renderWithHotReload(App)
  })
}
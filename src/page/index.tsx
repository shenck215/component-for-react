import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Head } from '../components'
import '../components/head/style'

const App = () => (
  <div>
    <Head title='呵呵' />
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
  module.hot.accept('./index.tsx', () => {
    renderWithHotReload()
  })
}
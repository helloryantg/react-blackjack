import React, { Component } from 'react'
import styled from 'styled-components'
import background from '../images/background/background.png'

// Styled Components
const AppContainer = styled.div`
  background-image: url(${background});
  height: 100vh;
  width: 100vw;
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 100%;
`

// Class
class App extends Component {
  
  render() {
    return (
      <AppContainer>
        <div>Fake</div>
      </AppContainer>
    )
  }
}

export default App;

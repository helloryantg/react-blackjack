import React, { Component } from 'react'
import styled from 'styled-components'
import background from '../images/background/background.png'
import Board from './Board'

// Styled Components
const AppContainer = styled.div`
  background-image: url(${background});
  height: 100vh;
  width: 100vw;
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Class
class App extends Component {
  
  render() {
    return (
      <AppContainer>
        <Board />
      </AppContainer>
    )
  }
}

export default App;

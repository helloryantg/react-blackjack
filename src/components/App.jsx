import React, { Component } from 'react'
import styled from 'styled-components'

// Styled Components
const AppContainer = styled.div`
  background-color: black;
  height: 100vh;
  color: white;
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

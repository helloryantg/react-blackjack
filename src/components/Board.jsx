import React from 'react'
import styled from 'styled-components'

const BoardContainer = styled.div`
    border: 10px;
    background-color: green;
    height: 40%;
    width: 80%;
`

const Board = () => {
    return (
        <BoardContainer>
            <div>Cards go here</div>
        </BoardContainer>
    )
}

export default Board
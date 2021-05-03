import React from 'react';
import ReactDOM from 'react-dom';

const title = 'Game of Life';

export const render = () => {
    return ReactDOM.render(
        <div>{title}</div>,
        document.getElementById('app')
    );
}

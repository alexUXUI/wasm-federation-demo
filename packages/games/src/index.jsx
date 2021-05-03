import React from 'react';
import ReactDOM from 'react-dom';

const title = 'Games App';

export const render = () => {
    return ReactDOM.render(
        <div>{title}</div>,
        document.getElementById('app')
    );
}

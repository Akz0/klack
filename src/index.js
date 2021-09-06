import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Root from './Root';
import Store from './reduxStore/store';

ReactDOM.render(
    <Provider store={Store} >
        <BrowserRouter>
            <Root />
        </BrowserRouter>
    </Provider>
    ,document.getElementById('root')
);

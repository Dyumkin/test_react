import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, IndexRedirect, browserHistory} from 'react-router';
import loggerMiddleware from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import Shield from './scripts/shield';

import reducers from './scripts/reducers';
import saga from './scripts/sagas';
import App from './scripts/components/app';
import Home from './scripts/components/home';
//import SignIn from './scripts/components/sign-in';
import SignUp from './scripts/components/sign-up';
import NoMatch from './scripts/components/no-match';
import EventEmitter, {PAGE_WRAPPER_REMOVE_CLASS} from './scripts/utils/event-emitter';

import {scrollToTop} from './scripts/utils/common-helper';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(reducers, applyMiddleware(
    loggerMiddleware(), sagaMiddleware
));

// then run the saga
sagaMiddleware.run(saga);

browserHistory.listen(route => {
    if (route.action === 'PUSH') {
        EventEmitter.emit(PAGE_WRAPPER_REMOVE_CLASS, 'active-menu');
        scrollToTop(200);
    }
});

ReactDOM.render(
    <Provider store={ store }>
        <Router history={ browserHistory }>
            <Route path="/" component={ App }>
                <IndexRoute component={ Home }/>
                <Route path="sign-up" component={ Shield(SignUp, 'guest') }/>
                <Route path="*" component={ NoMatch }/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);

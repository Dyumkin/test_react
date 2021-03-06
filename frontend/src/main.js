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
import SignIn from './scripts/components/sign-in';
import SignUp from './scripts/components/sign-up';
import Dashboard from './scripts/components/dashboard';
import Tasks from './scripts/components/dashboard/tasks';
import TaskView from './scripts/components/task';
import NoMatch from './scripts/components/no-match';
import Forbidden from './scripts/components/forbidden';
import EventEmitter, {PAGE_WRAPPER_REMOVE_CLASS} from './scripts/utils/event-emitter';
import './styles/css/style.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <Route path="/" name="Home" component={ App }>
                <IndexRoute component={ Home }/>
                <Route path="sign-up" name="Sign Up" component={ Shield(SignUp, 'guest') }/>
                <Route path="sign-in" name="Sign In" component={ Shield(SignIn, 'guest') }/>
                <Route path="dashboard" name="Dashboard" component={ Shield(Dashboard, '@') }>
                    <IndexRedirect to="all"/>
                    <Route path="(:status)" name="Tasks" component={ Shield(Tasks, '@') } />
                </Route>
                <Route path="task/(:id)" name="Task" component={ Shield(TaskView, '@') } />
                <Route path="not-found" name="404" component={ NoMatch }/>
                <Route path="forbidden" name="403" component={ Forbidden }/>
                <Route path="*" name="404" component={ NoMatch }/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);

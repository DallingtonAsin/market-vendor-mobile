import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import LoginReducer from '../reducers/login.reducer';

const loggerMiddleware = createLogger();

const configureStore = () => {
    const rootReducer = combineReducers({
        login: LoginReducer,
    });
     return createStore(LoginReducer);
    // return createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));
}

export default configureStore;
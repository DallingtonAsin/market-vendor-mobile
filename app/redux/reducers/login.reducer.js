
import { customerConstants } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

let customer = AsyncStorage.getItem('customer');
const initial_state = customer ? { loggedIn: false, customer } : {};

const LoginReducer = (state = initial_state, action) => {
    switch (action.type) {
        case customerConstants.LOGIN_REQUEST:
            return { loggedIn: false, customer: action.customer };
        case customerConstants.LOGIN_SUCCESS:
            return { loggedIn: true, customer: action.customer };
        case customerConstants.LOGIN_FAILURE:
            return { loggedIn: false, };
        case customerConstants.LOGOUT:
            return { loggedIn: false };
        default:
            return state;
    }
}
export default LoginReducer;
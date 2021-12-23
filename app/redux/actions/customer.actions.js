import { customerConstants } from '../constants/customer.constants';
import { alertActions } from '../actions/alert.actions';
import { customerService } from '../services/user.service';

export const customerActions = {
    login,
    logout,
    // getUsers,
    // getCustomers,
    // addCustomer,
    // removeCustomer,
    // addUser,
    // removeUser,
    register,
    // getAll,
    // delete: _delete
}

function login(phone_number, password) {

    try{
    return dispatch => {
        dispatch(request({ phone_number }));
        customerService.login(phone_number, password)
            .then(
                user => { 
            if(user.code === 1){
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch(success(user));
                    resolve();
            }else{
                dispatch(failure(user.message));
                resolve();
            }
                  
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    resolve();
                }
            );
    };
}catch(error){ 
    console.log("Login error", error);
    reject();
    throw error;
}

    function request(user) { return { type: customerConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: customerConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: customerConstants.LOGIN_FAILURE, error } }
}


function logout() {
    // customerService.logout();
    // return { type: customerConstants.LOGOUT };
}




function register(user) {
    return dispatch => {
        dispatch(request(user));
        customerService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure("Got this error on registration: "+error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: customerConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: customerConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: customerConstants.REGISTER_FAILURE, error } }
}



// function getAll() {
//     return dispatch => {
//         dispatch(request());

//         customerService.getAll()
//             .then(
//                 users => dispatch(success(users)),
//                 error => dispatch(failure(error.toString()))
//             );
//     };

//     function request() { return { type: customerConstants.GETALL_REQUEST } }
//     function success(users) { return { type: customerConstants.GETALL_SUCCESS, users } }
//     function failure(error) { return { type: customerConstants.GETALL_FAILURE, error } }
// }

// // prefixed function name with underscore because delete is a reserved word in javascript
// function _delete(id) {
//     return dispatch => {
//         dispatch(request(id));

//         customerService.delete(id)
//             .then(
//                 user => dispatch(success(id)),
//                 error => dispatch(failure(id, error.toString()))
//             );
//     };

//     function request(id) { return { type: customerConstants.DELETE_REQUEST, id } }
//     function success(id) { return { type: customerConstants.DELETE_SUCCESS, id } }
//     function failure(id, error) { return { type: customerConstants.DELETE_FAILURE, id, error } }
// }


// function getUsers(){ 
//    return customerService.fetchUsers();
// }

// function getCustomers(){ 
//     return customerService.fetchCustomers();
//  }

//  function addCustomer(data){
//     return customerService.registerCustomer(data);
//  }

//  function removeCustomer(data){
//     return customerService.deleteCustomer(data);
//  }

//  function addUser(data){
//     return customerService.registerUser(data);
//  }

//  function removeUser(data){
//     return customerService.deleteUser(data);
//  }
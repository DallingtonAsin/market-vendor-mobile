
import Service from './service';
import {APP_URL} from '@env';

export const customerService = {
    login,
    register,
    logout,  
};


// login = async (phone_number, password) => {
//     const endpoint = "customer/login";
//     const data = {phone_number: phone_number, password: password};
//     return await Service.postRequest(endpoint, data);
// }

// registerCustomer = async (data) => {
//     const endpoint = "customer";
//     return await Service.postRequest(endpoint, data);
// }

function login(phone_number, password) {
    const endpoint = "customer/login";
    const data = {phone_number: phone_number, password: password};
    try{
        return Service.postRequest(endpoint, data);
    }catch(error) {
        console.log('There has been a problem with your login operation: ' + error.message);
        throw error;
    }
}

function register(user) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };


    return fetch(`${APP_URL}/customer`, requestOptions).then(handleResponse);
    // const endpoint = "customer";
    // return Service.postData(endpoint, user)
    // .then(handleResponse)
    // .then(customer => {
    //     return customer;
    // }).catch(function(error) {
    //     console.log('There has been a problem with your register operation: ' + error.message);
    //     throw error;
    // });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
            }
            
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        
        return data;
    });
}



function logout() {
    // localStorage.removeItem('user');
}

// function getAll() {
//     const requestOptions = {
//         method: 'GET',
//         headers: authHeader()
//     };

//     return fetch(`${API_URL}/users`, requestOptions).then(handleResponse);
// }

// function getById(id) {
//     const requestOptions = {
//         method: 'GET',
//         headers: authHeader()
//     };

//     return fetch(`${API_URL}/users/${id}`, requestOptions).then(handleResponse);
// }



// function update(user) {
//     const requestOptions = {
//         method: 'PUT',
//         headers: { ...authHeader(), 'Content-Type': 'application/json' },
//         body: JSON.stringify(user)
//     };

//     return fetch(`${API_URL}/users/${user.id}`, requestOptions).then(handleResponse);
// }

// function _delete(id) {
//     const requestOptions = {
//         method: 'DELETE',
//         headers: authHeader()
//     };

//     return fetch(`${API_URL}/users/${id}`, requestOptions).then(handleResponse);
// }



// function authenticate (data) {
//     var url = API_URL+"/authenticate";
//     return  axiosPost(url, data);
// }



// function fetchUsers() {
//     var url = API_URL+"/users";
//     return fetchDataByGet(url, {});
// }



// function fetchCustomers (){
//     var url = API_URL+"/customers";
//     return fetchDataByGet(url, {});
// }


// function  registerCustomer(data){
//     const REGISTER_CUSTOMER_API = API_URL+"/customers";
//     return axiosPost(REGISTER_CUSTOMER_API, data);
// }


// function  deleteCustomer(data){
//     const DELETE_CUSTOMER_API = API_URL+"/customer/delete";
//     return axiosPost(DELETE_CUSTOMER_API, data);
// }


// function  registerUser(data){
//     const REGISTER_USER_API = API_URL+"/users";
//     return axiosPost(REGISTER_USER_API, data);
// }


// function deleteUser(data){
//     const DELETE_USER_API = API_URL+"/user/delete";
//     return axiosPost(DELETE_USER_API, data);
// }
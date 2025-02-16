import * as AuthApi from '../api/AuthRequest.js';

export const logIn = (formData) => async (dispatch) => {

    dispatch({ type: 'AUTH_START' })
    try {
        const { data } = await AuthApi.logIn(formData);
        localStorage.setItem("user", JSON.stringify(data.user)); // Save user details
        localStorage.setItem("token", data.token); // Save JWT token

        console.log("Stored User in localStorage:", localStorage.getItem("user"));
        console.log("Stored Token in localStorage:", localStorage.getItem("token"));
        dispatch({ type: 'AUTH_SUCCESS', data: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: 'AUTH_FAIL' })
    }
}



export const signUp = (formData) => async (dispatch) => {

    dispatch({ type: 'AUTH_START' })
    try {
        const { data } = await AuthApi.signUp(formData);
        dispatch({ type: 'AUTH_SUCCESS', data: data })
    } catch (error) {
        console.log(error);
        dispatch({ type: 'AUTH_FAIL' })
    }
}


export const logOut = () => async (dispatch) => {
    dispatch({ type: "LOG_OUT" })
}
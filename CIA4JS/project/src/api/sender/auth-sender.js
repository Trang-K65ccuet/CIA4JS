import axios from "axios";
import { Notifier } from '../../components/utils/NotiUltils';


export function sendPayload(payload, route) {
    return axios.post(route, payload).then(res => {
        if (!res.data) {
            return Promise.reject('Something went wrong');
        } else {
            if (res.data.success === true) {
                return Promise.resolve(res.data);
            } else {
                Notifier.displayError(res.data.jwt)
                return Promise.reject(res.data);
            }
        } 
    })
}

const AuthApi =  {
    sendPayload,
}

export default AuthApi;
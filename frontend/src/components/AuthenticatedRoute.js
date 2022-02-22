import {Navigate} from 'react-router-dom';

export default function AuthenticatedRoute(props) {
    return localStorage.getItem('bearerToken') !== null ? props.children : <Navigate replace to="/login"/>;
}

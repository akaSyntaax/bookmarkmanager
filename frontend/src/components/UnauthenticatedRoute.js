import {Component} from 'react';
import {Navigate} from 'react-router-dom';

export default class UnauthenticatedRoute extends Component {
    render() {
        if (localStorage.getItem('bearerToken') === null) {
            return this.props.children;
        } else {
            return <Navigate replace to="/"/>;
        }
    }
}
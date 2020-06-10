import React, {useContext} from 'react';

import Card from '../UI/Card/Card';
import './Auth.scss';
import {AuthContext} from '../../context/auth-contex';

const Auth = () => {
    const authContext = useContext(AuthContext);
    const loginHandler = () => {
        authContext.login();
    };

    console.log('RENDERING INGREDIENT FORM');
    return (
        <div className="auth">
            <Card>
                <h2>You are not authenticated!</h2>
                <p>Please log in to continue.</p>
                <button onClick={loginHandler}>Log In</button>
            </Card>
        </div>
    );
};

export default Auth;

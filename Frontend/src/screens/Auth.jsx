import React from "react";
import { useState } from "react";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // always create on top
    return (
        <div>
            <div>
                <button onClick={() => setIsLogin(true)}>Login</button>
                <button onClick={() => setIsLogin(false)}>register</button>
            </div>
            {isLogin ?(<div>
                <h1>Login</h1>
                {/* login form */}


            </div>):(
                <div>
                    <h1>Register</h1>
                    {/* register form */}
                </div>
            )}
        </div>
    );
};

export default Auth;

import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UseAuth } from "../../auth/AuthProvider";

import { API_URL } from "../../auth/constants";

import "./Admin.css";

const Login = () => {
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");
    
    const auth = UseAuth();
    const goTo = useNavigate();
    
     const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                console.log("Log in successful");
                setErrorResponse("");

                const json = await response.json();
                if(json.accessToken && json.user){
                    auth.saveUser(json);
                
                }

                goTo("/admin/dashboard");
            } else {
                console.log("Log in failed");
                const json = await response.json();
                setErrorResponse(json.error);
            }
        } catch (error) {
            console.error("Log in failed:", error);
        }
    };

    if(auth.isAuthenticated){
        return <Navigate to="/admin/dashboard"/>;
    }

    return (
        <div className="user-container">
            <div className="user-form">
                <form onSubmit={handleSubmit}>
                    <h1>Admin Login</h1>

                    <div className="user-form-content">
                        {errorResponse && (
                        <div className="errorMessage">{errorResponse}</div>
                        )}

                        <label>Usuario</label>
                        <input
                            type="text"
                            placeholder="Nombre de Usuario"
                            value={username} onChange={e => setUsername(e.target.value)}
                        />

                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password} onChange={e => setPassword(e.target.value)}
                        />

                        <button className="user-form-button" disabled={!username || !password}> 
                            Login 
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Login;
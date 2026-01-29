import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authFetch } from "../../auth/authFetch";
import { validatePassword } from "../../utils/validatePassword";

import "./Admin.css";

const Signup = () => {
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");

    const goTo = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(password);
        if (passwordError) {
            setErrorResponse(passwordError);
            return;
        }

        try {
            const response = await authFetch("/signup", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
            setErrorResponse("");
            goTo("/admin/login");
            } else {
            const json = await response.json();
            setErrorResponse(json.error);
            }
        } catch (error) {
            setErrorResponse("Error de conexión");
        }
    };

    return (
        <div className="user-container">
            <div className="user-form">
                <form className="form" onSubmit={handleSubmit}>
                    <h1>Admin Signup</h1>
                    <div className="user-form-content">
                        {errorResponse && <div className="errorMessage">{errorResponse}</div>}

                        <label>Usuario</label>
                        <input 
                            type="text" 
                            placeholder="Nombre de Usuario" 
                            value={username} onChange={(e)=>setUsername(e.target.value)} 
                        />
                        
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={password} onChange={(e)=>setPassword(e.target.value)}
                        />
                        <button className="user-form-button" disabled={!username || !password}>
                            Signup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;

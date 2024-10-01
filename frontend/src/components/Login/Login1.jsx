import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        console.log(data);
        const response = await fetch("http://localhost:4000/api/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();
        if (!response.ok) {
            setError(json.msg);
            return;
        }
        setError(null);
        console.log(json);
        localStorage.setItem('token', json.token);
        console.log(data.role);
        setRedirect(true);
    };



    return (
        redirect ? <Navigate to='/admin' /> :
            <div className="App">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control">
                        <label>Role</label>
                        <select
                            {...register("role", {
                                required: "Please select a role",
                            })}
                        >
                            <option value="">Select user type</option>
                            <option value="admin">Admin</option>
                            <option value="doctors">Doctor</option>
                            <option value="nurses">Nurse</option>
                        </select>
                        {errors.role && <p style={{ color: "red" }}>{errors.role.message}</p>}
                    </div>

                    <div className="form-control">
                        <label>Username</label>
                        <input type="text"
                            {...register("userName", {
                                required: "Username is required",
                            })}
                        />
                        {errors.userName && <p style={{ color: "red" }}>{errors.userName.message}</p>}
                    </div>

                    <div className="form-control">
                        <label>Password</label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
                    </div>


                    <div className="form-control">
                        <button type="submit">Login</button>
                    </div>
                </form>
                {error && <div className="error">{error}</div>}
            </div>
    );
}

export default Login;
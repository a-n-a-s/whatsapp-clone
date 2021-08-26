import React from "react";
import "./Login.css";
import Api from "../../api";
import {FcGoogle} from 'react-icons/fc'
const Login = ({onReceive}) => {
  const handleGoogleLogin = async () => {
    let result = await Api.googlePopup();
    if (result) {
        onReceive(result.user);
    } else {
      alert("Error");
    }
  };
  return (
    <div className="login">
      <button onClick={handleGoogleLogin}>
        <FcGoogle size={30} />
        Login with Google</button>
    </div>
  );
};

export default Login;

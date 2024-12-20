import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Newpassword() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const [errormessage, setErrormessage] = useState("");
  const [errormessage1, setErrormessage1] = useState("")

  const userEmail = Cookies.get("email")
  const handletogglepassword = () => {
    setShowpassword(!showpassword);
  }

  const data={
    password,
    userEmail,
  }
  const checkpassword = (e) => {

    e.preventDefault();
   
     if (!password) {
      setErrormessage("Please enter the password")
      setErrormessage1("")
    } else if (!confirmpassword) {
      setErrormessage("Confirm Password is required! ❌")
      setErrormessage1("")
    } else if (password !== confirmpassword) {
      setErrormessage("Passwords do not match! ❌ ")
      setErrormessage1("")
    }
     else {
      setErrormessage("")
      setErrormessage1("Password updated successfully");
      clearFields();
    }

    axios.post("http://localhost:5000/update_password",data).then((res)=>
      {
  
        console.log(res);
     
  
      }).catch((err)=>
      {
        console.log(err)
      })
  }
  const clearFields = () => {
    setEmail("");
    setPassword("");
    setConfirmpassword("");
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrormessage(""); // Clear error message
    setErrormessage1(""); // Clear success message
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmpassword(e.target.value);
    setErrormessage(""); // Clear error message
    setErrormessage1(""); // Clear success message
  };
 
  const onSubmitHandler=(e)=>
  {
    e.preventDefault();
    
  }

  return (
    <div className="password-check">
      <h2>Reset Password</h2>
      <form >
        <div className="input-group">
          <input type="text"
            placeholder=" Enter Email Id" required
            value={userEmail}
            onChange={(e) => { setEmail(e.target.value) }}
          />


        </div>
        <div className="input-group">
          <input type={showpassword ? "text" : "password"}
            placeholder=" Enter New password" required
            value={password}
            onChange={handlePasswordChange}
           
          /> 
          <span className="toggle-password" onClick={handletogglepassword}>
            {showpassword ? "🙈" : "👁"}
          </span>

        </div>
        <div className="input-group">
          <input type={showpassword ? "text" : "password"}
            placeholder="Confirm New password" required
            value={confirmpassword}
            onChange={handleConfirmPasswordChange} />
          <span className="toggle-password" onClick={handletogglepassword}>
            {showpassword ? "🙈" : "👁"}
          </span>
        </div>
        <button onClick={checkpassword} className="check-button" >check</button>
        </form >
        {errormessage && <p className="error-message">{errormessage}</p>}
        {errormessage1 && <p className="error-message1">{errormessage1}</p>}
        <p className="pass">Back to <Link to="/login" className="word">login</Link></p>
    </div>
        
    )
    
}
export default Newpassword;
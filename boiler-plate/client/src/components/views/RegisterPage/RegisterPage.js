import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {registerUser} from "../../../_action/user_action";
import {withRouter} from "react-router-dom";

function RegisterPage(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  }
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  }
  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
  }
  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  }
  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("비밀번호가 같지 않습니다.")
    }
    let body = {
      email: Email,
      password: Password,
      name: Name
    }
    dispatch(registerUser(body))
      .then(response => {
        if (response.payload.success) {
          props.history.push("/login");
        } else {
          alert("회원가입에 실패하였습니다.");
        }
      })
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100vh"
    }}>
      <form style={{display: "flex", flexDirection: "column"}}
            onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler}/>
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler}/>
        <label>Password</label>
        <input type="Password" value={Password} onChange={onPasswordHandler}/>
        <label>Confirm Password</label>
        <input type="Password" value={ConfirmPassword} onChange={onConfirmPasswordHandler}/>
        <br/>
        <button>회원가입</button>
      </form>
    </div>
  )
}

export default withRouter(RegisterPage);

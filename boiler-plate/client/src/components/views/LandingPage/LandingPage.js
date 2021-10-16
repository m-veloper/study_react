import React, {useEffect} from "react";
import axios from "axios";
import {Button} from "antd";
import {withRouter} from "react-router-dom";

function LandingPage(props) {
  useEffect(() => {
    axios.get("/api/hello")
      .then(response => console.log(response.data))
  }, [])

  const onclickHandler = () => {
    axios.get("api/users/logout")
      .then(response => {
        if (response.data.success) {
          props.history.push("/login")
        } else {
          return alert("로그아웃 성공");
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
      <h1>랜딩페이지</h1>
      <Button onClick={onclickHandler}>로그아웃</Button>
    </div>
  )
}

export default withRouter(LandingPage);

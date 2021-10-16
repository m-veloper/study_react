import react, {useEffect} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {auth} from "../_action/user_action";

export default function (SpecificComponent, option, adminRoute = null) {

  // [ SpecificComponent 설명 ]
  // 접속하려는 컴포넌트 페이지

  // [ option 설명 ]
  // null => 누구나 접근 가능한 페이지
  // true => 로그인한 유저만 접근 가능한 페이지
  // false => 로그인한 유저는 출입 불가능한 페이지

  // [ adminRoute 설명 ]
  // 관리자만 접속 가능한 페이지

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth())
        .then(response => {
          // 로그인을 하지 않은 상태
          // 로그인 하지 않은 유저가 로그인해야 접근 가능한 페이지를 접근하려 할 떄
          if (!response.payload.isAuth) {
            if (option) {
              props.history.push("/login");
            }
          } else {
            // 로그인을 한 상태
            // 로그인한 일반 유저가 관리자 페이지에 접근하려 할 때
            if (adminRoute && !response.payload.isAdmin) {
              props.history.push("/");
            } else {
              // 로그안한 유저가 로그인 페이지 또는 회원가입 페이지 등 접근하면 안되는 페이지를 접근하려 할 때
              if (!option) {
                props.history.push("/");
              }
            }

          }
        })
    })
    return (
      <SpecificComponent/>
    )
  }

  return AuthenticationCheck;
}

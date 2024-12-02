import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getCookie, removeCookie } from "../member/util/cookieUtil";
import "../main/index.css";
import "react-toastify/dist/ReactToastify.css";

function Header({
  navs = [],
  isWhite = false,
  pageTitle,
  titleBg = "#EC0245",
  textC = "#FFFFFF",
  borderB = true,
}) {
  const blobusTextColor = isWhite ? "text-white" : "text-[#3E16E2]";
  const linkTextColor = isWhite ? "text-white" : "text-[#666666]";
  const [jwt, setJwt] = useState(getCookie("jwt"));

  useEffect(() => {
    const interval = setInterval(() => {
      const newJwt = getCookie("jwt");
      if (newJwt !== jwt && !window.location.pathname.includes("member")) {
        setJwt(newJwt);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [jwt]);

  return (
    <div
      className={`font-bold ${borderB ? "border-b-2 main-border-bottom" : ""}`}
    >
      <div className="w-full sm:w-[70.6%] mx-[15%] flex justify-between items-center">
        <Link to="/main">
          <p className={`text-3xl ${blobusTextColor}`}>BLOBUS</p>
        </Link>

        <div className="flex justify-center items-center">
          {navs.map((nav) => (
            <Link
              className={`m-4 ${linkTextColor} transition duration-500 hover:text-gray-300`}
              key={nav.name}
              to={nav.link}
            >
              {nav.name}
            </Link>
          ))}
        </div>

        <div className="w-1/6">
          <p
            className={`mt-[-8px] h-[50px] rounded-b-[5px] flex justify-center items-center`}
            style={{ backgroundColor: titleBg, color: textC }}
          >
            {pageTitle} {/* 메인 글자 동적으로 텍스트 표시 */}
          </p>

          <div
            className={`text-base text-center flex justify-center items-center ${linkTextColor}`}
          >
            {!getCookie("jwt") ? (
              <>
                <Link
                  className="w-[45%] hover:text-gray-300 transition duration-500"
                  to="/member/signup"
                  replace={pageTitle === "계정"}
                >
                  회원가입
                </Link>
                <p className="w-[5%] p-2">|</p>
                <Link
                  className="w-[45%] hover:text-gray-300 transition duration-500"
                  to="/member/login"
                  replace={pageTitle === "계정"}
                >
                  로그인
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="w-[45%] hover:text-gray-300 transition duration-500"
                  to="/mypage"
                >
                  마이페이지
                </Link>
                <p className="w-[5%] p-2">|</p>
                <Link
                  className="w-[45%] hover:text-gray-300 transition duration-500"
                  onClick={() => {
                    // TODO 로그아웃 모달창
                    if (window.confirm("로그아웃하시겠습니까?")) {
                      removeCookie("jwt");
                      removeCookie("expirationTime");
                      removeCookie("name");
                      removeCookie("address");

                      if (!getCookie("idSave")) {
                        removeCookie("userId");
                        removeCookie("userRole");
                      }
                      setTimeout(() => {
                        toast.success("로그아웃");
                      }, 100);
                    }
                  }}
                >
                  로그아웃
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        style={{ width: "auto" }}
        className="text-xl text-center text-nowrap"
        position="top-center"
        autoClose={1000}
        pauseOnFocusLoss={false}
        pauseOnHover
      />
    </div>
  );
}

export default Header;

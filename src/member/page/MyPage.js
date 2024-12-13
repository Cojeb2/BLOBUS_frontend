import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookie } from "../../etc/util/cookieUtil";
import Header from "../../main/Header";
import Loading from "../../etc/component/Loading";

const MyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [jwt, setJwt] = useState(getCookie("jwt"));

  const navList = [
    { name: "청년관", link: "../youth" },
    { name: "지역관", link: "../resource" },
    { name: "커뮤니티", link: "../community" },
  ];

  useEffect(() => {
    setLoading(true);

    const interval = setInterval(() => {
      const newJwt = getCookie("jwt");

      if (!newJwt) {
        navigate("/member/login");
        setJwt(newJwt);
        setTimeout(() => {
          toast.error("로그인이 필요합니다.", { toastId: "e" });
        }, 200);
      } else if (getCookie("userRole") !== "GENERAL") {
        navigate("/");
        setTimeout(() => {
          toast.error("접근 불가능한 페이지입니다.", { toastId: "e" });
        }, 100);
      }
    }, 100);

    setLoading(false);
    return () => clearInterval(interval);
  }, [jwt]);

  return (
    <>
      {loading && <Loading />}
      <div className="bg-[rgb(255,215,25)]">
        <Header
          navs={navList}
          isWhite={true}
          pageTitle="마이페이지"
          titleBg="rgb(255,125,0)"
          borderB={false}
        />
      </div>

      <div className="w-[15%] h-screen pt-20 text-base text-center flex flex-col justify-start items-center fixed z-0">
        <div className="w-[70%] border-2 border-gray-300 rounded-[8px] font-bold">
          <div className="py-4 text-2xl">마이페이지</div>

          <div className="bg-white rounded-b-[8px] flex flex-col justify-center items-center">
            {makeNav("추천", "custom")}
            {makeNav("즐겨찾기", "bookmark")}
            {makeNav("작성글", "doc")}
            {makeNav("내정보", "info")}
          </div>
        </div>
      </div>

      <div className="mx-[15%] flex justify-center items-center">
        {/* <div className="ml-[15%] pr-[15%] h-[calc(100vh-90px)] flex justify-center items-start overflow-y-scroll"> */}
        <Outlet />
      </div>
    </>
  );
};

const makeNav = (name, link) => {
  const act = window.location.pathname.split("/")[2] === link;
  return (
    <Link
      to={`/mypage/${link}`}
      replace={window.location.pathname.includes("modify")}
      className={`w-full px-4 py-2 border-t-2 border-gray-300 text-left ${
        act
          ? "text-yellow-500 cursor-default"
          : "text-gray-500 hover:bg-gray-200 hover:text-yellow-500 transition duration-500"
      }`}
      onClick={(e) =>
        window.location.pathname.includes(link) && e.preventDefault()
      }
    >
      {name}
    </Link>
  );
};

export default MyPage;

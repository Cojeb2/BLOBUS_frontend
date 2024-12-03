import { useState } from "react";
import { Outlet } from "react-router";
import Header from "../../main/Header";
import Loading from "../../etc/component/Loading";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Community = () => {
  const [loading, setLoading] = useState(false);

  const navList = [
    { name: "청년관", link: "../youth" },
    { name: "기업관", link: "../enterprise" },
    { name: "지역관", link: "../resource" },
    { name: "커뮤니티", link: "../community" },
  ];

  return (
    <>
      {loading && <Loading />}
      <div className="bg-[#DB0153]">
        <Header
          navs={navList}
          isWhite={true}
          pageTitle="커뮤니티"
          titleBg="#A1003C"
          borderB={false}
        />
      </div>

      <div className="mx-[15%] flex justify-center items-center">
        <Outlet />
      </div>

      <button
        className="bg-yellow-300 p-4 rounded-full text-base font-bold fixed bottom-20 right-20 hover:bg-yellow-500 hover:text-white transition duration-500"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FaArrowUp />
      </button>
      <button
        className="bg-yellow-300 p-4 rounded-full text-base font-bold fixed bottom-5 right-20 hover:bg-yellow-500 hover:text-white transition duration-500"
        onClick={() =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          })
        }
      >
        <FaArrowDown />
      </button>
    </>
  );
};

export default Community;

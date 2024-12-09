import React from "react";
import Header from "../main/Header"; // Header를 대문자로 수정
import { Outlet } from "react-router";

function Resources() {
  const resources = [
    { name: "디지털 마케팅", link: "digital" },
    { name: "문화", link: "culture" },
    { name: "관광", link: "sightsee" },
  ];

  return (
    <div>
      <div className="bg-[linear-gradient(45deg,_#FF0033,_#4900D2)]">
        {/* Header에 isWhite prop을 true로 전달하고, pageTitle을 '청년관'으로 설정 */}
        <Header
          navs={resources}
          isWhite={true}
          pageTitle="지역자원"
          titleBg="#4400A8"
          borderB={false}
        />
      </div>
      <div className="w-[70%] h-[600px] ml-[15%]">
        <Outlet />
      </div>
    </div>
  );
}

export default Resources;

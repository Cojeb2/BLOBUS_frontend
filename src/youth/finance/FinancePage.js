import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { fetchPagedPolicies } from "./FinanceApi";

const FinancePage = () => {
  const [policies, setPolicies] = useState([]);
  const [totalPages, setTotalPages] = useState(0); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [searchParams, setSearchParams] = useSearchParams(); 
  const navigate = useNavigate(); 

  // 입력 중인 검색어와 최종 검색어를 분리
  const [inputKeyword, setInputKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리 상태

  // 페이징을 위한 값들
  const pageSize = 5; 
  const pagesPerGroup = 10; 
  const currentPage = (parseInt(searchParams.get("page")) || 1) - 1; 
  const currentPageGroup = Math.floor(currentPage / pagesPerGroup);
  const startPage = currentPageGroup * pagesPerGroup;
  const endPage = Math.min(startPage + pagesPerGroup, totalPages);

  const [searchs, setSearchs] = useState(
    {
      currentPage: 0,
      pageSize: pageSize,
      searchKeyword: "",
      selectedCategory: "전체"
    }
  );

  const location = useLocation();

  const getPagedPolicies = async (searchParams) => {
    try {
      setLoading(true);
      // 최종 검색어(searchKeyword)를 사용하여 정책 조회
      const data = await fetchPagedPolicies(searchParams);
      setPolicies(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load policies.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const checkUrlAndFetchPolicies = () => {
      const url = window.location.href;
      // 초기 검색 조건으로 데이터 불러오기, 나중에 경로가 변경되면 수정 필요
      if (url === 'http://localhost:3000/youth/finance') {  
        const defaultSearchParams = {
          currentPage: 0,
          pageSize: pageSize,
          searchKeyword: "",
          selectedCategory: "전체"
        };
        setSearchs(defaultSearchParams);
        setSelectedCategory("전체");
        setInputKeyword("");
        getPagedPolicies(defaultSearchParams);
      } else {
        getPagedPolicies(searchs);
      }
    };

    checkUrlAndFetchPolicies();

    // URL 변경을 감지하기 위해 이벤트 리스너 추가
    window.addEventListener('popstate', checkUrlAndFetchPolicies);

    return () => {
      window.removeEventListener('popstate', checkUrlAndFetchPolicies);
    };
  }, [location]);

  
  // 페이지 변경 함수 수정
  const handlePageChange = (page) => {
    const updatedSearchs = {
      ...searchs,
      currentPage: page,
    };

    setSearchs(updatedSearchs);
    setSearchParams({
      page: page + 1,
      ...(searchs.searchKeyword && { keyword: searchs.searchKeyword }),
      category: searchs.selectedCategory,
    });

    getPagedPolicies(updatedSearchs);
  };

  
  // 카테고리 변경 핸들러
  // const handleCategoryChange = (category) => {
  //   const updatedSearchs = {
  //     ...searchs,
  //     selectedCategory: category, // 카테고리 업데이트
  //   };
  
  //   setSelectedCategory(category);
  //   setSearchs(updatedSearchs);
  // };

  // 카테고리 변경 핸들러 통합
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchs((prevSearchs) => ({
      ...prevSearchs,
      selectedCategory: category
    }));
  };
  
  const renderCategoryButton = (category) => (
    <button
      className={`bg-blue-300 text-white px-4 py-2 rounded ${
        selectedCategory === category ? "bg-blue-500" : ""
      }`}
      onClick={() => handleCategoryChange(category)}
    >
      {category}
    </button>
  );

  // 검색 핸들러 추가 - 입력 중인 검색어를 최종 검색어로 설정
  const handleSearch = () => {
    const updatedSearchs = {
      ...searchs,
      searchKeyword: inputKeyword, // 검색어 업데이트
      currentPage: 0 // 페이지 초기화
    };
  
    setSearchs(updatedSearchs);
    setSearchParams({ 
      page: 1, 
      ...(inputKeyword && { keyword: inputKeyword }),
      category: selectedCategory 
    });
  
    getPagedPolicies(updatedSearchs); // 업데이트된 검색 조건으로 데이터 불러오기
  };

  // 정책 클릭 시 상세 페이지로 이동
  const handlePolicyClick = (policyId) => {
    navigate(`/youth/finance/${policyId}`);
  };

  // 초기화 핸들러 - 검색어 초기화
  const handleReset = () => {
    navigate('/youth/finance');
  };

  //  페이지 이동 함수
  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage < totalPages) {
      handlePageChange(nextPage);
    }
  };

  const handlePreviousPage = () => {
    const previousPage = currentPage - 1;
    if (previousPage >= 0) {
      handlePageChange(previousPage);
    }
  };

  const handleNextGroup = () => {
    const nextGroup = currentPageGroup + 1;
    const firstPageOfNextGroup = nextGroup * pagesPerGroup;
    if (firstPageOfNextGroup < totalPages) {
      handlePageChange(firstPageOfNextGroup);
    }
  };

  const handlePreviousGroup = () => {
    const prevGroup = Math.max(currentPageGroup - 1, 0);
    const firstPageOfPrevGroup = prevGroup * pagesPerGroup;
    handlePageChange(firstPageOfPrevGroup);
  };

  // 페이지 버튼 렌더링 함수
  const renderPageButton = (page, label, onClick, disabled = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 mx-1 rounded ${
        currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
      } ${disabled ? "disabled:opacity-50" : ""}`}
    >
      {label}
    </button>
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* 기존 필터 버튼들 그대로 유지 */}
      <div className="border-2 border-blue-400">
        <div className="flex gap-2">
          {renderCategoryButton("전체")}
          {renderCategoryButton("제목")}
          {renderCategoryButton("내용")}
        </div>
        
        <div className="flex gap-2">
          <button className="bg-blue-300 text-white px-4 py-2 rounded">부산진구</button>
          <button className="bg-blue-300 text-white px-4 py-2 rounded">해운대구</button>
          <button className="bg-blue-300 text-white px-4 py-2 rounded">서구</button>
          <button className="bg-blue-300 text-white px-4 py-2 rounded">동구</button>
          <button className="bg-blue-300 text-white px-4 py-2 rounded">중구</button>
          <button className="bg-blue-300 text-white px-4 py-2 rounded">북구</button>
          <button className="bg-blue-300 text-white px-4 py-2 rounded">etc..</button>
        </div>
      </div>

      {/* 검색 입력창 및 버튼 */}
      <div className="border-2 border-blue-400 h-[100px] flex items-center justify-center px-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="검색어 입력창"
            value={inputKeyword}
            // 입력 중인 검색어 상태 업데이트
            onChange={(e) => {
              setInputKeyword(e.target.value)
            }}
            // 엔터 키 입력 시 검색 실행
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="border border-gray-300 px-4 py-2 rounded w-[750px]"
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            검색
          </button>
          <button 
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 기존 정책 리스트 렌더링 */}
      <div className="border-2 border-blue-400 h-[68%] mt-[2%]">
        <ul>
          {policies.map((policy) => (
            <li 
              key={policy.policyId} 
              className="border border-blue-300 m-2 cursor-pointer" 
              onClick={() => handlePolicyClick(policy.policyId)}
            >
              <h2 className="font-bold text-lg">{policy.title}</h2>
              <p>{policy.overview}</p>
              <p>
                Application Period: {policy.applicationPeriodStart} to{" "}
                {policy.applicationPeriodEnd}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 기존 페이징 버튼 */}
      <div className="w-[200px] h-[20px] ml-[40%] mt-[5px]">
        <div className="w-full flex justify-center mt-4">
          {/* 이전 그룹 버튼 */}
          {currentPageGroup > 0 && renderPageButton(null, '<<', handlePreviousGroup)}

          {/* 이전 페이지 버튼 */}
          {renderPageButton(null, '<', handlePreviousPage, currentPage === 0)}

          {/* 현재 그룹에 해당하는 페이지 버튼 */}
          {Array.from({ length: endPage - startPage }, (_, index) => startPage + index).map((page) =>
            renderPageButton(page, page + 1, () => handlePageChange(page))
          )}

          {/* 다음 페이지 버튼 */}
          {renderPageButton(null, '>', handleNextPage, currentPage === totalPages - 1)}

          {/* 다음 그룹 버튼 */}
          {endPage < totalPages && renderPageButton(null, '>>', handleNextGroup)}
        </div>
      </div>

      {/* 사이드바 */}
      <div className="invisible w-[170px] h-[200px] bg-gray-400 rounded-lg ml-[2%] mt-[-31%]">
        내꺼는 사이드바 없음
      </div>
    </div>
  );
};

export default FinancePage;
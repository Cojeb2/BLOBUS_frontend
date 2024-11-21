import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchPagedPolicies } from "./FinanceApi";

const FinancePage = () => {
  const [policies, setPolicies] = useState([]);
  const [totalPages, setTotalPages] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams(); 
  const navigate = useNavigate(); 

  // 입력 중인 검색어와 최종 검색어를 분리
  const keyword = searchParams.get("keyword");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");
  
  if(isSearch && !searchParams.get("page")) {
    setIsSearch(false);
    setInputKeyword("");
    setSearchKeyword("");
  }

  const pageSize = 5; 
  const pagesPerGroup = 10; 

  // URL에서 현재 페이지 읽기 (초기값: 0)
  const currentPage = (parseInt(searchParams.get("page")) || 1) - 1; 
  const currentPageGroup = Math.floor(currentPage / pagesPerGroup);

  useEffect(() => {
    const getPagedPolicies = async () => {
      try {
        setLoading(true);
        // 최종 검색어(searchKeyword)를 사용하여 정책 조회
        const data = await fetchPagedPolicies(currentPage, pageSize, searchKeyword);
        setPolicies(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Failed to load policies.");
      } finally {
        setLoading(false);
      }
    };

    getPagedPolicies();
  }, [currentPage, searchKeyword]); // searchKeyword가 변경될 때만 조회

  // 페이지 변경 함수 수정
  const handlePageChange = (page) => {
    // 검색어도 함께 URL 파라미터에 포함
    setSearchParams({ 
      page: page + 1,
      ...(searchKeyword && { keyword: searchKeyword }) 
    });
  };

  // 검색 핸들러 추가 - 입력 중인 검색어를 최종 검색어로 설정
  const handleSearch = () => {
    // 검색 시 첫 페이지로 이동
    setSearchKeyword(inputKeyword);
    setSearchParams({ 
      page: 1, 
      ...(searchKeyword && { keyword: inputKeyword }) 
    });

    setIsSearch(true);
  };

  // 나머지 페이징 관련 함수들은 기존과 동일
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const startPage = currentPageGroup * pagesPerGroup;
  const endPage = Math.min(startPage + pagesPerGroup, totalPages);

  return (
    <div>
      {/* 기존 필터 버튼들 그대로 유지 */}
      <div className="border-2 border-blue-400">
        <div className="flex gap-2">
          <button className="bg-blue-300 text-white px-4 py-2 rounded">전체</button>
          <button className="bg-blue-300 text-white px-4 py-2 rounded">제목</button>
          <button className="bg-blue-300 text-white px-4 py-2 rounded">내용</button>
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
        </div>
      </div>

      {/* 기존 정책 리스트 렌더링 */}
      <div className="border-2 border-blue-400 h-[68%] mt-[2%]">
        <ul>
          {policies.map((policy) => (
            <li key={policy.policyId} className="mb-4">
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
          {currentPageGroup > 0 && (
            <button
              onClick={handlePreviousGroup}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            >
              {'<'}{'<'}
            </button>
          )}

          {/* 이전 페이지 버튼 */}
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            {'<'}
          </button>

          {/* 현재 그룹에 해당하는 페이지 버튼 */}
          {Array.from(
            { length: endPage - startPage },
            (_, index) => startPage + index
          ).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {page + 1}
            </button>
          ))}

          {/* 다음 페이지 버튼 */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            {'>'}
          </button>

          {/* 다음 그룹 버튼 */}
          {endPage < totalPages && (
            <button
              onClick={handleNextGroup}
              className="px-4 py-2 mx-1 bg-gray-200 rounded"
            >
              {'>'}{'>'}
            </button>
          )}
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
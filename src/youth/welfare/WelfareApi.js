import axiosInstance from "./axiosInstance";

// 모든 정책 가져오기
export const fetchAllPolicies = async () => {
  try {
    const response = await axiosInstance.get("/policies");
    return response.data; // 데이터 반환
  } catch (error) {
    console.error("Failed to fetch policies:", error);
    throw error; // 에러 전달
  }
};

// 페이징된 정책 가져오기 석현이형이랑 맞춘거
export const fetchPagedPolicies = async (data) => {
  // console.log(data);
  
  const page = data?.currentPage || 0;
  const size = data?.pageSize || 10;
  const keyword = data?.searchKeyword || "";
  const category = data?.selectedCategory || "전체";
  try {
    const response = await axiosInstance.get(`/paged-policies?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(category)}`);
    // console.log(response);
    return response.data; // 데이터를 반환 (Page 객체)
  } catch (error) {
    console.error(`Failed to fetch policies for page ${page} and keyword "${keyword}", and category "${category}":`, error);
    throw error; // 에러 전달
  }
};

// // 페이징된 정책 가져오기
// export const fetchPagedPolicies = async (page, size, keyword="", category = "전체") => {
//   try {
//     const response = await axiosInstance.get(`/paged-policies?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(category)}`);
//     return response.data; // 데이터를 반환 (Page 객체)
//   } catch (error) {
//     console.error(`Failed to fetch policies for page ${page} and keyword "${keyword}", and category "${category}":`, error);
//     throw error; // 에러 전달
//   }
// };

// 특정 ID의 정책 가져오기
export const fetchPolicyById = async (id) => {
  try {
    const response = await axiosInstance.get(`/policies/${id}`);
    return response.data; // 데이터 반환
  } catch (error) {
    console.error(`Failed to fetch policy with ID ${id}:`, error);
    throw error; // 에러 전달
  }
};

// 정책 수정
export const modifyPolicy = async (modifyData) => {
  try {
    const response = await axiosInstance.post(`/policies/${modifyData.policyId}`, modifyData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update policy ID ${modifyData.policyId}:`, error);
    throw error;
  }
};

// 정책 삭제
export const deletePolicy = async (id) => {
  try {
    await axiosInstance.delete(`/policies/${id}`);
    console.log(`Policy ID ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete policy ID ${id}:`, error);
    throw error;
  }
};

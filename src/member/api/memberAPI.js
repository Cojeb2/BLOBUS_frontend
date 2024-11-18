import axios from "axios";

const API_SERVER_HOST = "http://localhost:8080";
const host = `${API_SERVER_HOST}/member`;

export const login = async (member) => {
  const headers = {
    header: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  const res = await axios.post(`${host}/login`, member, headers);

  return res.data;
};

export const duplicate = async (member) => {
  const res = await axios.get(
    `${host}/${member.roleName.toLowerCase()}/dup/${member.userId}`
  );

  return res.data;
};

export const sendMail = async (member) => {
  const res = await axios.post(
    `${host}/${member.roleName.toLowerCase()}/send/${member.userId}`
  );

  return res.data;
};

export const register = async (member) => {
  const res = await axios.post(
    `${host}/${member.roleName.toLowerCase()}/`,
    member
  );

  return res.data;
};

// export const modifyOne = async (employee) => {
//   const res = await axios.put(`${host}/${employee.enb}`, employee, {
//     headers: header,
//   });
//   return res.data;
// };

// export const deleteOne = async (enb) => {
//   const res = await axios.delete(`${host}/${enb}`, {
//     headers: header,
//   });
//   return res.data;
// };

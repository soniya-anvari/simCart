import axios from "axios";

const BASE_URL = "https://oksimapi.hassanvahedi.ir/api/Simcards";

export const fetchSimcardsFiltered = async () => {
  const res = await axios.post(`${BASE_URL}`);
  return res.data;
};

export const batchUpdateSimcards = async (payload) => {
  return axios.post(`${BASE_URL}/batch`, payload);
};

export const updateSimcard = async (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data);
};

export const deleteSimcard = async (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

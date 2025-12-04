import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = "enable", pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products?${queryString}`);

  return { data: response.data, error: null };
};
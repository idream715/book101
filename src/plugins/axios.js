import axios from 'axios'

// For development
let baseURL = 'https://api3.rgtcenter.com:2053/dm01/'

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'apiKey': 'i_WHrjpLqGa9PcP4BwaoKHXeQkYzzGEN7Pddk8kD',
  }
});

// Legacy API for existing components
export const callApi = {
  getData(action) {
    return instance.get(action)
  },
  postData(action, data) {
    return instance.post(action, data)
  },
  searchData(action, data) {
    return instance.post(action, data)
  }
}

// Export main API instance for all operations
export const searchApi = instance

// Default export for backwards compatibility
export default callApi
import axios from 'axios'

// Use environment variables for security
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.dhamma01.com/dm01/'
const apiKey = import.meta.env.VITE_API_KEY

if (!apiKey) {
  console.error('⚠️  API Key not found. Please check your environment variables.')
}

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'apiKey': apiKey || '',
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
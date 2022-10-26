import axios from 'axios'

let baseURL = 'https://api3.rgtcenter.com:2053/dm01'
let searchURL = 'https://localhost:7700/'

const instance = axios.create({
    baseURL: baseURL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'apiKey': 'i_WHrjpLqGa9PcP4BwaoKHXeQkYzzGEN7Pddk8kD',
    }
});

const instance2 = axios.create({
  baseURL: searchURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
});

export default {
    getData(action) {
      let url = `${baseURL}`
      url += action
      return instance.get(url)
    },
    postData(action, data) {
      let url = `${baseURL}`
      url += action
      return instance.post(url, data)
    },
    searchData(action, data) {
      let url = `${searchURL}`
      url += action
      return instance2.post(url, data)
    }
}
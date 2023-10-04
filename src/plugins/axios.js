import axios from 'axios'

let baseURL = 'https://api3.rgtcenter.com:2053/dm01'
let searchURL = 'https://dm01.code-th.com/books'
const accessToken = 'dhamma101'

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
    'Authorization': 'Bearer ' + accessToken
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
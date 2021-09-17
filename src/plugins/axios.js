import axios from 'axios'

let baseURL = 'https://api3.rgtcenter.com:2053/dm01'

const instance = axios.create({
    baseURL: baseURL,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'apiKey': 'i_WHrjpLqGa9PcP4BwaoKHXeQkYzzGEN7Pddk8kD',
    }
});

export default {
    getData( action) {
      let url = `${baseURL}`
      url += action
      return instance.get(url)
    },
    postData(action, data) {
      let url = `${baseURL}`
      url += action
      return instance.post(url, data)
    }
}
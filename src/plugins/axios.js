import axios from 'axios'

let baseURL = 'https://script.google.com/macros/s/AKfycbxMKWkpWMFtwUfgZ_zZ5iDB7fJXqOdwPcb8FEe22exvxnZMSOLj/exec'

const instance = axios.create({
    baseURL: baseURL,
    headers: {'Content-Type': 'application/json'}
});

export default {
    getData( action) {
        let url = `${baseURL}`
        url += action
        return instance.get(url)
    }
}
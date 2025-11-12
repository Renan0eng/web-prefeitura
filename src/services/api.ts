import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://prefeitura.back.renannardi.com',
    withCredentials: true,
})

export default api
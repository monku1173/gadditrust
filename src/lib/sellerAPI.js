const API_BASE_URL = 'http://localhost:5001/api'

const isBrowser = typeof window !== 'undefined'

export const getAuthToken = () => {
  if (!isBrowser) return null
  return localStorage.getItem('token')
}

export const setAuthToken = (token) => {
  if (!isBrowser || !token) return
  localStorage.setItem('token', token)
}

export const clearAuthToken = () => {
  if (!isBrowser) return
  localStorage.removeItem('token')
}

const buildHeaders = ({ headers = {}, body } = {}) => {
  const mergedHeaders = { ...headers }
  const token = getAuthToken()

  if (body && !(body instanceof FormData)) {
    mergedHeaders['Content-Type'] = 'application/json'
  }

  if (token) {
    mergedHeaders.Authorization = `Bearer ${token}`
  }

  return mergedHeaders
}

const parseResponse = async (response) => {
  const text = await response.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch (error) {
      data = text
    }
  }

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || response.statusText
    throw new Error(errorMessage || 'Request failed')
  }

  return data
}

const apiRequest = async (endpoint, options = {}) => {
  const { body, headers, ...rest } = options
  const requestOptions = {
    ...rest,
    headers: buildHeaders({ headers, body }),
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions)
  return parseResponse(response)
}

export const sellerAPI = {
  register: (credentials) => apiRequest('/auth/register', {
    method: 'POST',
    body: credentials,
  }),

  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  }),

  me: () => apiRequest('/auth/me'),
  listVehicles: () => apiRequest('/vehicles'),
  getVehicle: (id) => apiRequest(`/vehicles/${id}`),

  createVehicle: (data) => {
    if (data instanceof FormData) {
      return apiRequest('/vehicles', {
        method: 'POST',
        body: data,
      })
    }

    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item))
      } else {
        formData.append(key, value)
      }
    })

    return apiRequest('/vehicles', {
      method: 'POST',
      body: formData,
    })
  },

  updateVehicle: (id, data) => apiRequest(`/vehicles/${id}`, {
    method: 'PUT',
    body: data,
  }),

  deleteVehicle: (id) => apiRequest(`/vehicles/${id}`, {
    method: 'DELETE',
  }),

  getSellerProfile: (id) => apiRequest(`/sellers/${id}`),
  getMyProfile: () => apiRequest('/sellers/me'),
  updateMyProfile: (data) => apiRequest('/sellers/me', {
    method: 'PUT',
    body: data,
  }),
  getSellerListings: (id) => apiRequest(`/sellers/${id}/listings`).then((response) => response?.vehicles || response?.listings || response?.data || []),
  getSellerRatings: (id) => apiRequest(`/sellers/${id}/ratings`),

  getSellerInquiries: () => apiRequest('/inquiries/seller/inquiries'),
  updateInquiryStatus: (id, status) => apiRequest(`/inquiries/${id}`, {
    method: 'PUT',
    body: { status },
  }),

  getConversations: () => apiRequest('/conversations'),
  getMessages: (conversationId) => apiRequest(`/messages/${conversationId}`),
  sendMessage: (message) => apiRequest('/messages', {
    method: 'POST',
    body: message,
  }),
}

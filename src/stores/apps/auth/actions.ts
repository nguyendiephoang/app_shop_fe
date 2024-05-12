import { createAsyncThunk } from '@reduxjs/toolkit'

//**Service */
import { registerAuth, updateAuthMe } from 'src/services/auth'

export const ResiterAuthAsync = createAsyncThunk('auth/register', async (data: any) => {
  const response = await registerAuth(data)
  if (response?.data) {
    return response
  }

  return { data: null, message: response?.response.data.message, typeError: response?.response.data.typeError }
})

export const updateAuthMeAsync = createAsyncThunk('auth/update-me', async (data: any) => {
  const response = await updateAuthMe(data)
  if (response?.data) {
    return response
  }

  return { data: null, message: response?.response.data.message, typeError: response?.response.data.typeError }
})

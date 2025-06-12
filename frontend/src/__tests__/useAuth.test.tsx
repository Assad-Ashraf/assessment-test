import { renderHook, act } from '@testing-library/react'
import Cookies from 'js-cookie'
import { useAuth } from '../hooks/useAuth'

const mockCookies = Cookies as jest.Mocked<typeof Cookies>

describe('useAuth hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('initializes with unauthenticated state when no token exists', () => {

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.username).toBe(null)
    expect(result.current.role).toBe(null)
    expect(result.current.loading).toBe(false)
  })

  test('initializes with authenticated state when token exists', () => {

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.username).toBe('testuser')
    expect(result.current.role).toBe('User')
  })

  test('login function sets authentication state and cookies', () => {

    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.login('test-token', 'testuser', 'User')
    })

    expect(mockCookies.set).toHaveBeenCalledWith('token', 'test-token', { expires: 1 })
    expect(mockCookies.set).toHaveBeenCalledWith('username', 'testuser', { expires: 1 })
    expect(mockCookies.set).toHaveBeenCalledWith('role', 'User', { expires: 1 })
    
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.username).toBe('testuser')
    expect(result.current.role).toBe('User')
  })

  test('logout function clears authentication state and cookies', () => {

    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.logout()
    })

    expect(mockCookies.remove).toHaveBeenCalledWith('token')
    expect(mockCookies.remove).toHaveBeenCalledWith('username')
    expect(mockCookies.remove).toHaveBeenCalledWith('role')
    
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.username).toBe(null)
    expect(result.current.role).toBe(null)
  })
})
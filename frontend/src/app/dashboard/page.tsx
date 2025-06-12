'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../../components/Layout'
import { authApi, userApi } from '../../services/api'
import { DashboardData, User, PagedResult, UserSearchRequest, SortConfig } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { useToast } from "@/hooks/use-toast"

// shadcn/ui imports
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

// Icons
import { Users, UserPlus, Edit, Trash2, MoreVertical, Shield, User as UserIcon, Search, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react'

interface CreateUserForm {
  username: string
  password: string
  email: string
  role: string
}

interface UpdateUserForm {
  username?: string
  email?: string
  role?: string
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [pagedUsers, setPagedUsers] = useState<PagedResult<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)
  
  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'username', direction: 'asc' })
  
  const { role } = useAuth()
  const { toast } = useToast()

  const createForm = useForm<CreateUserForm>()
  const updateForm = useForm<UpdateUserForm>()

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (role === 'Admin') {
        setCurrentPage(1) // Reset to first page on search
        fetchUsers()
      }
    }, 300) // 300ms delay for debouncing

    return () => clearTimeout(delayedSearch)
  }, [searchTerm, sortConfig])

  useEffect(() => {
    fetchData()
  }, [role])

  useEffect(() => {
    if (role === 'Admin') {
      fetchUsers()
    }
  }, [currentPage, pageSize, role])

  const fetchData = async () => {
    try {
      const dashboardResponse = await authApi.getDashboard()
      setDashboardData(dashboardResponse)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load dashboard'
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    if (role !== 'Admin') return
    
    setIsLoadingUsers(true)
    try {
      const searchRequest: UserSearchRequest = {
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm.trim() || undefined,
        sortBy: sortConfig.key,
        sortDirection: sortConfig.direction
      }

      const usersResponse = await userApi.searchUsers(searchRequest)
      setPagedUsers(usersResponse)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load users'
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-primary" />
      : <ArrowDown className="h-4 w-4 text-primary" />
  }

  const clearSearch = () => {
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleCreateUser = async (data: CreateUserForm) => {
    try {
      await userApi.createUser(data)
      toast({
        title: "Success!",
        description: "User created successfully!",
      })
      setShowCreateForm(false)
      createForm.reset()
      fetchUsers()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create user'
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    }
  }

  const handleUpdateUser = async (data: UpdateUserForm) => {
    if (!editingUser) return

    try {
      await userApi.updateUser(editingUser.id, data)
      toast({
        title: "Success!",
        description: "User updated successfully!",
      })
      setEditingUser(null)
      updateForm.reset()
      fetchUsers()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update user'
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await userApi.deleteUser(userId)
      toast({
        title: "Success!",
        description: "User deleted successfully!",
      })
      setDeletingUserId(null)
      
      const newTotalCount = (pagedUsers?.totalCount || 1) - 1
      const newTotalPages = Math.ceil(newTotalCount / pageSize) || 1
      
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages)
      } else {
        fetchUsers()
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user'
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    }
  }

  const startEditUser = (user: User) => {
    setEditingUser(user)
    updateForm.setValue('username', user.username)
    updateForm.setValue('email', user.email)
    updateForm.setValue('role', user.role)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagedUsers?.totalPages || 1)) {
      setCurrentPage(page)
    }
  }

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize))
    setCurrentPage(1)
  }

  const generatePageNumbers = () => {
    const totalPages = pagedUsers?.totalPages || 1
    const pages = []
    const delta = 2

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (loading) {
    return (
      <Layout requireAuth>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout requireAuth>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {dashboardData?.message || 'Welcome to your dashboard'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Username</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.username}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Role</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.role}</div>
            </CardContent>
          </Card>

          {role === 'Admin' && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pagedUsers?.totalCount || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pagedUsers?.data.length || 0}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Admin User Management */}
        {role === 'Admin' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts with search and sorting
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users by username, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Show</span>
                  <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">entries</span>
                </div>
              </div>

              {/* Results Info */}
              {pagedUsers && (
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pageSize) + 1} to{' '}
                    {Math.min(currentPage * pageSize, pagedUsers.totalCount)} of{' '}
                    {pagedUsers.totalCount} users
                    {searchTerm && (
                      <span className="ml-2 text-primary">
                        (filtered by "{searchTerm}")
                      </span>
                    )}
                  </div>
                  {searchTerm && (
                    <Button variant="outline" size="sm" onClick={clearSearch}>
                      Clear Search
                    </Button>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {/* Users Table */}
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('username')}
                              className="h-auto p-0 font-medium hover:bg-transparent"
                            >
                              User
                              {getSortIcon('username')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('role')}
                              className="h-auto p-0 font-medium hover:bg-transparent"
                            >
                              Role
                              {getSortIcon('role')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('createdat')}
                              className="h-auto p-0 font-medium hover:bg-transparent"
                            >
                              Created
                              {getSortIcon('createdat')}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagedUsers?.data.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              <div className="flex flex-col items-center gap-2">
                                <Search className="h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                  {searchTerm ? `No users found for "${searchTerm}"` : 'No users found'}
                                </p>
                                {searchTerm && (
                                  <Button variant="outline" size="sm" onClick={clearSearch}>
                                    Clear Search
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          pagedUsers?.data.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/50">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.username}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                                <div className="text-xs">
                                  {new Date(user.createdAt).toLocaleTimeString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => startEditUser(user)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => setDeletingUserId(user.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {pagedUsers && pagedUsers.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(currentPage - 1)}
                              className={!pagedUsers.hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {generatePageNumbers().map((pageNum, index) => (
                            <PaginationItem key={index}>
                              {pageNum === '...' ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  onClick={() => handlePageChange(pageNum as number)}
                                  isActive={currentPage === pageNum}
                                  className="cursor-pointer"
                                >
                                  {pageNum}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(currentPage + 1)}
                              className={!pagedUsers.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Regular User Card */}
        {role === 'User' && (
          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>
                You have access to your personal dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <UserIcon className="h-4 w-4" />
                <AlertDescription>
                  As a regular user, admin features are not available for your role.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Create User Dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createForm.handleSubmit(handleCreateUser)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...createForm.register('username', { required: 'Username is required' })}
                />
                {createForm.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...createForm.register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {createForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...createForm.register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {createForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {createForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => createForm.setValue('role', value)} defaultValue="User">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    createForm.reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={updateForm.handleSubmit(handleUpdateUser)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  {...updateForm.register('username')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  {...updateForm.register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {updateForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {updateForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select onValueChange={(value) => updateForm.setValue('role', value)} defaultValue={editingUser?.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingUser(null)
                    updateForm.reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Update User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deletingUserId} onOpenChange={() => setDeletingUserId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeletingUserId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deletingUserId && handleDeleteUser(deletingUserId)}
              >
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

export default Dashboard
// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Helper Functions
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async register(data: { email: string; username: string; password: string }) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(result.token);
    return result;
  }

  async login(data: { email: string; password: string }) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(result.token);
    return result;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Species
  async getSpecies(params?: { category?: string; subcategory?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.subcategory) query.append('subcategory', params.subcategory);
    if (params?.search) query.append('search', params.search);
    return this.request(`/species?${query.toString()}`);
  }

  async getSpeciesById(id: string) {
    return this.request(`/species/${id}`);
  }

  // Pets
  async getPets() {
    return this.request('/pets');
  }

  async getPetById(id: string) {
    return this.request(`/pets/${id}`);
  }

  async createPet(data: any) {
    return this.request('/pets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePet(id: string, data: any) {
    return this.request(`/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePet(id: string) {
    return this.request(`/pets/${id}`, {
      method: 'DELETE',
    });
  }

  async addRecord(petId: string, data: any) {
    return this.request(`/pets/${petId}/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRecords(petId: string) {
    return this.request(`/pets/${petId}/records`);
  }

  // Posts
  async getPosts(sort?: 'latest' | 'trending') {
    const query = sort ? `?sort=${sort}` : '';
    return this.request(`/posts${query}`);
  }

  async getPostById(id: string) {
    return this.request(`/posts/${id}`);
  }

  async createPost(data: any) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deletePost(id: string) {
    return this.request(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleLike(postId: string) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async addComment(postId: string, content: string) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.baseUrl}/upload/image`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  // Admin
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAllUsers() {
    return this.request('/admin/users');
  }

  async toggleUserBan(userId: string, isBanned: boolean) {
    return this.request(`/admin/users/${userId}/ban`, {
      method: 'PATCH',
      body: JSON.stringify({ isBanned }),
    });
  }

  async updateUserRole(userId: string, role: string) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async deletePostAsAdmin(postId: string) {
    return this.request(`/admin/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async deleteCommentAsAdmin(commentId: string) {
    return this.request(`/admin/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  async createSpecies(data: any) {
    return this.request('/species', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSpecies(id: string, data: any) {
    return this.request(`/admin/species/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSpecies(id: string) {
    return this.request(`/admin/species/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
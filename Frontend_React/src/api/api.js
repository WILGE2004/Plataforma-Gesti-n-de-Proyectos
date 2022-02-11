import axios from "axios";
import { returnToken } from "../lib/payLoad";

class Api {
  constructor() {
    this.api = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  };

  token() {
    return localStorage.getItem("token");
  };

  payload() {
    return returnToken();
  };

  async apiCall(request) {
    try {
      return (await request()).data;
    } catch (e) {
      return e.response.data;
    };
  };

  async login(data) {
    return await this.apiCall(() => this.api.post("/auth/login", data));
  };

  async signup(data) {
    return await this.apiCall(() => this.api.post("/auth/signup", data, {
      headers: { authorization: `Bearer ${this.token()}` }
    }));
  };

  async searchUsers(email) {
    return await this.apiCall(() => this.api.get(`/api/projects/search/user?name=${email}`, { 
      headers: { authorization: `Bearer ${this.token()}` } }));
  };

  async getUsers() {
    return await this.apiCall(() => this.api.get("/auth/users", {
      headers: { authorization: `Bearer ${this.token()}` }
    }));
  };

  async deleteUser(id, rol) {
    return await this.apiCall(() => this.api.delete(`/auth/users/${id}?rol=${rol}`, {
      headers: { authorization: `Bearer ${this.token()}` },
    }));
  };

  async getProject(id) {
    return await this.apiCall(() => this.api.get(`/api/projects/${id}`, {
      headers: { authorization: `Bearer ${this.token()}` },
    }));
  };

  async getProjects() {
    return await this.apiCall(() => this.api.get(`/api/projects?rol=${this.payload().rol}&id=${this.payload().id}`, {
      headers: { authorization: `Bearer ${this.token()}` },
    }));
  };

  async newProject(data) {
    return await this.apiCall(() => this.api.post("/api/new/project", data, {
      headers: { authorization: `Bearer ${this.token()}` },
    }));
  };

  async deleteProject(id) {
    return await this.apiCall(() => this.api.delete(`/api/projects/${id}`, {
      headers: { authorization: `Bearer ${this.token()}` },
    }));
  };

  async addMember(id, id_user) {
    return await this.apiCall(() => this.api.put(`/api/projects/${id}`, { id_user }, {
      headers: { authorization: `Bearer ${this.token()}` }
    }));
  };

  async newPhase(data) {
    return await this.apiCall(() => this.api.post("/api/new/phase", data, {
      headers: { authorization: `Bearer ${this.token()}` },
    }));
  };

  async newActivity(data) {
    return await this.apiCall(() => this.api.post("/api/new/activitie", data, {
      headers: { authorization: `Bearer ${this.token()}` },
    }));
  };

  async updateActivitie(id_act, data) {
    return await this.apiCall(() => this.api.put(`/api/projects/phase/${id_act}`, data, {
      headers: { authorization: `Bearer ${this.token()}` },
    }));
  };

  async deleteMember(id, id_member) {
    return await this.apiCall(() => this.api.delete(`/api/projects/${id}/${id_member}`, {
      headers: { authorization: `Bearer ${this.token()}` }
    }));
  };
};

const api = new Api();
export default api;
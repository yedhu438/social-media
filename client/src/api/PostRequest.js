import axios from 'axios';

// Set up Axios instance
const API = axios.create({ baseURL: 'http://localhost:5002' });

// Change GET to POST to prevent long URLs from causing a 431 error
export const getTimelinePosts = (id) => API.post(`/post/timeline`, { id });

// Keep PUT request as it is, since it’s sending data in the body
export const likePost = (id, userId) => API.put(`/post/${id}/like_dislike`, { userId });

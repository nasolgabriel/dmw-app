import { Post } from "@/types/post";
import { create, getAll, getOne, remove, update } from "./baseApi";

const ENDPOINT = "/posts";

export const getPosts = () => getAll<Post>(ENDPOINT);
export const getPost = (id: string | number) => getOne<Post>(ENDPOINT, id);
export const createPost = (data: Post) => create<Post>(ENDPOINT, data);
export const updatePost = (id: string | number, data: Partial<Post>) =>
  update<Post>(ENDPOINT, id, data);
export const deletePost = (id: string | number) => remove(ENDPOINT, id);

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as api from './api';
import PostsState from './types/PostsState';
import PostDto from './types/PostDto';

const initialState: PostsState = {
	posts: [],
};

export const loadPosts = createAsyncThunk(
	'posts/loadPosts', // action type - тип действтия

	() => api.getAll() // action payload - полезная нагрузка
	// - то что призходит с бэка
);

export const createPost = createAsyncThunk(
	'posts/createPost',
	(post: PostDto) => api.createPost(post)
);

export const deletePost = createAsyncThunk('posts/deletePost', (id: number) =>
	api.deletePost(id)
);

export const postsSlice = createSlice({
	name: 'posts',
	initialState,
	// редюсеры - это те функции,
	// где не требуется делать ассинхронные запросы на бэк - оставили пустыми
	reducers: {},
	// The `extraReducers` field lets the slice handle actions defined elsewhere,
	// including actions generated by createAsyncThunk or in other slices.
	// экстраредюсеры - работают с асинхронными запросами
	// - например запросы на бэк
	extraReducers: (builder) => {
		builder
			.addCase(loadPosts.fulfilled, (state, action) => {
				state.posts = action.payload.posts;
			})
			.addCase(createPost.fulfilled, (state, action) => {
				state.posts.push(action.payload);
			})
			.addCase(createPost.rejected, (state) => {
				state.error = 'Error: unable to create post';
			})
			.addCase(deletePost.fulfilled, (state, action) => {
				state.posts = state.posts.filter(
					(post) => post.id !== action.payload.id
				);
			});
	},
});

export default postsSlice.reducer;

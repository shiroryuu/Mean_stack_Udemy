import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})

export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postsCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, postsCount: number}>('http://localhost:3000/api/posts'+ queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      }), postsCount: postData.postsCount};
    }))
    .subscribe((transformedPostsData) => {
      this.posts = transformedPostsData.posts;
      this.postUpdated.next({posts: [...this.posts], postsCount: transformedPostsData.postsCount});
    });
  }

  getPost(postId: string){
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(
      'http://localhost:3000/api/posts/' + postId);
  }

  getPostUpdateListner () {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = {id: null, title: title, content: content};
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{message: string, post: Post}>(
      'http://localhost:3000/api/posts',
      postData
      )
    .subscribe((respData) => {
      console.log(respData.message);
      this.router.navigate(['/']);
    });
  }

  deletePost(postID: String){
    return this.http
    .delete('http://localhost:3000/api/posts/' + postID);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image)=="object"){
      postData = new FormData();
      postData.append("id",id);
      postData.append("title",title);
      postData.append("content",content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response =>{
        this.router.navigate(['/']);
      });
  }
}

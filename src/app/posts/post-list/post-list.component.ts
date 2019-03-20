import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
    selector: 'app-post-list',
    templateUrl: 'post-list.component.html',
    styleUrls: ['post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    isLoading = false;
    posts: Post[] = [];
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10];
    private postsSub: Subscription;

    ngOnInit() {
      // this.posts = this.postService.getPosts();
      this.postService.getPosts(this.postsPerPage, this.currentPage);
      this.isLoading = true;
      this.postsSub = this.postService.getPostUpdateListner().
      subscribe((postData: {posts: Post[], postsCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postsCount;
        this.posts = postData.posts;
      });
    }

    onDelete(postId: String) {
      this.postService.deletePost(postId).subscribe(()=>{
        this.isLoading = true;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      });
    }

    onChangedPage(pageData: PageEvent){
      this.isLoading = true;
      this.currentPage = pageData.pageIndex + 1;
      this.postsPerPage = pageData.pageSize;
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    }

    ngOnDestroy() {
      this.postsSub.unsubscribe();
    }

    constructor(public postService: PostsService) {

    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-post-list',
    templateUrl: 'post-list.component.html',
    styleUrls: ['post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    isLoading = false;
    posts: Post[] = [];
    private postsSub: Subscription;

    ngOnInit() {
      // this.posts = this.postService.getPosts();
      this.postService.getPosts();
      this.isLoading = true;
      this.postsSub = this.postService.getPostUpdateListner().
      subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
    }

    onDelete(postId: String) {
      this.postService.deletePost(postId);
    }

    ngOnDestroy() {
      this.postsSub.unsubscribe();
    }

    constructor(public postService: PostsService) {

    }
}

import { Subject } from 'rxjs';
import { Post } from './post.model';

export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  getPosts() {
    return [...this.posts];
  }

  getPostUpdateListner () {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }
}

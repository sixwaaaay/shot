import {User, Video} from "src/api";


export class useWrapStore {

  image_prefix = 'http://localhost:9001/images/';
  video_prefix = 'http://localhost:9001/sharing-test/';

  setWrapImagePrefix(prefix: string) {
    this.image_prefix = prefix;
  }

  setWrapVideoPrefix(prefix: string) {
    this.video_prefix = prefix;
  }

  wrapImagePrefix(users: User[]) {
    console.log("wrapImagePrefix", users);
    users.forEach((user) => {
      //   if url exists and does not start with http then add prefix
      if (user.avatar_url !== undefined && user.avatar_url !== null && !user.avatar_url.startsWith("http"))
        user.avatar_url = this.image_prefix + user.avatar_url;
      if (user.bg_url !== undefined && user.bg_url !== null && !user.bg_url.startsWith("http"))
        user.bg_url = this.image_prefix + user.bg_url;
    });
  }

  wrapVideoPrefix(videos: Video[]) {
    videos.forEach((video) => {
      if (video.video_url !== undefined && video.video_url !== null && !video.video_url.startsWith("http"))
        video.video_url = this.video_prefix + video.video_url;
      if (video.cover_url !== undefined && video.cover_url !== null && !video.cover_url.startsWith("http"))
        video.cover_url = this.image_prefix + video.cover_url;
      if (video?.author) {
        let avatarUrl = video?.author?.avatar_url;
        if (avatarUrl !== undefined && avatarUrl !== null && !avatarUrl.startsWith("http")) {
          video.author.avatar_url = this.image_prefix + avatarUrl;
        }
      }
    });
  }

}

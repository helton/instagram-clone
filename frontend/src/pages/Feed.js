import React, { Component } from 'react';
import io from 'socket.io-client';
import api from '../services/api';

import './Feed.css';
import more from '../assets/more.svg';
import like from '../assets/like.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

class Feed extends Component {
  state = {
    feed: []
  };

  async componentDidMount() {
    this.registerToSocket();
    await this.fetchPosts();
  }

  registerToSocket = () => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on('post', newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on('like', likedPost => {
      this.setState({
        feed: this.state.feed.map(post =>
          post._id === likedPost._id ? likedPost : post
        )
      });
    });
  };

  handleLike = async id => {
    await api.post(`posts/${id}/like`);
  };

  fetchPosts = async () => {
    const response = await api.get('posts');
    this.setState({ feed: response.data });
  };

  render() {
    return (
      <section id="post-list">
        {this.state.feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{post.author}</span>
                <span className="place">{post.place}</span>
              </div>

              <img src={more} alt="More" />
            </header>

            <img
              src={`${process.env.REACT_APP_API_URL}/files/${post.image}`}
              alt=""
            />

            <footer>
              <div className="actions">
                <button type="button" onClick={() => this.handleLike(post._id)}>
                  <img src={like} alt="" />
                </button>
                <img src={comment} alt="" />
                <img src={send} alt="" />
              </div>

              <strong>{`${post.likes} curtida${
                post.likes > 1 ? 's' : ''
              }`}</strong>

              <p>
                {post.description}
                <span>{post.hashtags}</span>
              </p>
            </footer>
          </article>
        ))}
      </section>
    );
  }
}

export default Feed;
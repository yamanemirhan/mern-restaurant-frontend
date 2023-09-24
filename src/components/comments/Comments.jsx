import React, { useState } from "react";
import Pagination from "../pagination/Pagination";
import { AiTwotoneStar } from "react-icons/ai";
import styles from "./comments.module.css";

function Comments({ comments, sortOption }) {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const sortComments = (option) => {
    switch (option) {
      case "newest":
        return comments?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return comments?.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "highest":
        return comments?.sort((a, b) => b.star - a.star);
      case "lowest":
        return comments?.sort((a, b) => a.star - b.star);
      default:
        return comments;
    }
  };

  const sortedComments = sortComments(sortOption);
  const totalPages = Math.ceil(sortedComments?.length / commentsPerPage);

  // Get comments for the current page
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments?.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  // Change page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const starElements = (star) => {
    const maxStars = 5;
    const yellowStars = Math.min(star, maxStars);
    return [...Array(maxStars)].map((_, index) => (
      <AiTwotoneStar
        key={index}
        size={20}
        color={index < yellowStars ? "yellow" : "gray"}
      />
    ));
  };

  return (
    <div className={styles.comments}>
      {currentComments?.length > 0 ? (
        currentComments.map((comment) => (
          <div key={comment._id} className={styles.comment}>
            <div className={styles.commentInfo}>
              <div className={styles.commentUserInfo}>
                <img
                  src="https://avatars.mds.yandex.net/i?id=1ebfe7a31aa4c18301077cfafce6f5bdf44ed3a3-9765845-images-thumbs&n=13"
                  alt="user"
                  className={styles.userImg}
                />

                <p>{comment.user.fullName}</p>
              </div>
              <div className={styles.commentStar}>
                {starElements(comment.star)}
              </div>
              <span className={styles.commentDate}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className={styles.commentText}>{comment.text}</p>
          </div>
        ))
      ) : (
        <p className="no-comments">No comments yet.</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Comments;

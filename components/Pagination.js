const PostPagination = ({ page, setPage, postCount, scrollToTop }) => {
  let totalPages;
  const pageSize = 10;
  const pagination = () => {
    totalPages = Math.ceil(postCount && postCount / pageSize);

    let pages = [];
    let startPage = Math.max(1, page - 1);

    for (let i = startPage; i <= Math.min(startPage + 4, totalPages); i++) {
      pages.push(
        <li onClick={() => scrollToTop()} className="page-item" key={i}>
          <button
            onClick={() => setPage(i)}
            className={`page-link ${page === i && "active"}`}
          >
            {i}
          </button>
        </li>
      );
    }

    return pages;
  };

  return (
    <nav aria-label="Page navigation example" onClick={scrollToTop}>
      <ul className="pagination">
        <li className="page-item">
          <button
            className="page-link"
            // disabled={page === 1}
            onClick={() => setPage(1)}
          >
            Previous
          </button>
        </li>
        {pagination()}
        <li className="page-item">
          <button
            className="page-link"
            // disabled={page === totalPages}
            onClick={() => setPage(Math.min(page + 1, totalPages))}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PostPagination;

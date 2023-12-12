import React from "react";

const RenderPaginationButtons = ({ totalPage, currentPage, setPage }) => {
  const pagesToShow = 2;
  const buttons = [];

  if (totalPage <= 1) {
    return buttons;
  }

  const renderPageButton = (pageNumber) => (
    <div
      key={pageNumber}
      className={`bg-slate-600 cursor-pointer text-slate-100 px-2 py-0.5 rounded-md ${
        pageNumber === currentPage ? "bg-slate-900" : ""
      }`}
      onClick={() => setPage(pageNumber)}
    >
      {pageNumber}
    </div>
  );

  buttons.push(renderPageButton(1));

  if (currentPage - pagesToShow > 2) {
    buttons.push(<div key="start-ellipsis">...</div>);
  }

  for (let i = currentPage - pagesToShow; i <= currentPage + pagesToShow; i++) {
    if (i > 1 && i < totalPage) {
      buttons.push(renderPageButton(i));
    }
  }

  if (currentPage + pagesToShow < totalPage - 1) {
    buttons.push(<div key="end-ellipsis">...</div>);
  }

  buttons.push(renderPageButton(totalPage));

  return buttons;
};

export default RenderPaginationButtons;

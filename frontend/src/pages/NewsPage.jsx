import React, { useEffect, useState, useCallback } from "react";
import { useNewsStore } from "../store/newsStore";
import { FaSyncAlt, FaArrowLeft, FaArrowRight, FaSearch, FaTimes, FaCalendarAlt, FaExternalLinkAlt, FaBookmark, FaShare } from "react-icons/fa";

const pageSizes = [5, 10, 20];

const NewsPage = () => {
  const {
    articles, isLoading, page, pageSize, totalResults, query,
    getNews, refresh, setPage, setPageSize, setQuery
  } = useNewsStore();

  const [localQuery, setLocalQuery] = useState(query || "");
  const [openArticle, setOpenArticle] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);

  useEffect(() => { getNews(); }, []);

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const onSearch = async (e) => {
    e?.preventDefault?.();
    await setQuery(localQuery.trim());
  };

  const clearSearch = async () => {
    setLocalQuery("");
    await setQuery("");
  };

  const openModal = (article) => {
    setOpenArticle(article);
    document.body.style.overflow = "hidden";
  };

  const closeModal = useCallback(() => {
    setIsModalClosing(true);
    setTimeout(() => {
      setOpenArticle(null);
      setIsModalClosing(false);
      document.body.style.overflow = "";
    }, 300);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shareArticle = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url,
      })
      .catch(console.error);
    } else {
      navigator.clipboard.writeText(article.url)
        .then(() => alert('Đã sao chép link vào clipboard!'))
        .catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-24 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tin Tức Mới Nhất
              </h1>
              <p className="text-gray-600 mt-2">Cập nhật thông tin nhanh chóng và chính xác</p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <form onSubmit={onSearch} className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2 transition-all focus-within:border-blue-500 focus-within:shadow-md">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  className="w-full lg:w-80 px-2 py-1 outline-none bg-transparent"
                  placeholder="Tìm kiếm tin tức..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                />
                {localQuery && (
                  <button type="button" onClick={clearSearch} className="text-gray-400 hover:text-gray-600 px-2 transition-colors">
                    <FaTimes />
                  </button>
                )}
              </form>

              <div className="flex gap-3">
                <select
                  value={pageSize}
                  onChange={async (e) => { await setPageSize(Number(e.target.value)); }}
                  className="border border-gray-200 px-3 py-2 rounded-lg bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  title="Số kết quả / trang"
                >
                  {pageSizes.map((ps) => <option key={ps} value={ps}>{ps}/trang</option>)}
                </select>

                <button
                  onClick={refresh}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSyncAlt className={isLoading ? "animate-spin" : ""} /> 
                  {isLoading ? "Đang tải..." : "Làm mới"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading & Empty States */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy tin tức phù hợp</h3>
            <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc làm mới trang</p>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && articles.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, idx) => {
              const title = a.title || `Tin ${idx + 1}`;
              const summary = a.description || a.content || "";
              const image = a.urlToImage || null;
              const published = a.publishedAt ? formatDate(a.publishedAt) : "";
              const source = a.source?.name || a.source || "Nguồn";

              return (
                <article 
                  key={idx} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => openModal(a)}
                >
                  {image && (
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>{published}</span>
                    </div>
                    
                    <h2 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {source}
                      </span>
                      <span className="text-blue-500 text-sm font-medium flex items-center gap-1">
                        Xem chi tiết
                        <FaExternalLinkAlt className="text-xs" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {openArticle && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isModalClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div 
              className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isModalClosing ? 'opacity-0' : 'opacity-100'}`} 
              onClick={closeModal}
            />
            
            <div 
              className={`relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-300 ${isModalClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-gray-900 pr-8">{openArticle.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt className="text-blue-500" />
                        {openArticle.publishedAt ? formatDate(openArticle.publishedAt) : ""}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {openArticle.source?.name || openArticle.source || ""}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={closeModal} 
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                {openArticle.urlToImage && (
                  <div className="p-6 pb-0">
                    <img 
                      src={openArticle.urlToImage} 
                      alt={openArticle.title} 
                      className="w-full h-64 md:h-80 object-cover rounded-xl shadow-sm" 
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {openArticle.content || openArticle.description || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => shareArticle(openArticle)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaShare />
                      Chia sẻ
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                      <FaBookmark />
                      Lưu tin
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {openArticle.url && (
                      <a 
                        href={openArticle.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        <FaExternalLinkAlt />
                        Đọc bài gốc
                      </a>
                    )}
                    <button 
                      onClick={closeModal} 
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(Math.max(1, page - 1))} 
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaArrowLeft /> Trước
              </button>
              <button 
                disabled={page >= totalPages} 
                onClick={() => setPage(Math.min(totalPages, page + 1))} 
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tiếp <FaArrowRight />
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              Trang <strong className="text-blue-600">{page}</strong> / {totalPages} — 
              <span className="font-medium ml-1">{totalResults} kết quả</span>
            </div>
            
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="text-sm text-gray-600">Hiển thị:</span>
              <select
                value={pageSize}
                onChange={async (e) => { await setPageSize(Number(e.target.value)); }}
                className="border border-gray-300 px-3 py-1 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {pageSizes.map((ps) => <option key={ps} value={ps}>{ps}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
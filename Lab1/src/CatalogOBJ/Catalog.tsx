import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Catalog.css";

interface CatalogItem {
  id: number;
  title: string;
  image: string;
  year: number;
  rating: number;
}

const POSTERS = {
  fate:    "https://img.cdngos.com/anime/69/694b18d8d8f1c698014324",
  prigovor: "https://img.cdngos.com/anime/69/694b1b1b30047817089986",
};

const DEMO: CatalogItem[] = [
  { id: 1,  title: "Приговорённый быть героем", image: POSTERS.prigovor, year: 2026, rating: 8.5 },
  { id: 2,  title: "Fate: Strange Fake",        image: POSTERS.fate,     year: 2023, rating: 8.2 },
  { id: 3,  title: "Демо Сериал 3",             image: POSTERS.fate,     year: 2023, rating: 7.9 },
  { id: 4,  title: "Демо Сериал 4",             image: POSTERS.prigovor, year: 2022, rating: 7.5 },
  { id: 5,  title: "Демо Сериал 5",             image: POSTERS.fate,     year: 2023, rating: 8.9 },
  { id: 6,  title: "Демо Сериал 6",             image: POSTERS.prigovor, year: 2022, rating: 8.1 },
  { id: 7,  title: "Демо Сериал 7",             image: POSTERS.fate,     year: 2021, rating: 7.6 },
  { id: 8,  title: "Демо Сериал 8",             image: POSTERS.prigovor, year: 2021, rating: 8.3 },
  { id: 9,  title: "Демо Сериал 9",             image: POSTERS.fate,     year: 2022, rating: 8.4 },
  { id: 10, title: "Демо Сериал 10",            image: POSTERS.prigovor, year: 2021, rating: 8.7 },
  { id: 11, title: "Демо Сериал 11",            image: POSTERS.fate,     year: 2022, rating: 7.8 },
  { id: 12, title: "Демо Сериал 12",            image: POSTERS.prigovor, year: 2023, rating: 9.0 },
];

const ITEMS_PER_PAGE = 12;

const YEARS = [...new Set(DEMO.map(i => i.year))].sort((a, b) => b - a);

export function Catalog() {
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy,       setSortBy]       = useState("default");
  const [currentPage,  setCurrentPage]  = useState(1);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = useMemo(() => {
    let list = [...DEMO];

    if (selectedYear) {
      list = list.filter(i => i.year.toString() === selectedYear);
    }

    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "year")  list.sort((a, b) => b.year - a.year);
    else if (sortBy === "title") list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [selectedYear, sortBy]);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [selectedYear, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleReset = () => {
    setSelectedYear("");
    setSortBy("default");
  };

  return (
    <div className="catalog-page">
      <div className="catalog-layout">

        {/* ── Sidebar ── */}
        <aside className="catalog-sidebar">
          <p className="sidebar-title">Фильтры</p>

          <div className="filter-block">
            <p className="filter-label">Год</p>
            <select
              className="filter-select"
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
            >
              <option value="">Все годы</option>
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="filter-block">
            <p className="filter-label">Сортировка</p>
            <select
              className="filter-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="default">По умолчанию</option>
              <option value="title">По названию</option>
              <option value="rating">По рейтингу</option>
              <option value="year">По году</option>
            </select>
          </div>

          <button className="reset-btn" onClick={handleReset}>
            Сбросить
          </button>
        </aside>

        {/* ── Main ── */}
        <div className="catalog-main">
          <div className="catalog-header">
            <h1 className="catalog-title">Каталог</h1>
            <span className="catalog-count">{filtered.length} тайтлов</span>
          </div>

          <div className="catalog-grid">
            {pageItems.length === 0 ? (
              <p className="catalog-empty">Ничего не найдено</p>
            ) : (
              pageItems.map(item => (
                <div
                  key={item.id}
                  className="anime-card"
                  onClick={() => navigate(`/catalog/${item.id}`)}
                >
                  <img
                    className="anime-card-img"
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />
                  <div className="anime-card-body">
                    <p className="anime-card-title">{item.title}</p>
                    <div className="anime-card-year"><span>{item.year}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="catalog-pagination">
              <button
                className="page-btn page-arrow"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${page === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="page-btn page-arrow"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

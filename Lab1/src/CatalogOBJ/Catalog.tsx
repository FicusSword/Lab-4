import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import KodikPlayer from "../KodikPlayer/KodikPlayer";
import "./Catalog.css";

interface CatalogItem {
  id: number;
  title: string;
  image: string;
  year: number;
  rating: number;
}

export function Catalog() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CatalogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const navigate = useNavigate();

  const itemsPerPage = 6;

  // Демо данные - потом будут браться из API
  const demoItems: CatalogItem[] = [
    {
      id: 1,
      title: "Демо Сериал 1",
      image: "https://img.cdngos.com/anime/69/694b18d8d8f1c698014324",
      year: 2023,
      rating: 8.5,
    },
    {
      id: 2,
      title: "Демо Сериал 2",
      image: "https://via.placeholder.com/300x400?text=Demo+2",
      year: 2022,
      rating: 7.8,
    },
    {
      id: 3,
      title: "Демо Сериал 3",
      image: "https://via.placeholder.com/300x400?text=Demo+3",
      year: 2023,
      rating: 8.2,
    },
    {
      id: 4,
      title: "Демо Сериал 4",
      image: "https://via.placeholder.com/300x400?text=Demo+4",
      year: 2021,
      rating: 7.5,
    },
    {
      id: 5,
      title: "Демо Сериал 5",
      image: "https://via.placeholder.com/300x400?text=Demo+5",
      year: 2023,
      rating: 8.9,
    },
    {
      id: 6,
      title: "Демо Сериал 6",
      image: "https://via.placeholder.com/300x400?text=Demo+6",
      year: 2022,
      rating: 8.1,
    },
    {
      id: 7,
      title: "Демо Сериал 7",
      image: "https://via.placeholder.com/300x400?text=Demo+7",
      year: 2023,
      rating: 7.6,
    },
    {
      id: 8,
      title: "Демо Сериал 8",
      image: "https://via.placeholder.com/300x400?text=Demo+8",
      year: 2022,
      rating: 8.3,
    },
  ];

  useEffect(() => {
    setItems(demoItems);
    applyFilters(demoItems);
  }, []);

  const applyFilters = (itemsToFilter: CatalogItem[]) => {
    let filtered = [...itemsToFilter];

    // Фильтр по году
    if (selectedYear) {
      filtered = filtered.filter((item) => item.year.toString() === selectedYear);
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "year":
          return b.year - a.year;
        case "title":
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredItems(filtered);
    setCurrentPage(1); // Сброс на первую страницу при изменении фильтров
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "year") {
      setSelectedYear(value);
    } else if (filterType === "sort") {
      setSortBy(value);
    }
  };

  // Пагинация
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  return (
    <Container fluid className="catalog-container my-5">
      <Row className="g-4">
        {/* Основной контент */}
        <Col lg={9}>
          <h2 className="mb-4">Каталог</h2>

          {/* Карточки */}
          <Row className="g-3">
            {currentItems.map((item) => (
              <Col key={item.id} md={6} lg={4} className="mb-4">
                <Card
                  className="catalog-card"
                  onClick={() => navigate(`/catalog/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img variant="top" src={item.image} alt={item.title} />
                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <div className="card-meta">
                      <span className="year">{item.year}</span>
                      <span className="rating">⭐ {item.rating}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>


          {/* Пагинация */}
          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  >
                    ← Предыдущая
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  >
                    Следующая →
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </Col>

        {/* Фильтр справа */}
        <Col lg={3}>
          <Card className="filter-card">
            <Card.Body>
              <h5>Фильтры</h5>

              {/* Фильтр по году */}
              <Form.Group className="mb-4">
                <Form.Label>Год выпуска</Form.Label>
                <Form.Select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    handleFilterChange("year", e.target.value);
                    applyFilters(items);
                  }}
                >
                  <option value="">Все годы</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </Form.Select>
              </Form.Group>

              {/* Сортировка */}
              <Form.Group className="mb-4">
                <Form.Label>Сортировка</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    handleFilterChange("sort", e.target.value);
                    applyFilters(items);
                  }}
                >
                  <option value="title">По названию (A-Z)</option>
                  <option value="rating">По рейтингу (высокий)</option>
                  <option value="year">По году (новые)</option>
                </Form.Select>
              </Form.Group>

              {/* Кнопка сброса */}
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={() => {
                  setSelectedYear("");
                  setSortBy("title");
                  setCurrentPage(1);
                  applyFilters(items);
                }}
              >
                Сбросить фильтры
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

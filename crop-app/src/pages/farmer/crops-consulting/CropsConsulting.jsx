import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CropConsultingHeader from './CropConsultingHeader';
import { CropCard } from './CropCards/CropCard';
import { CropPopup } from './CropCards/CropPopup';
import searchIcon from './icons/Search-icon.png';
import sortIcon from './icons/Sort-icon.png';
import pageArrowLeft from './icons/Page-arrow-left.png';
import pageArrowRight from './icons/Page-arrow-right.png';
import './CropsConsulting.css';

const SEASON_MONTH_INDICES = {
  Spring: [2, 3, 4],
  Summer: [5, 6, 7],
  Autumn: [8, 9, 10],
  Winter: [11, 0, 1]
};

const parseMonthToIndex = (val) => {
  if (val === undefined || val === null) return -1;
  const clean = String(val).trim().toLowerCase();
  if (!clean) return -1;
  const num = parseInt(clean, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return num - 1;
  }
  if (clean.startsWith('jan')) return 0;
  if (clean.startsWith('feb')) return 1;
  if (clean.startsWith('mar')) return 2;
  if (clean.startsWith('apr')) return 3;
  if (clean.startsWith('may')) return 4;
  if (clean.startsWith('jun')) return 5;
  if (clean.startsWith('jul')) return 6;
  if (clean.startsWith('aug')) return 7;
  if (clean.startsWith('sep')) return 8;
  if (clean.startsWith('oct')) return 9;
  if (clean.startsWith('nov')) return 10;
  if (clean.startsWith('dec')) return 11;
  return -1;
};

const isMonthInRange = (monthIdx, startIdx, endIdx) => {
  if (startIdx === -1 || endIdx === -1) return false;
  if (startIdx <= endIdx) {
    return monthIdx >= startIdx && monthIdx <= endIdx;
  } else {
    return monthIdx >= startIdx || monthIdx <= endIdx;
  }
};

export default function CropsConsulting() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://torbati.onrender.com/api/farmer/crops/', {
          headers: { Authorization: `Token ${token}` }
        });

        const cropsList = response.data.crops || response.data.crop;
        if (cropsList && cropsList.length > 0) {
          setCrops(cropsList);
        } else {
          console.warn("API responded with empty data array.");
          setCrops([]);
        }
      } catch (error) {
        console.error("API endpoint link failure:", error);
        setCrops([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSeason, sortBy]);

  const isCropInSeason = (crop, season) => {
    if (season === "All") return true;
    const targetIndices = SEASON_MONTH_INDICES[season] || [];
    const startIdx = parseMonthToIndex(crop.sowing_month_start);
    const endIdx = parseMonthToIndex(crop.sowing_month_end);
    if (startIdx === -1 && endIdx === -1) return false;
    if (startIdx !== -1 && endIdx === -1) {
      return targetIndices.includes(startIdx);
    }
    if (startIdx === -1 && endIdx !== -1) {
      return targetIndices.includes(endIdx);
    }
    return targetIndices.some(mIdx => isMonthInRange(mIdx, startIdx, endIdx));
  };

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.crop_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason = isCropInSeason(crop, selectedSeason);
    return matchesSearch && matchesSeason;
  });

  const sortedCrops = [...filteredCrops].sort((a, b) => {
    if (sortBy === "name-asc") {
      return (a.crop_name || "").localeCompare(b.crop_name || "");
    }
    if (sortBy === "name-desc") {
      return (b.crop_name || "").localeCompare(a.crop_name || "");
    }
    if (sortBy === "duration-asc") {
      return (a.duration_days || 0) - (b.duration_days || 0);
    }
    if (sortBy === "duration-desc") {
      return (b.duration_days || 0) - (a.duration_days || 0);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedCrops.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentPageCrops = sortedCrops.slice(indexOfFirstItem, indexOfLastItem);

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (totalPages <= 1) return [1];

    pages.push(1);

    if (startPage > 2) {
      pages.push('...left');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...right');
    }

    pages.push(totalPages);

    return pages;
  };

  const handleNextGridPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevGridPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <div className="crops-page-container">
        <CropConsultingHeader />
        <div className="loading-screen">
          <div className="catalog-spinner"></div>
          <p>Gathering crop database registries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crops-page-container">
      <CropConsultingHeader />

      <main className="crops-content-layout">

        <section className="catalog-filters-bar">
          <div className="search-bar-inner">
            <input
              type="text"
              className="search-input-box"
              placeholder="Search for a crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src={searchIcon} alt="" className="search-icon-img" />
          </div>

          <div className="season-filter-section">
            <span className="season-label">Season:</span>
            <div className="season-pills-group">
              {['All', 'Spring', 'Summer', 'Autumn', 'Winter'].map((season) => (
                <button
                  key={season}
                  className={`season-pill-btn ${selectedSeason === season ? 'active' : ''}`}
                  onClick={() => setSelectedSeason(season)}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          <div className="sort-filter-section">
            <img src={sortIcon} alt="" className="sort-icon-img" />
            <select
              className="sort-dropdown-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="duration-asc">Duration: Low to High</option>
              <option value="duration-desc">Duration: High to Low</option>
            </select>
          </div>
        </section>

        {currentPageCrops.length > 0 ? (
          <div className="crops-grid-viewport">
            {currentPageCrops.map((item) => (
              <CropCard
                key={item.id}
                crop={item}
                onViewClick={() => {
                  setSelectedCrop(item);
                  setIsPopupOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="no-crops-found-box">
            <p>No crops match your selected filters. Try searching for another crop.</p>
          </div>
        )}

        {totalPages > 1 && (
          <footer className="grid-pagination-controls">
            <button
              className={`grid-page-arrow ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={handlePrevGridPage}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              <img src={pageArrowLeft} alt="Previous" className="page-arrow-icon" />
            </button>

            <div className="grid-page-numbers">
              {getPageNumbers().map((pageItem, index) => {
                if (pageItem === '...left' || pageItem === '...right') {
                  return (
                    <span key={`dots-${index}`} className="grid-page-dots">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={`page-${pageItem}`}
                    className={`grid-page-btn ${currentPage === pageItem ? 'active-page' : ''}`}
                    onClick={() => setCurrentPage(pageItem)}
                  >
                    {pageItem}
                  </button>
                );
              })}
            </div>

            <button
              className={`grid-page-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={handleNextGridPage}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              <img src={pageArrowRight} alt="Next" className="page-arrow-icon" />
            </button>
          </footer>
        )}
      </main>

      {isPopupOpen && (
        <CropPopup crop={selectedCrop} onClose={() => setIsPopupOpen(false)} />
      )}
    </div>
  );
}
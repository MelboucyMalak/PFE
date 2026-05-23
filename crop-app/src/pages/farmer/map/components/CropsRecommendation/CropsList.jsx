import { useState } from "react"
import { CropItem } from './CropItem/CropItem'
import search from '@/assets/images/search.png'
import filter from "@/assets/images/filter.png"
import styles from "./CropsList.module.css"

const RECOMMENDED_CROPS = [
  { name: "Wheat", cropMonths: "Oct-Nov", durationDays: "140", rating: "92" },
  { name: "Beetroot", cropMonths: "Sep-Oct", durationDays: "90", rating: "85" },
  { name: "Peas", cropMonths: "Oct-Nov", durationDays: "120", rating: "78" },
  { name: "Cabbage", cropMonths: "Sep-Oct", durationDays: "120", rating: "70" },
  { name: "Tomato", cropMonths: "Feb-Mar", durationDays: "140", rating: "48" },
  { name: "Maize", cropMonths: "Mar-Apr", durationDays: "100", rating: "35" }
]

export function CropsList({ handleCropChoice, setCropContext, cropsList, loading }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchBarOpen, setSearchBarOpen] = useState(false)
  const [sortBy, setSortBy] = useState("score-desc") // score-desc, score-asc, alpha-asc, alpha-desc
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  const toggleSearch = () => {
    setSearchBarOpen(!searchBarOpen)
    setFilterPanelOpen(false)
  }

  const toggleFilter = () => {
    setFilterPanelOpen(!filterPanelOpen)
    setSearchBarOpen(false)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const formattedCrops = Array.isArray(cropsList) ? cropsList.map(item => {
    if (!item) return null;
    const c = item.crop || item || {};
    const name = c.crop_name || c.name || "Unknown Crop";
    
    // Sowing months translation
    let cropMonths = "N/A";
    if (c.sowing_month_start && c.sowing_month_end) {
      cropMonths = `${c.sowing_month_start}-${c.sowing_month_end}`;
    } else if (c.sowing_month_start || c.sowing_month_end) {
      cropMonths = c.sowing_month_start || c.sowing_month_end;
    }

    const durationDays = String(c.duration_days || c.duration || "N/A");
    
    // Map score safely
    const ratingNum = item.compatibility_score !== undefined ? item.compatibility_score : (item.score !== undefined ? item.score : (item.compatibility !== undefined ? item.compatibility : (item.rating !== undefined ? item.rating : 80)));
    const rating = String(Math.round(ratingNum));

    return {
      id: item.id || c.id,
      name,
      cropMonths,
      durationDays,
      rating,
      rawItem: item
    };
  }).filter(Boolean) : [];

  const filteredCrops = formattedCrops.filter(crop => 
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === "alpha-asc") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "alpha-desc") {
      return b.name.localeCompare(a.name)
    } else if (sortBy === "score-desc") {
      return Number(b.rating) - Number(a.rating)
    } else if (sortBy === "score-asc") {
      return Number(a.rating) - Number(b.rating)
    }
    return 0
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.stickyHeader}>
        <nav className={styles.cropsListNav}>
          <p className={styles.cropsListTitle}>Recommended Crops</p>
          <div className={styles.toolbar}>
            <button 
              className={`${styles.toolbarBtn} ${searchBarOpen ? styles.activeToolbarBtn : ""}`}
              onClick={toggleSearch}
              title="Search Crops"
            >
              <img src={search} alt="search" />
            </button>
            <button 
              className={`${styles.toolbarBtn} ${filterPanelOpen ? styles.activeToolbarBtn : ""}`}
              onClick={toggleFilter}
              title="Filter & Sort"
            >
              <img src={filter} alt="filter" />
            </button>
          </div>
        </nav>

        {searchBarOpen && (
          <div className={styles.searchBarContainer}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search crop name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button className={styles.clearSearchBtn} onClick={handleClearSearch}>
                &times;
              </button>
            )}
          </div>
        )}

        {filterPanelOpen && (
          <div className={styles.filterPanelContainer}>
            <p className={styles.filterSectionTitle}>Sort & Filter Crops</p>
            <div className={styles.filterOptionsGrid}>
              <div className={styles.filterOptionGroup}>
                <p className={styles.filterGroupLabel}>Compatibility Score</p>
                <div className={styles.filterChips}>
                  <button 
                    className={`${styles.filterChip} ${sortBy === "score-desc" ? styles.activeChip : ""}`}
                    onClick={() => setSortBy("score-desc")}
                  >
                    Highest First
                  </button>
                  <button 
                    className={`${styles.filterChip} ${sortBy === "score-asc" ? styles.activeChip : ""}`}
                    onClick={() => setSortBy("score-asc")}
                  >
                    Lowest First
                  </button>
                </div>
              </div>
              
              <div className={styles.filterOptionGroup}>
                <p className={styles.filterGroupLabel}>Alphabetical</p>
                <div className={styles.filterChips}>
                  <button 
                    className={`${styles.filterChip} ${sortBy === "alpha-asc" ? styles.activeChip : ""}`}
                    onClick={() => setSortBy("alpha-asc")}
                  >
                    A to Z
                  </button>
                  <button 
                    className={`${styles.filterChip} ${sortBy === "alpha-desc" ? styles.activeChip : ""}`}
                    onClick={() => setSortBy("alpha-desc")}
                  >
                    Z to A
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cropsList}>
        <div className={styles.listBck}></div>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>Fetching recommended crops...</p>
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className={styles.zeroState}>
            <p className={styles.zeroStateTitle}>No Crops Found</p>
            <p className={styles.zeroStateText}>Try searching for a different crop name.</p>
          </div>
        ) : (
          filteredCrops.map(crop => (
            <CropItem 
              key={crop.name}
              id={crop.id}
              name={crop.name} 
              cropMonths={crop.cropMonths} 
              durationDays={crop.durationDays} 
              rating={crop.rating} 
              rawItem={crop.rawItem}
              handleCropChoice={handleCropChoice} 
              setCropContext={setCropContext} 
            />
          ))
        )}
      </div>
    </div>
  )
}
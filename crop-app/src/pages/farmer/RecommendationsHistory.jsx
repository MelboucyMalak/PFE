import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./RecommendationsHistory.module.css";
import { CropItem } from "./map/components/CropsRecommendation/CropItem/CropItem";
import { CropCard } from "./map/components/Cards/CropCard/CropCard";
import { FinalResult } from "./map/components/Cards/fieldAnalysisCards/FinalResult/FinalResult";

// Icons from ReccomendationHistory
import historyHeaderIcon from "./ReccomendationHistory/Images/History-header-icon.png";
import locationIcon from "./ReccomendationHistory/Images/Location-icon.png";
import locationIconHover from "./ReccomendationHistory/Images/Location-icon-hover.png";
import dateIcon from "./ReccomendationHistory/Images/Date-icon.png";
import dateIconHover from "./ReccomendationHistory/Images/Date-icon-hover.png";
import latLongIcon from "./ReccomendationHistory/Images/Lat-long-icon.png";
import latLongIconHover from "./ReccomendationHistory/Images/Lat-long-icon-hover.png";
import rightArrowIcon from "./ReccomendationHistory/Images/Right-arrow.png";
import rightArrowIconHover from "./ReccomendationHistory/Images/Right-arrow-hover.png";
import leftArrowIcon from "./ReccomendationHistory/Images/Left-arrow.png";
import leftArrowIconHover from "./ReccomendationHistory/Images/Left-arrow-hover.png";
import whiteFullStar from "./ReccomendationHistory/Images/White-full-star.png";
import yellowFullStar from "./ReccomendationHistory/Images/Yellow-full-star.png";
import yellowHollowStar from "./ReccomendationHistory/Images/Yellow-hollow-star.png";

// General search/filter icons
import searchIcon from "@/assets/images/search.png";
import filterIcon from "@/assets/images/filter.png";

// Popup modal icons
import popupCalendarIcon from "./ReccomendationHistory/Images/boxicons_calendar-filled.png";
import popupPHIcon from "./ReccomendationHistory/Images/Ph-Icon.png";
import popupTextureIcon from "./ReccomendationHistory/Images/Texture-icon.png";
import popupNIcon from "./ReccomendationHistory/Images/N-icon.png";
import popupPIcon from "./ReccomendationHistory/Images/P-icon.png";
import popupKIcon from "./ReccomendationHistory/Images/K-icon.png";
import popupCompassIcon from "./ReccomendationHistory/Images/mdi_compass.png";
import popupAngleIcon from "./ReccomendationHistory/Images/tabler_angle.png";
import popupTempIcon from "./ReccomendationHistory/Images/carbon_temperature-celsius.png";
import popupRainIcon from "./ReccomendationHistory/Images/solar_cloud-rain-bold.png";
import popupEarthIcon from "./ReccomendationHistory/Images/teenyicons_globe-africa-solid.png";
import popupHumidityIcon from "./ReccomendationHistory/Images/material-symbols_humidity-percentage-rounded.png";

export default function RecommendationsHistory() {
  const navigate = useNavigate();

  // Navigation / View State
  const [view, setView] = useState("sessions"); // "sessions" (View 1) | "details" (View 2)
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility (View 3 & 4)

  // Loading States
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [loadingFertHistory, setLoadingFertHistory] = useState(false);

  // Data States
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [cropsList, setCropsList] = useState([]);
  const [fieldAnalyses, setFieldAnalyses] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [fertContext, setFertContext] = useState({
    N: { nutrient: "Nitrogen", score: 50, available: 40, need: 80, deficit: 40 },
    P: { nutrient: "Phosphorus", score: 12.5, available: 5, need: 40, deficit: 35 },
    K: { nutrient: "Potassium", score: 100, available: 65, need: 60, deficit: 0 }
  });

  // Modal Sub-States
  const [modalPage, setModalPage] = useState(1); // 1 (Agronomic/Session stats) | 2 (Timeline generic/personalized)
  const [modalActiveSubTab, setModalActiveSubTab] = useState("agronomic"); // "agronomic" (Soil/NPK) | "session" (General/Climate)
  const [genericHistory, setGenericHistory] = useState([]);
  const [personalizedHistory, setPersonalizedHistory] = useState([]);
  const [isPersonalizedOpen, setIsPersonalizedOpen] = useState(false);

  // Filtering & Sorting (Sessions list - View 1)
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [dateSortOrder, setDateSortOrder] = useState("desc"); // "desc" | "asc"

  // Search & Filter (Crops list - View 2)
  const [cropSearchQuery, setCropSearchQuery] = useState("");
  const [cropSearchOpen, setCropSearchOpen] = useState(false);
  const [cropFilterOpen, setCropFilterOpen] = useState(false);
  const [cropSortBy, setCropSortBy] = useState("score-desc"); // "score-desc" | "score-asc" | "alpha-asc" | "alpha-desc"

  // Date Formatting helper: e.g. "April 7th , 14:32 pm"
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[date.getMonth()];
    const day = date.getDate();

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month} ${day}${suffix} , ${hours}:${minutes} ${ampm}`;
  };

  // Coordinate Formatting helper: e.g. "Lat:36.1234°N, Long:5.4321°E"
  const formatCoordinates = (lat, lon) => {
    if (lat === undefined || lon === undefined) return "";
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `Lat:${Math.abs(lat).toFixed(4)}°${latDir}, Long:${Math.abs(lon).toFixed(4)}°${lonDir}`;
  };

  // Dynamic Crop Compatibility display values
  const getScoreDisplay = (score) => {
    if (score >= 90) return { rank: 1, color: 'P', compatibility: 'Perfect' };
    if (score >= 75) return { rank: 2, color: 'EH', compatibility: 'Extremely High' };
    if (score >= 60) return { rank: 3, color: 'H', compatibility: 'High' };
    if (score >= 45) return { rank: 4, color: 'G', compatibility: 'Good' };
    return { rank: 5, color: 'L', compatibility: 'Low' };
  };

  // 1. Fetch Previous Sessions
  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const headers = { Authorization: `Token ${token}` };
      const response = await axios.get("https://torbati.onrender.com/api/history", { headers });

      const list = response.data?.recommendations || response.data || [];
      setSessions(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error loading history sessions:", err.response?.data || err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoadingSessions(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // 2. Toggle Favorite Session
  const handleToggleFavorite = async (session, e) => {
    e.stopPropagation(); // Prevent opening the session details
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Token ${token}` } : {};
      const nextFavoriteState = !session.favorite;
      const payload = {
        session_id: session.id,
        favorite: nextFavoriteState
      };

      const response = await axios.patch("https://torbati.onrender.com/api/recommendation/favorite", payload, { headers });
      if (response.status === 200) {
        // Update local state
        setSessions(prev => prev.map(s => s.id === session.id ? { ...s, favorite: nextFavoriteState } : s));
        if (selectedSession && selectedSession.id === session.id) {
          setSelectedSession(prev => ({ ...prev, favorite: nextFavoriteState }));
        }
      }
    } catch (err) {
      console.error("Error toggling favorite state:", err.response?.data || err);
    }
  };

  // 3. Fetch session crops and field analyses
  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    setSelectedCrop(null);
    setModalPage(1);
    setModalActiveSubTab("session");
    setIsModalOpen(true);
    setCropSearchQuery("");
    setCropSearchOpen(false);
    setCropFilterOpen(false);
    setLoadingCrops(true);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Token ${token}` } : {};

      // A. Fetch crops list
      let cropsResponse;
      try {
        cropsResponse = await axios.post(
          "https://torbati.onrender.com/api/crop-recommendation",
          { session_id: session.id },
          { headers }
        );
      } catch (e) {
        cropsResponse = await axios.get("https://torbati.onrender.com/api/crop-recommendation", {
          params: { session_id: session.id },
          headers
        });
      }

      const listData = cropsResponse.data;
      const rawCrops = listData["Crop List"] || listData.crop_list || listData.cropList || listData.recommendations || listData.crop_recommendations || listData;
      setCropsList(Array.isArray(rawCrops) ? rawCrops : []);

      // B. Fetch all field analyses to match
      const faResponse = await axios.get("https://torbati.onrender.com/api/field/analysis/", { headers });
      setFieldAnalyses(Array.isArray(faResponse.data) ? faResponse.data : []);

    } catch (err) {
      console.error("Error fetching session crops or analysis:", err.response?.data || err);
    } finally {
      setLoadingCrops(false);
    }
  };

  // 4. Open crop details modal and fetch fertilization timelines (Page 2)
  const handleSelectCrop = async (cropChoice) => {
    setSelectedCrop(cropChoice);
    setModalPage(1);
    setModalActiveSubTab("agronomic");
    setGenericHistory([]);
    setPersonalizedHistory([]);
    setIsModalOpen(true);

    // Fetch Generic Fertilization specs
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Token ${token}` } : {};
      const fertResponse = await axios.post("https://torbati.onrender.com/api/field/fertilization/generic/", {
        crop_recommendation: cropChoice.id
      }, { headers });

      if (fertResponse.data) {
        const data = fertResponse.data;
        const available = data.available_in_soil_kg_ha || {};
        const needs = data.crop_needs_kg_ha || {};
        const deficits = data.deficit_to_add_kg_ha || {};
        const coverage = data.soil_coverage_percent || {};

        setFertContext({
          N: {
            nutrient: "Nitrogen",
            score: coverage.N !== undefined ? Math.round(coverage.N) : 50,
            available: available.N !== undefined ? Math.round(available.N) : 40,
            need: needs.N !== undefined ? Math.round(needs.N) : 80,
            deficit: deficits.N !== undefined ? Math.round(deficits.N) : 40
          },
          P: {
            nutrient: "Phosphorus",
            score: coverage.P !== undefined ? Math.round(coverage.P) : 12.5,
            available: available.P !== undefined ? Math.round(available.P) : 5,
            need: needs.P !== undefined ? Math.round(needs.P) : 40,
            deficit: deficits.P !== undefined ? Math.round(deficits.P) : 35
          },
          K: {
            nutrient: "Potassium",
            score: coverage.K !== undefined ? Math.round(coverage.K) : 100,
            available: available.K !== undefined ? Math.round(available.K) : 65,
            need: needs.K !== undefined ? Math.round(needs.K) : 60,
            deficit: deficits.K !== undefined ? Math.round(deficits.K) : 0
          }
        });
      }
    } catch (e) {
      console.warn("Failed to fetch generic fertilization for selected crop:", e);
      setFertContext({
        N: { nutrient: "Nitrogen", score: 50, available: 40, need: 80, deficit: 40 },
        P: { nutrient: "Phosphorus", score: 12.5, available: 5, need: 40, deficit: 35 },
        K: { nutrient: "Potassium", score: 100, available: 65, need: 60, deficit: 0 }
      });
    }

    // Fetch fresh field analyses in background to avoid stale/out-of-sync state
    let currentAnalyses = fieldAnalyses;
    console.log("[DIAGNOSTIC] handleSelectCrop invoked for crop:", cropChoice.name, "Choice ID:", cropChoice.id);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Token ${token}` } : {};
      const faResponse = await axios.get("https://torbati.onrender.com/api/field/analysis/", { headers });
      if (Array.isArray(faResponse.data)) {
        currentAnalyses = faResponse.data;
        setFieldAnalyses(currentAnalyses);
        console.log("[DIAGNOSTIC] Successfully fetched fresh field analyses. Count:", currentAnalyses.length);
      }
    } catch (err) {
      console.warn("[DIAGNOSTIC] Failed to fetch fresh field analyses inside handleSelectCrop:", err);
    }

    // Prioritize matching by recommendation session crop ID first, searching newest first (to handle multiple personalizations correctly)
    const matchingAnalysis = [...currentAnalyses].reverse().find(fa => {
      const rawRecId = fa.crop_recommendation?.id !== undefined ? fa.crop_recommendation.id : fa.crop_recommendation;
      const faCropRecId = String(rawRecId || "");
      const choiceId = String(cropChoice.id || "");
      const isMatch = faCropRecId && choiceId && faCropRecId === choiceId;
      console.log(`[DIAGNOSTIC] Rule 1 Match Check: fa.id=${fa.id}, fa.crop_recommendation=${faCropRecId}, choiceId=${choiceId} -> Match: ${isMatch}`);
      return isMatch;
    }) || [...currentAnalyses].reverse().find(fa => {
      const rawRecId = fa.crop_recommendation?.id !== undefined ? fa.crop_recommendation.id : fa.crop_recommendation;
      const faCropRecId = String(rawRecId || "");
      const choiceCropId = String(cropChoice.rawItem?.crop?.id || cropChoice.rawItem?.id || "");
      const isMatch = faCropRecId && choiceCropId && faCropRecId === choiceCropId;
      console.log(`[DIAGNOSTIC] Rule 2 Match Check: fa.id=${fa.id}, fa.crop_recommendation=${faCropRecId}, choiceCropId=${choiceCropId} -> Match: ${isMatch}`);
      return isMatch;
    }) || [...currentAnalyses].reverse().find(fa => {
      const cropName = String(fa.crop?.crop_name || fa.crop?.name || fa.crop || "").toLowerCase().trim();
      const choiceName = String(cropChoice.name || "").toLowerCase().trim();
      const isMatch = cropName && choiceName && cropName === choiceName;
      console.log(`[DIAGNOSTIC] Rule 3 Match Check: fa.id=${fa.id}, fa.cropName=${cropName}, choiceName=${choiceName} -> Match: ${isMatch}`);
      return isMatch;
    });

    console.log("[DIAGNOSTIC] Matched field analysis:", matchingAnalysis);

    if (matchingAnalysis) {
      const faId = matchingAnalysis.id;
      setLoadingFertHistory(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Token ${token}` } : {};

        // Fetch Generic Fertilization History
        console.log("[DIAGNOSTIC] Fetching generic fertilization history for faId:", faId);
        const genRes = await axios.get(`https://torbati.onrender.com/api/field/fertilization/generic/history/${faId}/`, { headers });
        const genList = Array.isArray(genRes.data) ? genRes.data : [];
        genList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setGenericHistory(genList);
        console.log("[DIAGNOSTIC] Fetched generic history count:", genList.length);

        // Fetch Personalized Fertilization History
        console.log("[DIAGNOSTIC] Fetching personalized fertilization history for faId:", faId);
        const persRes = await axios.get(`https://torbati.onrender.com/api/field/fertilization/personalized/history/${faId}/`, { headers });
        const persList = Array.isArray(persRes.data) ? persRes.data : [];
        persList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setPersonalizedHistory(persList);
        console.log("[DIAGNOSTIC] Fetched personalized history count:", persList.length, "Data:", persList);

      } catch (err) {
        console.warn("[DIAGNOSTIC] Failed to fetch fertilization timeline history:", err.response?.data || err);
      } finally {
        setLoadingFertHistory(false);
      }
    } else {
      console.log("[DIAGNOSTIC] No matching field analysis found for selected crop. Timeline histories remain empty.");
    }
  };

  // Filter and Sort Sessions (View 1)
  const filteredSessions = sessions
    .filter(s => !favoritesOnly || s.favorite)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  // Format crop cards safely (View 2)
  const formattedCrops = cropsList.map(item => {
    if (!item) return null;
    const c = item.crop || item || {};
    const name = c.crop_name || c.name || "Unknown Crop";

    let cropMonths = "N/A";
    if (c.sowing_month_start && c.sowing_month_end) {
      cropMonths = `${c.sowing_month_start.substring(0, 3)}-${c.sowing_month_end.substring(0, 3)}`;
    } else if (c.sowing_month_start || c.sowing_month_end) {
      cropMonths = (c.sowing_month_start || c.sowing_month_end).substring(0, 3);
    }

    const durationDays = String(c.duration_days || c.duration || "N/A");
    const ratingNum = item.compatibility_score !== undefined ? item.compatibility_score : (item.score !== undefined ? item.score : 80);
    const rating = String(Math.round(ratingNum));

    const scoreDisplay = getScoreDisplay(Number(rating));

    return {
      id: item.id || c.id,
      name,
      cropMonths,
      durationDays,
      rating,
      rank: scoreDisplay.rank,
      colorClass: scoreDisplay.color,
      compatibility: scoreDisplay.compatibility,
      rawItem: item
    };
  }).filter(Boolean);

  // Filter and Sort Crops (View 2)
  const filteredCrops = formattedCrops
    .filter(crop => crop.name.toLowerCase().includes(cropSearchQuery.toLowerCase()))
    .sort((a, b) => {
      if (cropSortBy === "alpha-asc") return a.name.localeCompare(b.name);
      if (cropSortBy === "alpha-desc") return b.name.localeCompare(a.name);
      if (cropSortBy === "score-desc") return Number(b.rating) - Number(a.rating);
      if (cropSortBy === "score-asc") return Number(a.rating) - Number(b.rating);
      return 0;
    });



  // Combine generic and personalized history items for the timeline (Page 2)
  const timelineItems = [
    ...genericHistory.map(item => ({ ...item, type: "generic", dateObj: new Date(item.created_at) })),
    ...personalizedHistory.map(item => ({ ...item, type: "personalized", dateObj: new Date(item.created_at) }))
  ].sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime()); // Newest first

  return (
    <div className={styles.historyPage}>
      <div className={styles.topographicBck}></div>

      {/* Header */}
      <header className={styles.topHeader}>
        <button
          className={styles.backBtn}
          onClick={() => {
            if (view === "details") {
              setView("sessions");
              setSelectedSession(null);
            } else {
              navigate("/farmer/dashboard");
            }
          }}
        >
          <img src={leftArrowIcon} alt="back" className={`${styles.backArrowIcon} ${styles.normalIcon}`} />
          <img src={leftArrowIconHover} alt="back" className={`${styles.backArrowIcon} ${styles.hoverIcon}`} />
        </button>
        <div className={styles.headerTitleContainer}>
          <img src={historyHeaderIcon} alt="history" className={styles.headerIcon} />
          <h1 className={styles.headerTitle}>History</h1>
        </div>
      </header>

      {/* Main Contents */}
      <main className={styles.mainContainer}>

        {/* VIEW 1: Sessions List Section */}
        {view === "sessions" && (
          <section className={styles.sessionsSection}>
            <h2 className={styles.sectionTitle}>Registered Sessions</h2>

            {/* Toggle tabs: All vs Favorites */}
            <div className={styles.tabsContainer}>
              <button
                className={`${styles.tabButton} ${!favoritesOnly ? styles.activeTab : ""}`}
                onClick={() => setFavoritesOnly(false)}
              >
                All Sessions
              </button>
              <button
                className={`${styles.tabButton} ${favoritesOnly ? styles.activeTab : ""}`}
                onClick={() => setFavoritesOnly(true)}
              >
                <img
                  src={whiteFullStar}
                  alt="star"
                  style={{
                    width: "16px",
                    height: "16px",
                    objectFit: "contain",
                    filter: favoritesOnly ? "brightness(0) invert(1)" : "brightness(0) saturate(100%) invert(32%) sepia(19%) saturate(468%) hue-rotate(62deg)"
                  }}
                />
                Favorites
              </button>
            </div>

            {/* Controls */}
            <div className={styles.controlsRow}>
              <button
                className={styles.sortButton}
                onClick={() => setDateSortOrder(prev => prev === "desc" ? "asc" : "desc")}
              >
                Sort: Date {dateSortOrder === "desc" ? "↓" : "↑"}
              </button>
            </div>

            {/* Scrollable list card container */}
            <div className={styles.scrollContainer}>
              {loadingSessions ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p className={styles.loadingText}>Fetching recommendation history...</p>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className={styles.emptyStateContainer}>
                  <p className={styles.emptyText}>No registered sessions found.</p>
                </div>
              ) : (
                <div className={styles.cardsDeck}>
                  {filteredSessions.map(session => (
                    <div
                      key={session.id}
                      className={styles.sessionCard}
                      onClick={() => handleSelectSession(session)}
                    >
                      <div className={styles.cardIconSection}>
                        <img src={locationIcon} alt="marker" className={`${styles.cardPinIcon} ${styles.normalIcon}`} />
                        <img src={locationIconHover} alt="marker" className={`${styles.cardPinIcon} ${styles.hoverIcon}`} />
                      </div>

                      <div className={styles.cardMetaSection}>
                        <p className={styles.sessionIdText}>
                          #RS-{String(session.id).padStart(5, '0')}
                        </p>
                        <div className={styles.sessionDetailRow}>
                          <img src={dateIcon} alt="date" className={`${styles.rowIcon} ${styles.normalIcon}`} />
                          <img src={dateIconHover} alt="date" className={`${styles.rowIcon} ${styles.hoverIcon}`} />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className={styles.sessionDetailRow}>
                          <img src={latLongIcon} alt="coords" className={`${styles.rowIcon} ${styles.normalIcon}`} />
                          <img src={latLongIconHover} alt="coords" className={`${styles.rowIcon} ${styles.hoverIcon}`} />
                          <span>{formatCoordinates(session.lat, session.lon)}</span>
                        </div>
                      </div>

                      <div className={styles.cardRightSection}>
                        {/* Favorite Toggle Star */}
                        <button
                          className={styles.cardFavStar}
                          onClick={(e) => handleToggleFavorite(session, e)}
                          title={session.favorite ? "Unfavorite session" : "Favorite session"}
                        >
                          <img
                            src={session.favorite ? yellowFullStar : yellowHollowStar}
                            alt="star"
                            style={{ width: "20px", height: "20px", objectFit: "contain" }}
                          />
                        </button>
                        <div className={styles.cardActionSection}>
                          <img src={rightArrowIcon} alt="arrow" className={`${styles.arrowIcon} ${styles.normalIcon}`} style={{ width: "16px", height: "auto" }} />
                          <img src={rightArrowIconHover} alt="arrow" className={`${styles.arrowIcon} ${styles.hoverIcon}`} style={{ width: "16px", height: "auto" }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* VIEW 2: Session Details Split Panel */}
        {view === "details" && selectedSession && (
          <section className={styles.detailsSplitLayout}>
            {/* Left panel session spec */}
            <div className={styles.leftSessionPanel}>
              <div className={styles.panelHeader} style={{ backgroundColor: "#2b3925" }}>
                <div className={styles.panelPinContainer} style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                  <img src={locationIcon} alt="marker" className={styles.panelPinIcon} />
                </div>
                <p className={styles.panelSessionId}>
                  #RS-{String(selectedSession.id).padStart(5, '0')}
                </p>
              </div>

              <div className={styles.panelBody}>
                <div className={styles.panelDetailRow}>
                  <img src={dateIconHover} alt="date" className={styles.panelDetailIcon} />
                  <span>{formatDate(selectedSession.date)}</span>
                </div>
                <div className={styles.panelDetailRow}>
                  <img src={latLongIconHover} alt="coords" className={styles.panelDetailIcon} />
                  <span>{formatCoordinates(selectedSession.lat, selectedSession.lon)}</span>
                </div>

                <button
                  className={styles.modalActionButton}
                  onClick={() => {
                    setSelectedCrop(null);
                    setModalPage(1);
                    setModalActiveSubTab("session");
                    setIsModalOpen(true);
                  }}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  View Session info
                </button>

                <button
                  className={styles.panelBackBtn}
                  onClick={() => {
                    setView("sessions");
                    setSelectedSession(null);
                  }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  <img src={leftArrowIcon} alt="back" style={{ width: "16px", height: "auto" }} />
                  Back
                </button>
              </div>
            </div>

            {/* Right panel crops list */}
            <div className={styles.rightCropsPanel}>
              <div className={styles.cropsHeaderBar}>
                <span className={styles.cropsTitle}>List of Crops</span>
                <div className={styles.cropsToolbar}>
                  <button
                    className={styles.toolbarIconBtn}
                    onClick={() => {
                      setCropSearchOpen(!cropSearchOpen);
                      setCropFilterOpen(false);
                    }}
                    title="Search crop"
                  >
                    <img src={searchIcon} alt="search" className={styles.toolbarIcon} />
                  </button>
                  <button
                    className={styles.toolbarIconBtn}
                    onClick={() => {
                      setCropFilterOpen(!cropFilterOpen);
                      setCropSearchOpen(false);
                    }}
                    title="Filter & Sort"
                  >
                    <img src={filterIcon} alt="filter" className={styles.toolbarIcon} />
                  </button>
                </div>
              </div>

              {/* Collapsible search bar */}
              {cropSearchOpen && (
                <div className={styles.searchDrawer}>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search crop name..."
                    value={cropSearchQuery}
                    onChange={(e) => setCropSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {cropSearchQuery && (
                    <button
                      className={styles.clearSearchBtn}
                      onClick={() => setCropSearchQuery("")}
                    >
                      &times;
                    </button>
                  )}
                </div>
              )}

              {/* Collapsible filter panel */}
              {cropFilterOpen && (
                <div className={styles.filterDrawer}>
                  <p className={styles.filterGroupLabel}>Sort by Compatibility</p>
                  <div className={styles.filterChips}>
                    <button
                      className={`${styles.filterChip} ${cropSortBy === "score-desc" ? styles.activeChip : ""}`}
                      onClick={() => setCropSortBy("score-desc")}
                    >
                      Highest First
                    </button>
                    <button
                      className={`${styles.filterChip} ${cropSortBy === "score-asc" ? styles.activeChip : ""}`}
                      onClick={() => setCropSortBy("score-asc")}
                    >
                      Lowest First
                    </button>
                  </div>

                  <p className={styles.filterGroupLabel}>Alphabetical</p>
                  <div className={styles.filterChips}>
                    <button
                      className={`${styles.filterChip} ${cropSortBy === "alpha-asc" ? styles.activeChip : ""}`}
                      onClick={() => setCropSortBy("alpha-asc")}
                    >
                      A to Z
                    </button>
                    <button
                      className={`${styles.filterChip} ${cropSortBy === "alpha-desc" ? styles.activeChip : ""}`}
                      onClick={() => setCropSortBy("alpha-desc")}
                    >
                      Z to A
                    </button>
                  </div>
                </div>
              )}

              {/* Scrollable Crops Card Deck */}
              <div className={styles.cropsListContainer}>
                {loadingCrops ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Loading crops recommendation...</p>
                  </div>
                ) : filteredCrops.length === 0 ? (
                  <div className={styles.emptyStateContainer}>
                    <p className={styles.emptyText}>No matching crops found.</p>
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
                      handleCropChoice={() => handleSelectCrop(crop)}
                      setCropContext={() => { }}
                    />
                  ))
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* VIEWS 3 & 4: Paginated Modal Overlay */}
      {isModalOpen && selectedSession && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          {selectedCrop ? (
            <div onClick={(e) => e.stopPropagation()}>
              <CropCard
                cropContext={selectedCrop}
                soilContext={{
                  PH: selectedCrop?.rawItem?.crop?.ph_min !== undefined && selectedCrop?.rawItem?.crop?.ph_max !== undefined
                    ? `${selectedCrop.rawItem.crop.ph_min} - ${selectedCrop.rawItem.crop.ph_max}`
                    : (selectedCrop?.rawItem?.crop?.ph_min || "5.5 - 6.5"),
                  depth: selectedCrop?.rawItem?.crop?.sampling_depth_cm || (selectedSession?.bulk_density !== undefined ? Math.round(selectedSession.bulk_density * 20) : 30),
                  shape: selectedCrop?.rawItem?.crop?.sampling_shape || "zigzag",
                  texture: selectedSession?.soil_texture_initial || "Sandy loam",
                  rank: selectedSession?.id || 1
                }}
                climContext={{
                  temp: selectedSession?.temperature_avg || 20,
                  rain: selectedSession?.rainfall_avg || 440,
                  humidity: selectedSession?.humidity_avg !== undefined ? `${Math.round(selectedSession.humidity_avg)}%` : "55%",
                  koppen: selectedSession?.koppen || "Csa",
                  rank: selectedSession?.id || 1
                }}
                fertContext={fertContext}
                genericHistory={genericHistory}
                personalizedHistory={personalizedHistory}
                onViewPersonalizedClick={() => setIsPersonalizedOpen(true)}
                hasPersonalized={personalizedHistory.length > 0}
                loadingPersonalized={loadingFertHistory}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          ) : (
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <img src={locationIcon} alt="pin" className={styles.modalHeaderPin} />
                <span className={styles.modalHeaderTitle}>
                  #RS-{String(selectedSession.id).padStart(5, '0')}
                </span>
                <button className={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
              </div>

              {/* Modal Page Content wrapper */}
              <div className={styles.modalBodyPanel}>

                {/* PAGE 1: Soil, NPK, coordinates & climate details */}
                {modalPage === 1 && (
                  <>
                    {modalActiveSubTab === "agronomic" ? (
                      <>
                        {/* Soil specs */}
                        <span className={styles.modalSectionHeader}>&bull; Soil Related</span>
                        <div className={styles.bronzePanel}>
                          <div className={styles.soilItem}>
                            <img src={popupPHIcon} alt="ph" className={styles.soilItemIcon} />
                            <div className={styles.soilMeta}>
                              <span className={styles.soilLabel}>PH-Range</span>
                              <span className={styles.soilValue}>
                                {selectedCrop?.rawItem?.crop?.ph_min || 5.5} - {selectedCrop?.rawItem?.crop?.ph_max || 6.5}
                              </span>
                            </div>
                          </div>

                          <div className={styles.soilItem}>
                            <img src={popupTextureIcon} alt="texture" className={styles.soilItemIcon} />
                            <div className={styles.soilMeta}>
                              <span className={styles.soilLabel}>Texture</span>
                              <span className={styles.soilValue}>
                                {selectedSession.soil_texture_initial || "Silt"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* NPK available levels */}
                        <span className={styles.modalSectionHeader}>&bull; NPK available</span>
                        <div className={styles.grayPanel}>
                          <div className={styles.npkRow}>
                            <img src={popupPIcon} alt="P" style={{ width: "32px", height: "32px", marginRight: "16px", borderRadius: "6px" }} />
                            <div className={styles.npkText}>
                              <span className={styles.npkLabel}>Phosphorus</span>
                              <span className={styles.npkValue}>
                                {Math.round(selectedSession.p_extractable_raw_ppm * 2.24 || 90)} kg/ha
                              </span>
                            </div>
                          </div>

                          <div className={styles.npkRow}>
                            <img src={popupNIcon} alt="N" style={{ width: "32px", height: "32px", marginRight: "16px", borderRadius: "6px" }} />
                            <div className={styles.npkText}>
                              <span className={styles.npkLabel}>Nitrogen</span>
                              <span className={styles.npkValue}>
                                {Math.round(selectedSession.n_total_raw_ppm * 2.24 || 180)} kg/ha
                              </span>
                            </div>
                          </div>

                          <div className={styles.npkRow}>
                            <img src={popupKIcon} alt="K" style={{ width: "32px", height: "32px", marginRight: "16px", borderRadius: "6px" }} />
                            <div className={styles.npkText}>
                              <span className={styles.npkLabel}>Potassium</span>
                              <span className={styles.npkValue}>
                                {Math.round(selectedSession.k_extractable_raw_ppm * 2.24 || 220)} kg/ha
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* View Session toggle button */}
                        <button
                          className={styles.modalActionButton}
                          onClick={() => {
                            if (selectedCrop) {
                              setModalActiveSubTab("session");
                            } else {
                              setView("details");
                              setIsModalOpen(false);
                            }
                          }}
                        >
                          View Session info
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Coordinates & generalities specs */}
                        <span className={styles.modalSectionHeader}>&bull; Generalities</span>
                        <div className={styles.darkGreenPanel}>
                          <div className={styles.darkGreenItem}>
                            <img src={popupCompassIcon} alt="coordinates" className={styles.darkGreenIcon} />
                            <div className={styles.darkGreenMeta}>
                              <span className={styles.darkGreenLabel}>Latitude - Longitude</span>
                              <span className={styles.darkGreenValue}>
                                {formatCoordinates(selectedSession.lat, selectedSession.lon)}
                              </span>
                            </div>
                          </div>

                          <div className={styles.darkGreenItem}>
                            <img src={popupCalendarIcon} alt="date" className={styles.darkGreenIcon} />
                            <div className={styles.darkGreenMeta}>
                              <span className={styles.darkGreenLabel}>Date - Time</span>
                              <span className={styles.darkGreenValue}>
                                {formatDate(selectedSession.date)}
                              </span>
                            </div>
                          </div>

                          <div className={styles.darkGreenItem}>
                            <img src={popupAngleIcon} alt="slope" className={styles.darkGreenIcon} />
                            <div className={styles.darkGreenMeta}>
                              <span className={styles.darkGreenLabel}>Slope angle</span>
                              <span className={styles.darkGreenValue}>
                                {selectedSession.slope_angle || 0.0}&deg;
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Climate specs */}
                        <span className={styles.modalSectionHeader}>&bull; Climate</span>
                        <div className={styles.blueGrayPanel}>
                          <div className={styles.blueGrayItem}>
                            <img src={popupTempIcon} alt="temp" className={styles.blueGrayIcon} />
                            <div className={styles.blueGrayMeta}>
                              <span className={styles.blueGrayLabel}>Temperature</span>
                              <span className={styles.blueGrayValue}>
                                {Math.round(selectedSession.temperature_avg || 20)}&deg;C
                              </span>
                            </div>
                          </div>

                          <div className={styles.blueGrayItem}>
                            <img src={popupRainIcon} alt="rain" className={styles.blueGrayIcon} />
                            <div className={styles.blueGrayMeta}>
                              <span className={styles.blueGrayLabel}>Rainfall</span>
                              <span className={styles.blueGrayValue}>
                                {Math.round(selectedSession.rainfall_avg || 600)}mm
                              </span>
                            </div>
                          </div>

                          <div className={styles.blueGrayItem}>
                            <img src={popupEarthIcon} alt="koppen" className={styles.blueGrayIcon} />
                            <div className={styles.blueGrayMeta}>
                              <span className={styles.blueGrayLabel}>Climate zone</span>
                              <span className={styles.blueGrayValue}>
                                {selectedSession.koppen || "Csa"}
                              </span>
                            </div>
                          </div>

                          <div className={styles.blueGrayItem}>
                            <img src={popupHumidityIcon} alt="humidity" className={styles.blueGrayIcon} />
                            <div className={styles.blueGrayMeta}>
                              <span className={styles.blueGrayLabel}>Humidity</span>
                              <span className={styles.blueGrayValue}>
                                {Math.round(selectedSession.humidity_avg || 80)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* View Agronomic toggle button */}
                        <button
                          className={styles.modalActionButton}
                          onClick={() => {
                            if (selectedCrop) {
                              setModalActiveSubTab("agronomic");
                            } else {
                              setView("details");
                              setIsModalOpen(false);
                            }
                          }}
                        >
                          {selectedCrop ? "View Agronomic info" : "View Session info"}
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* PAGE 2: Soil Related & NPK specs (NO Fertilization Logs) */}
                {modalPage === 2 && (
                  <div className={styles.pageTwoCenteredContainer}>
                    {/* Soil Related specs */}
                    <span className={styles.modalSectionHeader}>&bull; Soil Related</span>
                    <div className={styles.bronzePanel}>
                      <div className={styles.soilItem}>
                        <img src={popupPHIcon} alt="ph" className={styles.soilItemIcon} />
                        <div className={styles.soilMeta}>
                          <span className={styles.soilLabel}>PH-Range</span>
                          <span className={styles.soilValue}>
                            {selectedCrop?.rawItem?.crop?.ph_min || 5.5} - {selectedCrop?.rawItem?.crop?.ph_max || 6.5}
                          </span>
                        </div>
                      </div>

                      <div className={styles.soilItem}>
                        <img src={popupTextureIcon} alt="texture" className={styles.soilItemIcon} />
                        <div className={styles.soilMeta}>
                          <span className={styles.soilLabel}>Texture</span>
                          <span className={styles.soilValue}>
                            {selectedSession.soil_texture_initial || "Silt"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* NPK available levels */}
                    <span className={styles.modalSectionHeader}>&bull; NPK available</span>
                    <div className={styles.grayPanel}>
                      <div className={styles.npkRow}>
                        <img src={popupPIcon} alt="P" style={{ width: "32px", height: "32px", marginRight: "16px", borderRadius: "6px" }} />
                        <div className={styles.npkText}>
                          <span className={styles.npkLabel}>Phosphorus</span>
                          <span className={styles.npkValue}>
                            {Math.round(selectedSession.p_extractable_raw_ppm * 2.24 || 90)} kg/ha
                          </span>
                        </div>
                      </div>

                      <div className={styles.npkRow}>
                        <img src={popupNIcon} alt="N" style={{ width: "32px", height: "32px", marginRight: "16px", borderRadius: "6px" }} />
                        <div className={styles.npkText}>
                          <span className={styles.npkLabel}>Nitrogen</span>
                          <span className={styles.npkValue}>
                            {Math.round(selectedSession.n_total_raw_ppm * 2.24 || 180)} kg/ha
                          </span>
                        </div>
                      </div>

                      <div className={styles.npkRow}>
                        <img src={popupKIcon} alt="K" style={{ width: "32px", height: "32px", marginRight: "16px", borderRadius: "6px" }} />
                        <div className={styles.npkText}>
                          <span className={styles.npkLabel}>Potassium</span>
                          <span className={styles.npkValue}>
                            {Math.round(selectedSession.k_extractable_raw_ppm * 2.24 || 220)} kg/ha
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Session toggle button */}
                    <button
                      className={styles.modalActionButton}
                      onClick={() => {
                        setModalActiveSubTab("session");
                        setModalPage(1);
                      }}
                    >
                      View Session info
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination Footer controls */}
              <div className={styles.modalFooter}>
                <button
                  className={styles.modalFooterArrow}
                  onClick={() => setModalPage(1)}
                  disabled={modalPage === 1}
                >
                  <img src={leftArrowIcon} alt="prev" className={`${styles.footerArrowIcon} ${styles.normalIcon}`} />
                  <img src={leftArrowIconHover} alt="prev" className={`${styles.footerArrowIcon} ${styles.hoverIcon}`} />
                </button>
                <span className={styles.modalFooterText}>Page {modalPage}/2</span>
                <button
                  className={styles.modalFooterArrow}
                  onClick={() => setModalPage(2)}
                  disabled={modalPage === 2}
                >
                  <img src={rightArrowIcon} alt="next" className={`${styles.footerArrowIcon} ${styles.normalIcon}`} />
                  <img src={rightArrowIconHover} alt="next" className={`${styles.footerArrowIcon} ${styles.hoverIcon}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isPersonalizedOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPersonalizedOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <FinalResult
              resultContext={{
                name: selectedCrop?.name || "Crop",
                PH: personalizedHistory[0]?.ph_entered || selectedSession?.ph || 6.5,
                PHNote: personalizedHistory[0]?.ph_note || "pH is ideal",
                N: {
                  nutrient: "Nitrogen",
                  score: Math.round(personalizedHistory[0]?.n_percent !== undefined ? personalizedHistory[0].n_percent : (fertContext?.N?.score || 70)),
                  available: Math.round(
                    personalizedHistory[0]?.n_percent !== undefined && personalizedHistory[0].n_percent < 100
                      ? (personalizedHistory[0].n_percent / 100) * (fertContext?.N?.need || 120)
                      : ((personalizedHistory[0]?.n_entered_ppm || 50) * 2.24)
                  ),
                  need: Math.round(fertContext?.N?.need || 120),
                  deficit: Math.round(personalizedHistory[0]?.n_total_kg !== undefined ? personalizedHistory[0].n_total_kg : (fertContext?.N?.deficit || 0))
                },
                P: {
                  nutrient: "Phosphorus",
                  score: Math.round(personalizedHistory[0]?.p_percent !== undefined ? personalizedHistory[0].p_percent : (fertContext?.P?.score || 45)),
                  available: Math.round(
                    personalizedHistory[0]?.p_percent !== undefined && personalizedHistory[0].p_percent < 100
                      ? (personalizedHistory[0].p_percent / 100) * (fertContext?.P?.need || 40)
                      : ((personalizedHistory[0]?.p_entered_ppm || 50) * 2.24)
                  ),
                  need: Math.round(fertContext?.P?.need || 40),
                  deficit: Math.round(personalizedHistory[0]?.p_total_kg !== undefined ? personalizedHistory[0].p_total_kg : (fertContext?.P?.deficit || 0))
                },
                K: {
                  nutrient: "Potassium",
                  score: Math.round(personalizedHistory[0]?.k_percent !== undefined ? personalizedHistory[0].k_percent : (fertContext?.K?.score || 23)),
                  available: Math.round(
                    personalizedHistory[0]?.k_percent !== undefined && personalizedHistory[0].k_percent < 100
                      ? (personalizedHistory[0].k_percent / 100) * (fertContext?.K?.need || 60)
                      : ((personalizedHistory[0]?.k_entered_ppm || 50) * 2.24)
                  ),
                  need: Math.round(fertContext?.K?.need || 60),
                  deficit: Math.round(personalizedHistory[0]?.k_total_kg !== undefined ? personalizedHistory[0].k_total_kg : (fertContext?.K?.deficit || 0))
                }
              }}
              onClose={() => setIsPersonalizedOpen(false)}
              isLoading={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
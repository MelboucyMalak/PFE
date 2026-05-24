import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CropPopup } from '../../farmer/crops-consulting/CropCards/CropPopup';
import { normalizeCropImagePath } from '../../farmer/crops-consulting/CropCards/CropCard';
import './CropsManagement.css';

// Farmer Icons reused
import searchIcon from '../../farmer/crops-consulting/icons/Search-icon.png';
import sortIcon from '../../farmer/crops-consulting/icons/Sort-icon.png';
import pageArrowLeft from '../../farmer/crops-consulting/icons/Page-arrow-left.png';
import pageArrowRight from '../../farmer/crops-consulting/icons/Page-arrow-right.png';
import sowingIcon from '../../farmer/crops-consulting/icons/Sowing-month-icon.png';
import durationIcon from '../../farmer/crops-consulting/icons/Duration-icon.png';
import rightArrowIcon from '../../farmer/crops-consulting/icons/Right-arrow.png';
import cropListIcon from '../../farmer/FarmerDashboard/Icons/Crop-list.png';
import leftArrowIcon from '../../farmer/ReccomendationHistory/Images/Left-arrow.png';

// Admin Specific Icons
import editIcon from './icons/Edit icon.png';
import editHoverIcon from './icons/Edit icon hover.png';
import deleteIcon from './icons/Delete-crop.png';
import deleteHoverIcon from './icons/Delete-crop-hover.png';
import addIcon from './icons/Add-icon.png';
import addHoverIcon from './icons/Add-icon-hover.png';
import exitIcon from './icons/Exit button.png';
import cancelIcon from './icons/Cancel-addition.png';
import checkmarkIcon from './icons/Checkmark.png';

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

const monthStringToNumber = (str) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const idx = months.indexOf(str);
  return idx !== -1 ? idx + 1 : 1;
};

const numberToMonthString = (num) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const idx = Number(num) - 1;
  return idx >= 0 && idx < 12 ? months[idx] : 'January';
};

const parseMonthVal = (val) => {
  if (typeof val === 'number') {
    return numberToMonthString(val);
  }
  if (typeof val === 'string' && !isNaN(val)) {
    const num = parseInt(val, 10);
    if (!isNaN(num)) return numberToMonthString(num);
  }
  return val || 'January';
};

const climateStringToId = (str) => {
  const clean = String(str).trim();
  if (clean === 'Csa' || clean === 'csb') return 1;
  if (clean === 'BSh') return 2;
  if (clean === 'BSk') return 3;
  if (clean === 'BWh') return 4;
  return 1;
};

const MOCK_INITIAL_CROPS = [
  {
    id: 1,
    crop_name: "Wheat",
    sowing_month_start: "November",
    sowing_month_end: "December",
    duration_days: 120,
    duration_min_days: 110,
    duration_max_days: 130,
    root_depth_min_cm: 30,
    root_depth_max_cm: 90,
    temp_min: 15,
    temp_max: 25,
    water_min_mm: 350,
    water_max_mm: 600,
    humidity_min: 50,
    humidity_max: 70,
    ph_min: 6.0,
    ph_max: 7.0,
    sampling_depth_cm: 30,
    sampling_shape: "Zigzag",
    n_kg_ha: 120,
    p_kg_ha: 60,
    k_kg_ha: 40,
    image: "/crops/Wheat.png",
    crop_climates: [
      { climate: "Csa", rating: 5, note: "Ideal winter rain-fed crop" },
      { climate: "BSh", rating: 4, note: "Requires winter irrigation" },
      { climate: "BSk", rating: 4, note: "Cold hardy" },
      { climate: "BWh", rating: 2, note: "Too dry without irrigation" }
    ],
    crop_soil_textures: [
      { texture_name: "Sand", suitability_rank: 2, note: "Drains too fast" },
      { texture_name: "Loamy Sand", suitability_rank: 3, note: "Acceptable" },
      { texture_name: "Sandy Loam", suitability_rank: 5, note: "Excellent drainage" },
      { texture_name: "Loam", suitability_rank: 5, note: "Perfect balance" },
      { texture_name: "Silt Loam", suitability_rank: 5, note: "Excellent" },
      { texture_name: "Silt", suitability_rank: 4, note: "Good" },
      { texture_name: "Sandy Clay Loam", suitability_rank: 4, note: "Suitable" },
      { texture_name: "Clay Loam", suitability_rank: 4, note: "Acceptable" },
      { texture_name: "Silty Clay Loam", suitability_rank: 3, note: "Slow drainage" },
      { texture_name: "Sandy Clay", suitability_rank: 2, note: "Too heavy" },
      { texture_name: "Silty Clay", suitability_rank: 2, note: "Waterlogging risk" },
      { texture_name: "Clay", suitability_rank: 1, note: "Root rot risk" }
    ]
  },
  {
    id: 2,
    crop_name: "Tomato",
    sowing_month_start: "January",
    sowing_month_end: "March",
    duration_days: 90,
    duration_min_days: 80,
    duration_max_days: 100,
    root_depth_min_cm: 20,
    root_depth_max_cm: 60,
    temp_min: 18,
    temp_max: 32,
    water_min_mm: 400,
    water_max_mm: 800,
    humidity_min: 60,
    humidity_max: 85,
    ph_min: 5.5,
    ph_max: 6.8,
    sampling_depth_cm: 30,
    sampling_shape: "Zigzag",
    n_kg_ha: 150,
    p_kg_ha: 80,
    k_kg_ha: 120,
    image: "/crops/Tomato.png",
    crop_climates: [
      { climate: "Csa", rating: 5, note: "Excellent under drip irrigation" },
      { climate: "BSh", rating: 4, note: "Requires shade nets in mid-summer" },
      { climate: "BSk", rating: 3, note: "Watch for late spring frosts" },
      { climate: "BWh", rating: 3, note: "Extreme summer heat affects fruit set" }
    ],
    crop_soil_textures: [
      { texture_name: "Sand", suitability_rank: 3, note: "Requires high organic inputs" },
      { texture_name: "Loamy Sand", suitability_rank: 4, note: "Good" },
      { texture_name: "Sandy Loam", suitability_rank: 5, note: "Ideal for early production" },
      { texture_name: "Loam", suitability_rank: 5, note: "Outstanding nutrient holding" },
      { texture_name: "Silt Loam", suitability_rank: 4, note: "Good" },
      { texture_name: "Silt", suitability_rank: 4, note: "Acceptable" },
      { texture_name: "Sandy Clay Loam", suitability_rank: 4, note: "Suitable" },
      { texture_name: "Clay Loam", suitability_rank: 3, note: "Compact soil slows roots" },
      { texture_name: "Silty Clay Loam", suitability_rank: 3, note: "Fungal disease risk" },
      { texture_name: "Sandy Clay", suitability_rank: 2, note: "Hard packed" },
      { texture_name: "Silty Clay", suitability_rank: 1, note: "Damping off risk" },
      { texture_name: "Clay", suitability_rank: 1, note: "Poor aeration" }
    ]
  },
  {
    id: 3,
    crop_name: "Bengalgram",
    sowing_month_start: "November",
    sowing_month_end: "December",
    duration_days: 110,
    duration_min_days: 100,
    duration_max_days: 120,
    root_depth_min_cm: 90,
    root_depth_max_cm: 120,
    temp_min: 15,
    temp_max: 30,
    water_min_mm: 250,
    water_max_mm: 400,
    humidity_min: 30,
    humidity_max: 50,
    ph_min: 6.0,
    ph_max: 8.0,
    sampling_depth_cm: 30,
    sampling_shape: "Zigzag",
    n_kg_ha: 20,
    p_kg_ha: 40,
    k_kg_ha: 20,
    image: "/crops/Bengalgram.png",
    crop_climates: [
      { climate: "Csa", rating: 5, note: "Ideal winter rain-fed crop" },
      { climate: "BSh", rating: 5, note: "Highly drought resistant" },
      { climate: "BSk", rating: 4, note: "Hardy against cool steppe winds" },
      { climate: "BWh", rating: 3, note: "Needs minimal winter irrigation" }
    ],
    crop_soil_textures: [
      { texture_name: "Sand", suitability_rank: 4, note: "Good drainage" },
      { texture_name: "Loamy Sand", suitability_rank: 4, note: "Suitable" },
      { texture_name: "Sandy Loam", suitability_rank: 5, note: "Ideal; roots penetrate easily" },
      { texture_name: "Loam", suitability_rank: 5, note: "Excellent balance" },
      { texture_name: "Silt Loam", suitability_rank: 4, note: "Good retention" },
      { texture_name: "Silt", suitability_rank: 3, note: "Acceptable" },
      { texture_name: "Sandy Clay Loam", suitability_rank: 4, note: "Suitable for rainfed conditions" },
      { texture_name: "Clay Loam", suitability_rank: 3, note: "Drainage critical to avoid rot" },
      { texture_name: "Silty Clay Loam", suitability_rank: 2, note: "Risk of fungal diseases" },
      { texture_name: "Sandy Clay", suitability_rank: 2, note: "Hard soil" },
      { texture_name: "Silty Clay", suitability_rank: 1, note: "Waterlogging risk" },
      { texture_name: "Clay", suitability_rank: 1, note: "Excessive moisture" }
    ]
  }
];

export default function CropsManagement() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  // Modals Visibility
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Multi-phase Wizard States
  const [currentStep, setCurrentStep] = useState(1);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Lists for dynamic steps
  const [climatesList, setClimatesList] = useState([]);
  const [soilTexturesList, setSoilTexturesList] = useState([]);

  // Temp states for wizard sub-forms
  const [tempClimateZone, setTempClimateZone] = useState('Csa');
  const [tempClimateRank, setTempClimateRank] = useState('5');
  const [tempClimateNote, setTempClimateNote] = useState('');

  const [tempSoilTexture, setTempSoilTexture] = useState('Loam');
  const [tempSoilRank, setTempSoilRank] = useState('5');
  const [tempSoilNote, setTempSoilNote] = useState('');

  const soilTexturesOptions = [
    "Sand",
    "Loamy Sand",
    "Sandy Loam",
    "Loam",
    "Silt Loam",
    "Silt",
    "Sandy Clay Loam",
    "Clay Loam",
    "Silty Clay Loam",
    "Sandy Clay",
    "Silty Clay",
    "Clay"
  ];

  // Form states
  const [formData, setFormData] = useState({
    id: null,
    crop_name: '',
    sowing_month_start: 'January',
    sowing_month_end: 'December',
    duration_days: 90,
    root_depth_min_cm: 20,
    root_depth_max_cm: 60,
    temp_min: 15,
    temp_max: 30,
    water_min_mm: 300,
    water_max_mm: 800,
    humidity_min: 40,
    humidity_max: 80,
    ph_min: 6.0,
    ph_max: 7.0,
    sampling_depth_cm: 30,
    sampling_shape: 'zigzag',
    n_kg_ha: 120,
    p_kg_ha: 60,
    k_kg_ha: 80
  });

  const [modalBannerMessage, setModalBannerMessage] = useState("");
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Simple local state updater (no more localStorage persistence)
  const updateLocalCropsState = (newCropsList) => {
    setCrops(newCropsList);
  };

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://torbati.onrender.com/api/admin/crops/', {
          headers: { Authorization: `Token ${token}` }
        });
        const data = response.data;
        // Handle both array responses and wrapped { crops: [...] } responses
        const list = Array.isArray(data) ? data : (data.crops || data.results || []);
        setCrops(list);
      } catch (err) {
        console.error('Failed to fetch crops from API:', err);
        // Fall back to mock data so the UI is still usable
        setCrops(MOCK_INITIAL_CROPS);
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
    if (startPage > 2) pages.push('...left');
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages - 1) pages.push('...right');
    pages.push(totalPages);

    return pages;
  };

  const handleNextGridPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevGridPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Action Button Handlers
  const handleViewClick = (crop) => {
    setSelectedCrop(crop);
    setIsViewPopupOpen(true);
  };

  const handleEditClick = (crop) => {
    setSelectedCrop(crop);
    setFormData({
      id: crop.id || null,
      crop_name: crop.crop_name || '',
      sowing_month_start: parseMonthVal(crop.sowing_month_start),
      sowing_month_end: parseMonthVal(crop.sowing_month_end),
      duration_days: crop.duration_days || 90,
      duration_min_days: crop.duration_min_days || crop.duration_days || 90,
      duration_max_days: crop.duration_max_days || crop.duration_days || 90,
      root_depth_min_cm: crop.root_depth_min_cm || 20,
      root_depth_max_cm: crop.root_depth_max_cm || 60,
      temp_min: crop.temp_min || 15,
      temp_max: crop.temp_max || 30,
      water_min_mm: crop.water_min_mm || 300,
      water_max_mm: crop.water_max_mm || 800,
      humidity_min: crop.humidity_min || 40,
      humidity_max: crop.humidity_max || 80,
      ph_min: crop.ph_min || 6.0,
      ph_max: crop.ph_max || 7.0,
      sampling_depth_cm: crop.sampling_depth_cm || 30,
      sampling_shape: crop.sampling_shape || 'zigzag',
      n_kg_ha: crop.n_kg_ha || 120,
      p_kg_ha: crop.p_kg_ha || 60,
      k_kg_ha: crop.k_kg_ha || 80,
      image: crop.image || null
    });

    const mappedClimates = (crop.crop_climates || []).map(item => ({
      climateZone: item.climate || '',
      climateId: item.climate_id,          // preserve real DB id from API
      rank: String(item.rating || item.rank || '5'),
      note: item.note || ''
    }));
    setClimatesList(mappedClimates);

    const mappedSoilTextures = (crop.crop_soil_textures || []).map(item => ({
      soilTexture: item.texture_name || item.soilTexture || '',
      rank: String(item.suitability_rank || item.rank || '5'),
      note: item.note || ''
    }));
    setSoilTexturesList(mappedSoilTextures);

    setCurrentStep(1);
    setTempClimateZone('Csa');
    setTempClimateRank('5');
    setTempClimateNote('');
    setTempSoilTexture('Loam');
    setTempSoilRank('5');
    setTempSoilNote('');
    setValidationError("");
    setModalBannerMessage("");
    setImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (crop) => {
    setSelectedCrop(crop);
    setModalBannerMessage("");
    setIsDeleteModalOpen(true);
  };

  const handleAddClick = () => {
    setFormData({
      id: null,
      crop_name: '',
      sowing_month_start: 'January',
      sowing_month_end: 'December',
      duration_days: '',
      duration_min_days: '',
      duration_max_days: '',
      root_depth_min_cm: '',
      root_depth_max_cm: '',
      temp_min: '',
      temp_max: '',
      water_min_mm: '',
      water_max_mm: '',
      humidity_min: '',
      humidity_max: '',
      ph_min: '',
      ph_max: '',
      sampling_depth_cm: '',
      sampling_shape: 'zigzag',
      n_kg_ha: '',
      p_kg_ha: '',
      k_kg_ha: '',
      image: null
    });
    setCurrentStep(1);
    setIsCancelPopupOpen(false);
    setIsSuccessPopupOpen(false);
    setValidationError("");
    setClimatesList([]);
    setSoilTexturesList([]);
    setTempClimateZone('Csa');
    setTempClimateRank('5');
    setTempClimateNote('');
    setTempSoilTexture('Loam');
    setTempSoilRank('5');
    setTempSoilNote('');
    setModalBannerMessage("");
    setImageFile(null);
    setIsAddModalOpen(true);
  };

  // Form Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numberFields = [
      'duration_days', 'duration_min_days', 'duration_max_days', 'root_depth_min_cm', 'root_depth_max_cm',
      'temp_min', 'temp_max', 'water_min_mm', 'water_max_mm',
      'humidity_min', 'humidity_max', 'ph_min', 'ph_max',
      'sampling_depth_cm', 'n_kg_ha', 'p_kg_ha', 'k_kg_ha'
    ];

    setFormData(prev => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value
    }));
  };

  const unpackCropResponse = (data, fallbackPayload, existingCrop) => {
    let cropObj = null;
    if (data) {
      if (data.crop_name) {
        cropObj = data;
      } else if (data.crop && data.crop.crop_name) {
        cropObj = data.crop;
      } else if (data.crops && data.crops[0] && data.crops[0].crop_name) {
        cropObj = data.crops[0];
      } else if (data.results && data.results[0] && data.results[0].crop_name) {
        cropObj = data.results[0];
      }
    }
    
    if (!cropObj) {
      return { ...existingCrop, ...fallbackPayload };
    }
    return cropObj;
  };

  // Live API Save/Add/Delete Form Submissions
  const submitEditForm = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsModalSaving(true);
    setValidationError("");
    setModalBannerMessage("");

    try {
      const token = localStorage.getItem('token');
      const avgDuration = Math.round((Number(formData.duration_min_days) + Number(formData.duration_max_days)) / 2) || Number(formData.duration_days) || 90;
      const samplingShape = formData.sampling_shape
        ? (formData.sampling_shape.charAt(0).toUpperCase() + formData.sampling_shape.slice(1))
        : 'Zigzag';

      // Always send crop data as JSON — FormData breaks DRF nested serializer parsing.
      // Image is uploaded separately via a follow-up PATCH request.
      const payload = {
        crop_name: formData.crop_name,
        sowing_month_start: monthStringToNumber(formData.sowing_month_start),
        sowing_month_end: monthStringToNumber(formData.sowing_month_end),
        duration_days: avgDuration,
        duration_min_days: Number(formData.duration_min_days) || avgDuration,
        duration_max_days: Number(formData.duration_max_days) || avgDuration,
        root_depth_min_cm: Number(formData.root_depth_min_cm) || 0,
        root_depth_max_cm: Number(formData.root_depth_max_cm) || 0,
        temp_min: Number(formData.temp_min) || 0,
        temp_max: Number(formData.temp_max) || 0,
        water_min_mm: Number(formData.water_min_mm) || 0,
        water_max_mm: Number(formData.water_max_mm) || 0,
        humidity_min: Number(formData.humidity_min) || 0,
        humidity_max: Number(formData.humidity_max) || 0,
        ph_min: Number(formData.ph_min) || 0,
        ph_max: Number(formData.ph_max) || 0,
        sampling_depth_cm: Number(formData.sampling_depth_cm) || 0,
        sampling_shape: samplingShape,
        n_kg_ha: Number(formData.n_kg_ha) || 0,
        p_kg_ha: Number(formData.p_kg_ha) || 0,
        k_kg_ha: Number(formData.k_kg_ha) || 0,
        crop_climates: climatesList.map(item => ({
          // Use the real DB id stored on edit; fall back to mapping for new zones added mid-edit
          climate_id: item.climateId !== undefined ? item.climateId : climateStringToId(item.climateZone),
          rating: Number(item.rank),
          note: item.note ? item.note.trim() : 'Optimal'
        })),
        crop_soil_textures: soilTexturesList.map(item => ({
          texture_name: item.soilTexture,
          suitability_rank: Number(item.rank),
          note: item.note ? item.note.trim() : 'Optimal'
        }))
      };

      // PUT /api/admin/crops/:id  (no trailing slash — confirmed API spec)
      const response = await axios.put(
        `https://torbati.onrender.com/api/admin/crops/${formData.id}`,
        payload,
        { headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' } }
      );

      // If user also changed the image, upload it separately via PATCH + FormData
      // Update local list with the server-returned crop object
      const serverCrop = unpackCropResponse(response.data, payload, selectedCrop);
      let displayCrop = {
        ...serverCrop,
        sowing_month_start: parseMonthVal(serverCrop.sowing_month_start),
        sowing_month_end: parseMonthVal(serverCrop.sowing_month_end),
      };

      if (imageFile) {
        const imgForm = new FormData();
        imgForm.append('image', imageFile);
        try {
          const patchRes = await axios.patch(
            `https://torbati.onrender.com/api/admin/crops/${formData.id}`,
            imgForm,
            { headers: { Authorization: `Token ${token}` } }
          );
          // Merge the server-returned image URL so the card updates immediately
          const patchData = patchRes.data?.crop || patchRes.data || {};
          const uploadedUrl = patchData.image || patchData.crop_image || null;
          if (uploadedUrl) displayCrop = { ...displayCrop, image: uploadedUrl };
        } catch (imgErr) {
          console.warn('Image upload failed (crop data saved):', imgErr.response?.data);
        }
      }

      setCrops(prev => prev.map(c => c.id === formData.id ? displayCrop : c));


      setModalBannerMessage('Crop edited successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setModalBannerMessage('');
      }, 1000);
    } catch (err) {
      console.error('Edit crop error — full response:', JSON.stringify(err.response?.data));
      const responseData = err.response?.data;
      let msg = 'Failed to save changes. Please try again.';
      if (responseData) {
        if (typeof responseData === 'string') {
          msg = responseData;
        } else if (responseData.error) {
          msg = responseData.error;
        } else if (responseData.detail) {
          msg = responseData.detail;
        } else {
          const fieldErrors = Object.entries(responseData)
            .map(([field, errs]) => {
              const errStr = Array.isArray(errs)
                ? errs.map(e => (typeof e === 'object' ? JSON.stringify(e) : e)).join(', ')
                : (typeof errs === 'object' ? JSON.stringify(errs) : errs);
              return `${field}: ${errStr}`;
            })
            .join(' | ');
          if (fieldErrors) msg = fieldErrors;
        }
      }
      setValidationError(msg);
    } finally {
      setIsModalSaving(false);
    }
  };

  const handleWizardSubmit = async (e) => {
    e.preventDefault();
    const missingTextures = soilTexturesOptions.filter(
      t => !soilTexturesList.some(item => item.soilTexture === t)
    );
    if (missingTextures.length > 0) {
      setValidationError(`Please add suitability ratings for all 12 soil textures. Missing: ${missingTextures.join(', ')}.`);
      return;
    }
    setIsModalSaving(true);
    setValidationError('');

    try {
      const token = localStorage.getItem('token');
      const avgDuration = Math.round((Number(formData.duration_min_days) + Number(formData.duration_max_days)) / 2) || 90;
      const samplingShape = formData.sampling_shape
        ? (formData.sampling_shape.charAt(0).toUpperCase() + formData.sampling_shape.slice(1))
        : 'Zigzag';

      // Always send as JSON — FormData breaks DRF nested serializer parsing.
      // Image is uploaded separately via a follow-up PATCH after the crop is created.
      const payload = {
        crop_name: formData.crop_name,
        sowing_month_start: monthStringToNumber(formData.sowing_month_start),
        sowing_month_end: monthStringToNumber(formData.sowing_month_end),
        duration_days: avgDuration,
        duration_min_days: Number(formData.duration_min_days) || 90,
        duration_max_days: Number(formData.duration_max_days) || 90,
        root_depth_min_cm: Number(formData.root_depth_min_cm) || 0,
        root_depth_max_cm: Number(formData.root_depth_max_cm) || 0,
        temp_min: Number(formData.temp_min) || 0,
        temp_max: Number(formData.temp_max) || 0,
        water_min_mm: Number(formData.water_min_mm) || 0,
        water_max_mm: Number(formData.water_max_mm) || 0,
        humidity_min: Number(formData.humidity_min) || 0,
        humidity_max: Number(formData.humidity_max) || 0,
        ph_min: Number(formData.ph_min) || 0,
        ph_max: Number(formData.ph_max) || 0,
        sampling_depth_cm: Number(formData.sampling_depth_cm) || 0,
        sampling_shape: samplingShape,
        n_kg_ha: Number(formData.n_kg_ha) || 0,
        p_kg_ha: Number(formData.p_kg_ha) || 0,
        k_kg_ha: Number(formData.k_kg_ha) || 0,
        crop_climates: climatesList.map(item => ({
          climate_id: item.climateId !== undefined ? item.climateId : climateStringToId(item.climateZone),
          rating: Number(item.rank),
          note: item.note ? item.note.trim() : 'Optimal'
        })),
        crop_soil_textures: soilTexturesList.map(item => ({
          texture_name: item.soilTexture,
          suitability_rank: Number(item.rank),
          note: item.note ? item.note.trim() : 'Optimal'
        }))
      };

      // POST /api/admin/crops/  (with trailing slash — confirmed API spec)
      const response = await axios.post(
        'https://torbati.onrender.com/api/admin/crops/',
        payload,
        { headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' } }
      );

      const serverCrop = unpackCropResponse(response.data, payload, {});
      const newId = serverCrop.id;

      let displayCrop = {
        ...serverCrop,
        sowing_month_start: parseMonthVal(serverCrop.sowing_month_start),
        sowing_month_end: parseMonthVal(serverCrop.sowing_month_end),
      };

      // If user selected an image, upload it separately now that we have the crop ID
      if (imageFile && newId) {
        const imgForm = new FormData();
        imgForm.append('image', imageFile);
        try {
          const patchRes = await axios.patch(
            `https://torbati.onrender.com/api/admin/crops/${newId}`,
            imgForm,
            { headers: { Authorization: `Token ${token}` } }
          );
          // Merge the server-returned image URL into the local crop card
          const patchData = patchRes.data?.crop || patchRes.data || {};
          const uploadedUrl = patchData.image || patchData.crop_image || null;
          if (uploadedUrl) displayCrop = { ...displayCrop, image: uploadedUrl };
        } catch (imgErr) {
          console.warn('Image upload failed (crop was created):', imgErr.response?.data);
        }
      }

      setCrops(prev => [displayCrop, ...prev]);
      setIsSuccessPopupOpen(true);
    } catch (err) {
      console.error('Add crop error — full response:', JSON.stringify(err.response?.data));
      console.error('Status:', err.response?.status);
      const responseData = err.response?.data;
      let msg = 'Failed to add crop. Please try again.';
      if (responseData) {
        if (typeof responseData === 'string') {
          msg = responseData;
        } else if (responseData.error) {
          msg = responseData.error;
        } else if (responseData.detail) {
          msg = responseData.detail;
        } else {
          const fieldErrors = Object.entries(responseData)
            .map(([field, errs]) => {
              const errStr = Array.isArray(errs)
                ? errs.map(e => (typeof e === 'object' ? JSON.stringify(e) : e)).join(', ')
                : (typeof errs === 'object' ? JSON.stringify(errs) : errs);
              return `${field}: ${errStr}`;
            })
            .join(' | ');
          if (fieldErrors) msg = fieldErrors;
        }
      }
      setValidationError(msg);
    } finally {
      setIsModalSaving(false);
    }
  };

  const submitDelete = async () => {
    setIsModalSaving(true);
    setValidationError('');
    setModalBannerMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://torbati.onrender.com/api/admin/crops/${selectedCrop.id}`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setCrops(prev => prev.filter(c => c.id !== selectedCrop.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error('Delete crop error:', err);
      const msg = err.response?.data?.error
        || err.response?.data?.detail
        || 'Failed to delete crop. Please try again.';
      setModalBannerMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsModalSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-crops-page-container">
        <header className="admin-crops-header">
          <div className="admin-crops-header-title-container">
            <img src={cropListIcon} alt="" className="admin-crops-header-icon" />
            <h1 className="admin-crops-header-title">Crops Management</h1>
          </div>
        </header>
        <div className="admin-loading-screen">
          <div className="admin-catalog-spinner"></div>
          <p>Gathering crops database registries...</p>
        </div>
      </div>
    );
  }

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="admin-crops-page-container">
      {/* Standard Admin Header */}
      <header className="admin-crops-header">
        <button className="admin-crops-back-btn" onClick={() => navigate('/admin/dashboard')} aria-label="Back to dashboard">
          <img src={leftArrowIcon} alt="Back" className="admin-crops-back-arrow" />
        </button>
        <div className="admin-crops-header-title-container">
          <img src={cropListIcon} alt="" className="admin-crops-header-icon" />
          <h1 className="admin-crops-header-title">Crops Management</h1>
        </div>
      </header>

      <main className="admin-crops-content-layout">
        
        {/* Search and Filters */}
        <section className="admin-catalog-filters-bar">
          <div className="admin-search-bar-inner">
            <input
              type="text"
              className="admin-search-input-box"
              placeholder="Search for a crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img src={searchIcon} alt="" className="admin-search-icon-img" />
          </div>

          <div className="admin-season-filter-section">
            <span className="admin-season-label">Season:</span>
            <div className="admin-season-pills-group">
              {['All', 'Spring', 'Summer', 'Autumn', 'Winter'].map((season) => (
                <button
                  key={season}
                  className={`admin-season-pill-btn ${selectedSeason === season ? 'active' : ''}`}
                  onClick={() => setSelectedSeason(season)}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-sort-filter-section">
            <img src={sortIcon} alt="" className="admin-sort-icon-img" />
            <select
              className="admin-sort-dropdown-select"
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

        {/* Crops Grid */}
        {currentPageCrops.length > 0 ? (
          <div className="admin-crops-grid-viewport">
            {currentPageCrops.map((crop) => {
              const sowingTimeline = crop.sowing_month_start && crop.sowing_month_end
                ? `${crop.sowing_month_start} - ${crop.sowing_month_end}`
                : 'Not Specified';
              const imageUrl = normalizeCropImagePath(crop.image);

              return (
                <div key={crop.id} className="crop-display-card">
                  <div className="crop-card-img-wrapper">
                    <img
                      src={imageUrl}
                      alt={crop.crop_name}
                      className="crop-card-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-crop.png';
                      }}
                    />
                  </div>
                  
                  <h3 className="crop-card-title">{crop.crop_name}</h3>
                  
                  <div className="crop-card-specs-list">
                    <div className="crop-spec-item">
                      <img src={sowingIcon} alt="" className="crop-spec-icon" />
                      <p><span>Sowing Month:</span> {sowingTimeline}</p>
                    </div>
                    <div className="crop-spec-item">
                      <img src={durationIcon} alt="" className="crop-spec-icon" />
                      <p><span>Duration:</span> {crop.duration_days} days</p>
                    </div>
                  </div>
                  
                  <div className="crop-card-admin-controls">
                    <div className="crop-card-row-top">
                      <button className="crop-card-btn-view" onClick={() => handleViewClick(crop)}>
                        View Crop <img src={rightArrowIcon} alt="" className="view-crop-arrow-icon" />
                      </button>
                      <button className="crop-admin-btn delete-btn" onClick={() => handleDeleteClick(crop)} title="Delete Crop">
                        <img src={deleteIcon} alt="Delete" className="icon-normal" />
                        <img src={deleteHoverIcon} alt="Delete" className="icon-hover" />
                      </button>
                    </div>
                    <button className="crop-card-btn-edit" onClick={() => handleEditClick(crop)}>
                      <img src={editHoverIcon} alt="Edit" className="edit-crop-pen-icon icon-normal" />
                      <img src={editIcon} alt="Edit" className="edit-crop-pen-icon icon-hover" />
                      Edit Crop
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="admin-no-crops-found-box">
            <p>No crops match your selected filters. Try searching for another crop.</p>
          </div>
        )}

        {/* Pagination Footer */}
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

        {/* Add Crop Button below grid and pagination */}
        <div className="add-crop-section">
          <button className="btn-add-crop" onClick={handleAddClick}>
            <img src={addIcon} alt="Add" className="add-icon-normal" />
            <img src={addHoverIcon} alt="Add" className="add-icon-hover" />
            <span>Add New Crop</span>
          </button>
        </div>

      </main>

      {/* POPUP VIEW MODAL */}
      {isViewPopupOpen && selectedCrop && (
        <CropPopup crop={selectedCrop} onClose={() => setIsViewPopupOpen(false)} />
      )}

      {/* ADD CROP MODAL WIZARD */}
      {isAddModalOpen && (
        <>
          {/* Floating Progress Bar at top of screen */}
          {(() => {
            const steps = [
              { num: 1, label: 'General' },
              { num: 2, label: 'Climate' },
              { num: 3, label: 'Soil' },
              { num: 4, label: 'NPK' },
              { num: 5, label: 'Climate zone' },
              { num: 6, label: 'Soil texture' }
            ];

            return (
              <div className="admin-progress-bar-card">
                <div className="progress-steps-container">
                  {steps.map((step, idx) => {
                    const isCompleted = currentStep > step.num;
                    const isActive = currentStep === step.num;
                    let stepClass = "progress-step";
                    if (isCompleted) stepClass += " completed";
                    else if (isActive) stepClass += " active";

                    return (
                      <React.Fragment key={step.num}>
                        <div className={stepClass}>
                          <div className="step-circle">
                            {isCompleted ? (
                              <img src={checkmarkIcon} alt="✓" className="step-check-icon" />
                            ) : (
                              step.num
                            )}
                          </div>
                          <span className="step-label">{step.label}</span>
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`progress-line ${isCompleted ? 'completed' : ''}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Modal Container */}
          <div className="crop-modal-overlay" onClick={() => setIsCancelPopupOpen(true)}>
            <div className="crop-modal-container" onClick={(e) => e.stopPropagation()}>
              <header className="crop-modal-header" style={{ backgroundColor: '#273628', color: 'white' }}>
                <h3 style={{ textTransform: 'capitalize' }}>
                  {currentStep === 1 && "Generalities"}
                  {currentStep === 2 && "Climate"}
                  {currentStep === 3 && "Soil"}
                  {currentStep === 4 && "NPK"}
                  {currentStep === 5 && "Climate zone"}
                  {currentStep === 6 && "Soil texture"}
                </h3>
                <button
                  type="button"
                  className="crop-modal-close-btn-wrapper"
                  onClick={() => setIsCancelPopupOpen(true)}
                >
                  <img className="default-exit" src="/guidePages/Exit-button.png" alt="close" />
                  <img className="hover-exit" src="/guidePages/Exit-button-hover.png" alt="close hover" />
                </button>
              </header>

              <form onSubmit={handleWizardSubmit}>
                <div className="crop-modal-body">
                  {validationError && (
                    <div className="crop-modal-error-banner">⚠️ {validationError}</div>
                  )}
                  {/* Step 1: Generalities */}
                  {currentStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="crop-upload-photo-section">
                        <div className="crop-photo-circle-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {formData.image && (
                            <img
                              src={formData.image}
                              alt="Uploaded Preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn-crop-upload-photo"
                          onClick={() => document.getElementById('crop-photo-file-input').click()}
                        >
                          Upload photo
                        </button>
                        <span className="upload-photo-subtitle">JPG or PNG</span>
                        <input
                          type="file"
                          id="crop-photo-file-input"
                          accept="image/jpeg, image/png"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setImageFile(file);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({ ...prev, image: reader.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>

                      <div className="crop-form-group">
                        <label>Crop Name</label>
                        <input
                          type="text"
                          className="crop-form-input"
                          name="crop_name"
                          value={formData.crop_name}
                          onChange={handleInputChange}
                          placeholder="Crop"
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="crop-form-group">
                          <label>Sowing Month Start</label>
                          <select
                            className="crop-form-select"
                            name="sowing_month_start"
                            value={formData.sowing_month_start}
                            onChange={handleInputChange}
                          >
                            {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <span style={{ fontSize: '11px', color: '#7A8E7E', marginTop: '2px' }}>Select a month</span>
                        </div>
                        <div className="crop-form-group">
                          <label>Sowing Month End</label>
                          <select
                            className="crop-form-select"
                            name="sowing_month_end"
                            value={formData.sowing_month_end}
                            onChange={handleInputChange}
                          >
                            {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <span style={{ fontSize: '11px', color: '#7A8E7E', marginTop: '2px' }}>Select a month</span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="crop-form-group">
                          <label>Duration Min (days)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="duration_min_days"
                            value={formData.duration_min_days}
                            onChange={handleInputChange}
                            placeholder="XXXXXX (days)"
                            min="1"
                            required
                          />
                        </div>
                        <div className="crop-form-group">
                          <label>Duration Max (days)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="duration_max_days"
                            value={formData.duration_max_days}
                            onChange={handleInputChange}
                            placeholder="XXXXXX (days)"
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="crop-form-group">
                          <label>Root depth Min (cm)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="root_depth_min_cm"
                            value={formData.root_depth_min_cm}
                            onChange={handleInputChange}
                            placeholder="XXXXXX (cm)"
                            min="0"
                            required
                          />
                        </div>
                        <div className="crop-form-group">
                          <label>Root depth Max (cm)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="root_depth_max_cm"
                            value={formData.root_depth_max_cm}
                            onChange={handleInputChange}
                            placeholder="XXXXXX (cm)"
                            min="0"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Climate */}
                  {currentStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h4 className="crop-step-subheading">Climate</h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="crop-form-group">
                          <label>Temperature Min (°C)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="temp_min"
                            value={formData.temp_min}
                            onChange={handleInputChange}
                            placeholder="XXXXXX °C"
                            required
                          />
                        </div>
                        <div className="crop-form-group">
                          <label>Temperature Max (°C)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="temp_max"
                            value={formData.temp_max}
                            onChange={handleInputChange}
                            placeholder="XXXXXX °C"
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="crop-form-group">
                          <label>Rainfall Min (mm)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="water_min_mm"
                            value={formData.water_min_mm}
                            onChange={handleInputChange}
                            placeholder="XXXXXX mm"
                            min="0"
                            required
                          />
                        </div>
                        <div className="crop-form-group">
                          <label>Rainfall Max (mm)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="water_max_mm"
                            value={formData.water_max_mm}
                            onChange={handleInputChange}
                            placeholder="XXXXXX mm"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="crop-form-group">
                          <label>Humidity Min (%)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="humidity_min"
                            value={formData.humidity_min}
                            onChange={handleInputChange}
                            placeholder="XXXXXX %"
                            min="0"
                            max="100"
                            required
                          />
                        </div>
                        <div className="crop-form-group">
                          <label>Humidity Max (%)</label>
                          <input
                            type="number"
                            className="crop-form-input"
                            name="humidity_max"
                            value={formData.humidity_max}
                            onChange={handleInputChange}
                            placeholder="XXXXXX %"
                            min="0"
                            max="100"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Soil */}
                  {currentStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h4 className="crop-step-subheading">Soil</h4>

                      <div className="crop-form-group">
                        <label>Sampling shape</label>
                        <select
                          className="crop-form-select"
                          name="sampling_shape"
                          value={formData.sampling_shape}
                          onChange={handleInputChange}
                        >
                          <option value="zigzag">Zigzag</option>
                          <option value="diagonal">Diagonal</option>
                          <option value="grid">Grid</option>
                          <option value="random">Random</option>
                        </select>
                        <span style={{ fontSize: '11px', color: '#7A8E7E', marginTop: '2px' }}>Select a shape</span>
                      </div>

                      <div className="crop-form-group">
                        <label>Sampling depth (cm)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="sampling_depth_cm"
                          value={formData.sampling_depth_cm}
                          onChange={handleInputChange}
                          placeholder="XXXXXX cm"
                          min="1"
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="crop-form-group">
                          <label>PH-range Min</label>
                          <input
                            type="number"
                            step="0.1"
                            className="crop-form-input"
                            name="ph_min"
                            value={formData.ph_min}
                            onChange={handleInputChange}
                            placeholder="0"
                            min="0"
                            max="14"
                            required
                          />
                        </div>
                        <div className="crop-form-group">
                          <label>PH-range Max</label>
                          <input
                            type="number"
                            step="0.1"
                            className="crop-form-input"
                            name="ph_max"
                            value={formData.ph_max}
                            onChange={handleInputChange}
                            placeholder="14"
                            min="0"
                            max="14"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: NPK */}
                  {currentStep === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h4 className="crop-step-subheading">NPK required</h4>

                      <div className="crop-form-group">
                        <label>Nitrogen (N) (kg/ha)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="n_kg_ha"
                          value={formData.n_kg_ha}
                          onChange={handleInputChange}
                          placeholder="XX kg/ha"
                          min="0"
                          required
                        />
                      </div>

                      <div className="crop-form-group">
                        <label>Phosphorus (P) (kg/ha)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="p_kg_ha"
                          value={formData.p_kg_ha}
                          onChange={handleInputChange}
                          placeholder="XX kg/ha"
                          min="0"
                          required
                        />
                      </div>

                      <div className="crop-form-group">
                        <label>Potassium (K) (kg/ha)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="k_kg_ha"
                          value={formData.k_kg_ha}
                          onChange={handleInputChange}
                          placeholder="XX kg/ha"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 5: Climate zone */}
                  {currentStep === 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h4 className="crop-step-subheading">Climate zone</h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="crop-form-group">
                          <label>Climate Zone</label>
                          <select
                            className="crop-form-select"
                            value={tempClimateZone}
                            onChange={(e) => setTempClimateZone(e.target.value)}
                          >
                            <option value="Csa">Csa — Mediterranean (hot summer)</option>
                            <option value="BSh">BSh — Semi-arid hot steppe</option>
                            <option value="BSk">BSk — Semi-arid cold steppe</option>
                            <option value="BWh">BWh — Desert hot (arid)</option>
                          </select>
                        </div>
                        <div className="crop-form-group">
                          <label>Suitability Rank</label>
                          <select
                            className="crop-form-select"
                            value={tempClimateRank}
                            onChange={(e) => setTempClimateRank(e.target.value)}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>

                      <div className="crop-form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '12px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label>Notes</label>
                          <input
                            type="text"
                            className="crop-form-input"
                            value={tempClimateNote}
                            onChange={(e) => setTempClimateNote(e.target.value)}
                            placeholder="Additional note..."
                          />
                        </div>
                        <button
                          type="button"
                          className="btn-crop-wizard-add-tag"
                          onClick={() => {
                            if (climatesList.some(c => c.climateZone === tempClimateZone)) {
                              alert(`"${tempClimateZone}" climate zone is already added.`);
                              return;
                            }
                            setClimatesList(prev => [
                              ...prev,
                              { climateZone: tempClimateZone, rank: tempClimateRank, note: tempClimateNote || '-' }
                            ]);
                            setValidationError("");
                            setTempClimateNote('');
                          }}
                        >
                          Add Zone
                        </button>
                      </div>

                      <div className="crop-wizard-list-container">
                        {climatesList.length === 0 ? (
                          <p className="crop-wizard-list-empty">No climate zones added yet.</p>
                        ) : (
                          climatesList.map((item, idx) => (
                            <div key={idx} className="crop-wizard-item-tag">
                              <div className="crop-wizard-item-tag-details">
                                <h5>{item.climateZone}</h5>
                                <p>Rank: <strong>{item.rank}</strong> {item.note && `| ${item.note}`}</p>
                              </div>
                              <button
                                type="button"
                                className="btn-crop-wizard-remove-tag"
                                onClick={() => setClimatesList(prev => prev.filter((_, i) => i !== idx))}
                              >
                                &times;
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 6: Soil texture */}
                  {currentStep === 6 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h4 className="crop-step-subheading">Soil texture</h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="crop-form-group">
                          <label>Soil Texture</label>
                          <select
                            className="crop-form-select"
                            value={tempSoilTexture}
                            onChange={(e) => setTempSoilTexture(e.target.value)}
                          >
                            {soilTexturesOptions.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="crop-form-group">
                          <label>Suitability Rank</label>
                          <select
                            className="crop-form-select"
                            value={tempSoilRank}
                            onChange={(e) => setTempSoilRank(e.target.value)}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>

                      <div className="crop-form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '12px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label>Notes</label>
                          <input
                            type="text"
                            className="crop-form-input"
                            value={tempSoilNote}
                            onChange={(e) => setTempSoilNote(e.target.value)}
                            placeholder="Additional note..."
                          />
                        </div>
                        <button
                          type="button"
                          className="btn-crop-wizard-add-tag"
                          onClick={() => {
                            if (soilTexturesList.some(s => s.soilTexture === tempSoilTexture)) {
                              alert(`"${tempSoilTexture}" soil texture is already added.`);
                              return;
                            }
                            setSoilTexturesList(prev => [
                              ...prev,
                              { soilTexture: tempSoilTexture, rank: tempSoilRank, note: tempSoilNote || '-' }
                            ]);
                            setValidationError("");
                            setTempSoilNote('');
                          }}
                        >
                          Add Texture
                        </button>
                      </div>

                      <div className="crop-wizard-list-container">
                        {soilTexturesList.length === 0 ? (
                          <p className="crop-wizard-list-empty">No soil textures added yet.</p>
                        ) : (
                          soilTexturesList.map((item, idx) => (
                            <div key={idx} className="crop-wizard-item-tag">
                              <div className="crop-wizard-item-tag-details">
                                <h5>{item.soilTexture}</h5>
                                <p>Rank: <strong>{item.rank}</strong> {item.note && `| ${item.note}`}</p>
                              </div>
                              <button
                                type="button"
                                className="btn-crop-wizard-remove-tag"
                                onClick={() => setSoilTexturesList(prev => prev.filter((_, i) => i !== idx))}
                              >
                                &times;
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Navigation */}
                {currentStep === 1 && (
                  <div className="crop-modal-footer" style={{ justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="btn-modal-submit"
                      style={{ minWidth: '150px' }}
                      onClick={() => {
                        const input = document.getElementsByName('crop_name')[0];
                        if (!formData.crop_name) {
                          if (input) input.reportValidity();
                          return;
                        }
                        setCurrentStep(2);
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}

                {currentStep > 1 && currentStep < 5 && (
                  <div className="crop-modal-footer" style={{ justifyContent: 'center', gap: '16px' }}>
                    <button type="button" className="btn-modal-cancel" onClick={() => { setValidationError(""); setCurrentStep(prev => prev - 1); }}>Back</button>
                    <button type="button" className="btn-modal-submit" onClick={() => { setValidationError(""); setCurrentStep(prev => prev + 1); }}>Next</button>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="crop-modal-footer" style={{ justifyContent: 'center', gap: '16px' }}>
                    <button type="button" className="btn-modal-cancel" onClick={() => { setValidationError(""); setCurrentStep(4); }}>Back</button>
                    <button
                      type="button"
                      className="btn-modal-submit"
                      onClick={() => {
                        const requiredClimates = ['Csa', 'BSh', 'BSk', 'BWh'];
                        const missingClimates = requiredClimates.filter(
                          c => !climatesList.some(item => item.climateZone === c)
                        );
                        if (missingClimates.length > 0) {
                          setValidationError(`Please add suitability ratings for all climate zones. Missing: ${missingClimates.join(', ')}.`);
                          return;
                        }
                        setValidationError("");
                        setCurrentStep(6);
                      }}
                    >
                      Next
                    </button>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="crop-modal-footer" style={{ justifyContent: 'center', gap: '16px' }}>
                    <button type="button" className="btn-modal-cancel" onClick={() => { setValidationError(""); setCurrentStep(5); }}>Back</button>
                    <button type="submit" className="btn-modal-submit" disabled={isModalSaving}>
                      {isModalSaving ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </>
      )}

      {/* CANCEL CROP ADDITION CONFIRMATION POPUP */}
      {isCancelPopupOpen && (
        <div className="crop-modal-overlay" style={{ zIndex: 100001 }} onClick={() => setIsCancelPopupOpen(false)}>
          <div className="crop-modal-container cancel-popup-box" onClick={(e) => e.stopPropagation()}>
            <header className="crop-modal-header" style={{ backgroundColor: '#273628', color: 'white', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 'normal' }}>Cancel Addition</h3>
              <button
                type="button"
                className="crop-modal-close-btn-wrapper"
                onClick={() => setIsCancelPopupOpen(false)}
              >
                <img className="default-exit" src="/guidePages/Exit-button.png" alt="close" style={{ width: '18px', height: '18px' }} />
                <img className="hover-exit" src="/guidePages/Exit-button-hover.png" alt="close hover" style={{ width: '18px', height: '18px' }} />
              </button>
            </header>
            
            <div className="cancel-popup-body">
              <img src={cancelIcon} alt="X" className="cancel-popup-status-icon" />
              <h4 className="cancel-popup-title">Cancel crop addition ?</h4>
              <p className="cancel-popup-text">Are you sure you wish to cancel adding this crop</p>
              
              <button
                type="button"
                className="btn-cancel-popup-goback"
                onClick={() => setIsCancelPopupOpen(false)}
              >
                Go back
              </button>
              
              <button
                type="button"
                className="btn-cancel-popup-confirm"
                onClick={() => {
                  setIsCancelPopupOpen(false);
                  setIsAddModalOpen(false);
                }}
              >
                Cancel addition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CROP ADDED SUCCESS POPUP */}
      {isSuccessPopupOpen && (
        <div className="crop-modal-overlay" style={{ zIndex: 100001 }}>
          <div className="crop-modal-container success-popup-box" onClick={(e) => e.stopPropagation()}>
            <header className="crop-modal-header" style={{ backgroundColor: '#273628', color: 'white', padding: '14px 24px' }}>
              <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 'normal' }}>Success</h3>
            </header>
            
            <div className="success-popup-body">
              <img src={checkmarkIcon} alt="✓" className="success-popup-status-icon" />
              <h4 className="success-popup-title">Crop added successfully!</h4>
              
              <div className="success-popup-details">
                <div className="success-detail-row">
                  <strong>Crop Name</strong>
                  <span>{formData.crop_name || 'N/A'}</span>
                </div>
                <div className="success-detail-row">
                  <strong>Sowing Month</strong>
                  <span>{formData.sowing_month_start} - {formData.sowing_month_end}</span>
                </div>
                <div className="success-detail-row">
                  <strong>Duration</strong>
                  <span>{formData.duration_min_days} - {formData.duration_max_days} days</span>
                </div>
                <div className="success-detail-row">
                  <strong>Nitrogen</strong>
                  <span>{formData.n_kg_ha} kg/ha</span>
                </div>
              </div>
              
              <button
                type="button"
                className="btn-success-popup-goback"
                onClick={() => {
                  setIsSuccessPopupOpen(false);
                  setIsAddModalOpen(false);
                }}
              >
                Go back to catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CROP MODAL */}
      {isEditModalOpen && (
        <div className="crop-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="crop-modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="crop-modal-header" style={{ backgroundColor: '#273628', color: 'white' }}>
              <h3 style={{ textTransform: 'capitalize' }}>
                {currentStep === 1 && "Edit Generalities"}
                {currentStep === 2 && "Edit Climate"}
                {currentStep === 3 && "Edit Soil"}
                {currentStep === 4 && "Edit NPK"}
                {currentStep === 5 && "Edit Climate zone"}
                {currentStep === 6 && "Edit Soil texture"}
              </h3>
              <button
                type="button"
                className="crop-modal-close-btn-wrapper"
                onClick={() => setIsEditModalOpen(false)}
              >
                <img className="default-exit" src="/guidePages/Exit-button.png" alt="close" />
                <img className="hover-exit" src="/guidePages/Exit-button-hover.png" alt="close hover" />
              </button>
            </header>
            
            <form onSubmit={submitEditForm}>
              <div className="crop-modal-body">
                {validationError && (
                  <div className="crop-modal-error-banner">⚠️ {validationError}</div>
                )}
                {modalBannerMessage && (
                  <div className="crop-modal-banner">✓ {modalBannerMessage}</div>
                )}

                {/* Step 1: Generalities */}
                {currentStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="crop-upload-photo-section">
                      <div className="crop-photo-circle-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {formData.image && (
                          <img
                            src={normalizeCropImagePath(formData.image)}
                            alt="Uploaded Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-crop-upload-photo"
                        onClick={() => document.getElementById('edit-crop-photo-file-input').click()}
                      >
                        Upload photo
                      </button>
                      <span className="upload-photo-subtitle">JPG or PNG</span>
                      <input
                        type="file"
                        id="edit-crop-photo-file-input"
                        accept="image/jpeg, image/png"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setImageFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({ ...prev, image: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>

                    <div className="crop-form-group">
                      <label>Crop Name</label>
                      <input
                        type="text"
                        className="crop-form-input"
                        name="crop_name"
                        value={formData.crop_name}
                        onChange={handleInputChange}
                        placeholder="Crop"
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="crop-form-group">
                        <label>Sowing Month Start</label>
                        <select
                          className="crop-form-select"
                          name="sowing_month_start"
                          value={formData.sowing_month_start}
                          onChange={handleInputChange}
                        >
                          {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <span style={{ fontSize: '11px', color: '#7A8E7E', marginTop: '2px' }}>Select a month</span>
                      </div>
                      <div className="crop-form-group">
                        <label>Sowing Month End</label>
                        <select
                          className="crop-form-select"
                          name="sowing_month_end"
                          value={formData.sowing_month_end}
                          onChange={handleInputChange}
                        >
                          {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <span style={{ fontSize: '11px', color: '#7A8E7E', marginTop: '2px' }}>Select a month</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="crop-form-group">
                        <label>Duration Min (days)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="duration_min_days"
                          value={formData.duration_min_days}
                          onChange={handleInputChange}
                          placeholder="XXXXXX (days)"
                          min="1"
                          required
                        />
                      </div>
                      <div className="crop-form-group">
                        <label>Duration Max (days)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="duration_max_days"
                          value={formData.duration_max_days}
                          onChange={handleInputChange}
                          placeholder="XXXXXX (days)"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="crop-form-group">
                        <label>Root depth Min (cm)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="root_depth_min_cm"
                          value={formData.root_depth_min_cm}
                          onChange={handleInputChange}
                          placeholder="XXXXXX (cm)"
                          min="0"
                          required
                        />
                      </div>
                      <div className="crop-form-group">
                        <label>Root depth Max (cm)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="root_depth_max_cm"
                          value={formData.root_depth_max_cm}
                          onChange={handleInputChange}
                          placeholder="XXXXXX (cm)"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Climate */}
                {currentStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 className="crop-step-subheading">Climate</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="crop-form-group">
                        <label>Temperature Min (°C)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="temp_min"
                          value={formData.temp_min}
                          onChange={handleInputChange}
                          placeholder="XXXXXX °C"
                          required
                        />
                      </div>
                      <div className="crop-form-group">
                        <label>Temperature Max (°C)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="temp_max"
                          value={formData.temp_max}
                          onChange={handleInputChange}
                          placeholder="XXXXXX °C"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="crop-form-group">
                        <label>Rainfall Min (mm)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="water_min_mm"
                          value={formData.water_min_mm}
                          onChange={handleInputChange}
                          placeholder="XXXXXX mm"
                          min="0"
                          required
                        />
                      </div>
                      <div className="crop-form-group">
                        <label>Rainfall Max (mm)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="water_max_mm"
                          value={formData.water_max_mm}
                          onChange={handleInputChange}
                          placeholder="XXXXXX mm"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="crop-form-group">
                        <label>Humidity Min (%)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="humidity_min"
                          value={formData.humidity_min}
                          onChange={handleInputChange}
                          placeholder="XXXXXX %"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                      <div className="crop-form-group">
                        <label>Humidity Max (%)</label>
                        <input
                          type="number"
                          className="crop-form-input"
                          name="humidity_max"
                          value={formData.humidity_max}
                          onChange={handleInputChange}
                          placeholder="XXXXXX %"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Soil */}
                {currentStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 className="crop-step-subheading">Soil</h4>

                    <div className="crop-form-group">
                      <label>Sampling shape</label>
                      <select
                        className="crop-form-select"
                        name="sampling_shape"
                        value={formData.sampling_shape}
                        onChange={handleInputChange}
                      >
                        <option value="zigzag">Zigzag</option>
                        <option value="diagonal">Diagonal</option>
                        <option value="grid">Grid</option>
                        <option value="random">Random</option>
                      </select>
                      <span style={{ fontSize: '11px', color: '#7A8E7E', marginTop: '2px' }}>Select a shape</span>
                    </div>

                    <div className="crop-form-group">
                      <label>Sampling depth (cm)</label>
                      <input
                        type="number"
                        className="crop-form-input"
                        name="sampling_depth_cm"
                        value={formData.sampling_depth_cm}
                        onChange={handleInputChange}
                        placeholder="XXXXXX cm"
                        min="1"
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="crop-form-group">
                        <label>PH-range Min</label>
                        <input
                          type="number"
                          step="0.1"
                          className="crop-form-input"
                          name="ph_min"
                          value={formData.ph_min}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          max="14"
                          required
                        />
                      </div>
                      <div className="crop-form-group">
                        <label>PH-range Max</label>
                        <input
                          type="number"
                          step="0.1"
                          className="crop-form-input"
                          name="ph_max"
                          value={formData.ph_max}
                          onChange={handleInputChange}
                          placeholder="14"
                          min="0"
                          max="14"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: NPK */}
                {currentStep === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 className="crop-step-subheading">NPK required</h4>

                    <div className="crop-form-group">
                      <label>Nitrogen (N) (kg/ha)</label>
                      <input
                        type="number"
                        className="crop-form-input"
                        name="n_kg_ha"
                        value={formData.n_kg_ha}
                        onChange={handleInputChange}
                        placeholder="XX kg/ha"
                        min="0"
                        required
                      />
                    </div>

                    <div className="crop-form-group">
                      <label>Phosphorus (P) (kg/ha)</label>
                      <input
                        type="number"
                        className="crop-form-input"
                        name="p_kg_ha"
                        value={formData.p_kg_ha}
                        onChange={handleInputChange}
                        placeholder="XX kg/ha"
                        min="0"
                        required
                      />
                    </div>

                    <div className="crop-form-group">
                      <label>Potassium (K) (kg/ha)</label>
                      <input
                        type="number"
                        className="crop-form-input"
                        name="k_kg_ha"
                        value={formData.k_kg_ha}
                        onChange={handleInputChange}
                        placeholder="XX kg/ha"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Climate zone */}
                {currentStep === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 className="crop-step-subheading">Climate zone</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="crop-form-group">
                        <label>Climate Zone</label>
                        <select
                          className="crop-form-select"
                          value={tempClimateZone}
                          onChange={(e) => setTempClimateZone(e.target.value)}
                        >
                          <option value="Csa">Csa — Mediterranean (hot summer)</option>
                          <option value="BSh">BSh — Semi-arid hot steppe</option>
                          <option value="BSk">BSk — Semi-arid cold steppe</option>
                          <option value="BWh">BWh — Desert hot (arid)</option>
                        </select>
                      </div>
                      <div className="crop-form-group">
                        <label>Suitability Rank</label>
                        <select
                          className="crop-form-select"
                          value={tempClimateRank}
                          onChange={(e) => setTempClimateRank(e.target.value)}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </div>

                    <div className="crop-form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '12px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label>Notes</label>
                        <input
                          type="text"
                          className="crop-form-input"
                          value={tempClimateNote}
                          onChange={(e) => setTempClimateNote(e.target.value)}
                          placeholder="Additional note..."
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-crop-wizard-add-tag"
                        onClick={() => {
                          if (climatesList.some(c => c.climateZone === tempClimateZone)) {
                            alert(`"${tempClimateZone}" climate zone is already added.`);
                            return;
                          }
                          setClimatesList(prev => [
                            ...prev,
                            { climateZone: tempClimateZone, rank: tempClimateRank, note: tempClimateNote }
                          ]);
                          setValidationError("");
                          setTempClimateNote('');
                        }}
                      >
                        Add Zone
                      </button>
                    </div>

                    <div className="crop-wizard-list-container">
                      {climatesList.length === 0 ? (
                        <p className="crop-wizard-list-empty">No climate zones added yet.</p>
                      ) : (
                        climatesList.map((item, idx) => (
                          <div key={idx} className="crop-wizard-item-tag">
                            <div className="crop-wizard-item-tag-details">
                              <h5>{item.climateZone}</h5>
                              <p>Rank: <strong>{item.rank}</strong> {item.note && `| ${item.note}`}</p>
                            </div>
                            <button
                              type="button"
                              className="btn-crop-wizard-remove-tag"
                              onClick={() => setClimatesList(prev => prev.filter((_, i) => i !== idx))}
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Step 6: Soil texture */}
                {currentStep === 6 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 className="crop-step-subheading">Soil texture</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="crop-form-group">
                        <label>Soil Texture</label>
                        <select
                          className="crop-form-select"
                          value={tempSoilTexture}
                          onChange={(e) => setTempSoilTexture(e.target.value)}
                        >
                          {soilTexturesOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="crop-form-group">
                        <label>Suitability Rank</label>
                        <select
                          className="crop-form-select"
                          value={tempSoilRank}
                          onChange={(e) => setTempSoilRank(e.target.value)}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </div>

                    <div className="crop-form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '12px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label>Notes</label>
                        <input
                          type="text"
                          className="crop-form-input"
                          value={tempSoilNote}
                          onChange={(e) => setTempSoilNote(e.target.value)}
                          placeholder="Additional note..."
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-crop-wizard-add-tag"
                        onClick={() => {
                          if (soilTexturesList.some(s => s.soilTexture === tempSoilTexture)) {
                            alert(`"${tempSoilTexture}" soil texture is already added.`);
                            return;
                          }
                          setSoilTexturesList(prev => [
                            ...prev,
                            { soilTexture: tempSoilTexture, rank: tempSoilRank, note: tempSoilNote }
                          ]);
                          setValidationError("");
                          setTempSoilNote('');
                        }}
                      >
                        Add Texture
                      </button>
                    </div>

                    <div className="crop-wizard-list-container">
                      {soilTexturesList.length === 0 ? (
                        <p className="crop-wizard-list-empty">No soil textures added yet.</p>
                      ) : (
                        soilTexturesList.map((item, idx) => (
                          <div key={idx} className="crop-wizard-item-tag">
                            <div className="crop-wizard-item-tag-details">
                              <h5>{item.soilTexture}</h5>
                              <p>Rank: <strong>{item.rank}</strong> {item.note && `| ${item.note}`}</p>
                            </div>
                            <button
                              type="button"
                              className="btn-crop-wizard-remove-tag"
                              onClick={() => setSoilTexturesList(prev => prev.filter((_, i) => i !== idx))}
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Modal Footer - Allows Save in ANY step */}
              <div className="crop-modal-footer" style={{ justifyContent: 'center', gap: '16px' }}>
                {currentStep === 1 ? (
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                ) : (
                  <button type="button" className="btn-modal-cancel" onClick={() => { setValidationError(""); setCurrentStep(prev => prev - 1); }}>Back</button>
                )}

                <button type="submit" className="btn-modal-submit" disabled={isModalSaving}>
                  {isModalSaving ? "Saving..." : "Save changes"}
                </button>

                {currentStep < 6 && (
                  <button
                    type="button"
                    className="btn-modal-submit"
                    onClick={() => {
                      if (currentStep === 1) {
                        const input = document.getElementsByName('crop_name')[0];
                        if (!formData.crop_name) {
                          if (input) input.reportValidity();
                          return;
                        }
                      }
                      setValidationError("");
                      setCurrentStep(prev => prev + 1);
                    }}
                  >
                    Next
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {isDeleteModalOpen && selectedCrop && (
        <div className="crop-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="crop-modal-container delete-confirm-box" onClick={(e) => e.stopPropagation()}>
            <header className="crop-modal-header">
              <h3>Delete Crop</h3>
              <button className="crop-modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>&times;</button>
            </header>
            
            <div className="delete-confirm-body">
              <p>Are you sure you want to delete this crop registry?</p>
              <span>This will permanently remove <strong>{selectedCrop.crop_name}</strong> from the system catalog.</span>
            </div>

            <div className="crop-modal-footer">
              <button type="button" className="btn-modal-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button type="button" className="btn-modal-delete" onClick={submitDelete} disabled={isModalSaving}>
                {isModalSaving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
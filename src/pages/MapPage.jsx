import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BottomNavComponent from "../components/BottomNav";
import SearchIcon from "../assets/img/search.svg";
import { getPlaces } from "../services/place";
import TrashImg from "../assets/img/trashIcon.svg";
import ClothesImg from "../assets/clothes.png";
import BatteryImg from "../assets/battery.png";
import RecycleImg from "../assets/recycle.png";
import MedicineImg from "../assets/medicine.png";
import { getRequiredEnv } from "../config/env";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #fff;
`;

const MapBox = styled.div`
  width: 100%;
  height: 100vh;
  background: #eee;
`;

const SearchBox = styled.div`
  position: absolute;
  top: 60px;
  left: 20px;
  right: 20px;

  height: 50px;

  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 15px;

  display: flex;
  align-items: center;

  padding: 2px 16px;
  box-sizing: border-box;

  z-index: 10;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-family: "Paperlogy";
  font-size: 15px;
  color: #272727;

  &::placeholder {
    color: #b8b8b8;
  }
`;

const SearchImg = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const CategoryScroll = styled.div`
  position: absolute;
  top: 120px;
  left: 20px;
  right: 0;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  z-index: 10;
  padding-right: 20px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryButton = styled.button`
  flex-shrink: 0;
  height: 35px;
  padding: 0 15px;
  border-radius: 15px;
  border: 1px solid #53b175;
  background: ${({ $active }) => ($active ? "#53b175" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#272727")};
  font-family: "Paperlogy";
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

const CurrentLocationButton = styled.button`
  position: absolute;
  right: 24px;
  top: 180px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.18);
  z-index: 10;
  cursor: pointer;
  font-size: 24px;
  color: #666;
`;

const BottomSheet = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 88px;
  height: ${({ $height }) => $height}px;
  background: #fff;
  border-radius: 24px 24px 0 0;
  padding: 14px 14px 16px;
  z-index: 10;
  overflow-y: auto;
  transition: none;
`;

const Handle = styled.div`
  width: 132px;
  height: 6px;
  border-radius: 10px;
  background: #d9d9d9;
  margin: 0 auto 28px;

  cursor: pointer;
`;

const SheetTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Paperlogy";
  font-size: 18px;
  font-weight: 700;
  color: #272727;
  margin-bottom: 24px;
`;

const GreenText = styled.span`
  color: #53b175;
`;

const PlaceCard = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 10px;
  margin-bottom: 14px;
  border: 1px solid
    ${({ $selected }) => ($selected ? "#53b175" : "transparent")};
  border-radius: 16px;
  background: ${({ $selected }) => ($selected ? "#f0faf4" : "transparent")};
  cursor: pointer;
`;

const Thumbnail = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f4f7f4;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
`;

const PlaceInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PlaceName = styled.p`
  font-family: "Paperlogy";
  font-size: 15px;
  font-weight: ${({ $selected }) => ($selected ? 800 : 700)};
  color: ${({ $selected }) => ($selected ? "#53b175" : "#272727")};
  margin: 0;
  text-align: left;
`;

const PlaceDesc = styled.p`
  font-family: "Paperlogy";
  font-size: 12px;
  color: #959595;
  line-height: 1.4;
  text-align: left;
  white-space: normal;
  word-break: keep-all;
  margin-top: 6px;
  text-align: left;
`;

const Distance = styled.span`
  color: #53b175;
  font-weight: 700;
`;

const SelectedBadge = styled.span`
  display: inline-flex;
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #53b175;
  color: #fff;
  font-family: "Paperlogy";
  font-size: 11px;
  font-weight: 700;
`;

const BookmarkButton = styled.button`
  border: none;
  background: transparent;
  color: #53b175;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
`;
const FloatingCard = styled.div`
  position: absolute;
  left: 12px; /* 24px → 12px */
  right: 12px; /* 24px → 12px */
  bottom: 140px;
  z-index: 10;
  background: #fff;
  border-radius: 18px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  cursor: pointer;
`;

const EmptyText = styled.p`
  font-family: "Paperlogy";
  font-size: 13px;
  color: #959595;
  text-align: center;
  padding: 20px 0;
`;
const MiniSheet = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 88px;

  height: 42px;
  background: #fff;
  border-radius: 24px 24px 0 0;

  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const MiniHandle = styled.div`
  width: 132px;
  height: 6px;
  border-radius: 10px;
  background: #d9d9d9;
`;
const ReportButton = styled.button`
  margin-top: 12px;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  background: #53b175;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const DEFAULT_POSITION = {
  latitude: 37.4604,
  longitude: 126.9188,
};
const DEFAULT_DISTRICT = "관악구";

const isLocationAllowed = () =>
  localStorage.getItem("locationAllowed") === "true";

const getPlaceLatitude = (place) =>
  Number(place.latitude ?? place.lat ?? place.y ?? place.mapY);

const getPlaceLongitude = (place) =>
  Number(place.longitude ?? place.lng ?? place.lon ?? place.x ?? place.mapX);

const normalizePlacesResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.places)) return data.places;

  return [];
};

const getDistanceMeters = (from, to) => {
  const lat1 = Number(from.latitude);
  const lon1 = Number(from.longitude);
  const lat2 = getPlaceLatitude(to);
  const lon2 = getPlaceLongitude(to);

  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) {
    return Number.POSITIVE_INFINITY;
  }

  const earthRadius = 6371000;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (meters) => {
  if (!Number.isFinite(meters)) return null;
  if (meters < 1000) return `${Math.round(meters)}m`;

  return `${(meters / 1000).toFixed(1)}km`;
};

const getPlaceUniqueKey = (place) => {
  const address = place.address || place.roadAddress || place.addressName;

  if (address) {
    return address.replace(/\s+/g, " ").trim();
  }

  return `${place.name || "place"}-${place.latitude}-${place.longitude}`;
};

const getPlaceDistrict = (place) => {
  const districtFields = [
    place.address,
    place.roadAddress,
    place.addressName,
    place.district,
    place.placeDistrict,
    place.name,
  ];

  for (const field of districtFields) {
    const district = String(field || "").match(/[가-힣]+구/)?.[0] || "";

    if (district) return district;
  }

  return "";
};

const getPlacesByDistance = (placeList, position) =>
  placeList
    .map((place) => {
      const distanceMeters = getDistanceMeters(position, place);

      return {
        ...place,
        latitude: getPlaceLatitude(place),
        longitude: getPlaceLongitude(place),
        distanceMeters,
        distance: formatDistance(distanceMeters),
      };
    })
    .filter(
      (place) =>
        Number.isFinite(place.latitude) &&
        Number.isFinite(place.longitude) &&
        Number.isFinite(place.distanceMeters),
    )
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .filter((place, index, sortedPlaces) => {
      const key = getPlaceUniqueKey(place);

      return (
        sortedPlaces.findIndex((item) => getPlaceUniqueKey(item) === key) ===
        index
      );
    });

const getSavedBookmarks = () => {
  try {
    return JSON.parse(localStorage.getItem("bookmarkedPlaces")) || [];
  } catch {
    return [];
  }
};

const CATEGORIES = [
  "분리수거함",
  "길거리 쓰레기통",
  "의류수거함",
  "폐형광등, 폐건전지 수거함",
  "폐의약품",
  "북마크",
];
const CATEGORY_TYPE_MAP = {
  분리수거함: "RECYCLE",
  "길거리 쓰레기통": "TRASH",
  의류수거함: "CLOTHES",
  "폐형광등, 폐건전지 수거함": "BATTERY",
  폐의약품: "MEDICINE",
};

const PLACE_TYPE_IMAGE_MAP = {
  TRASH: TrashImg,
  CLOTHES: ClothesImg,
  BATTERY: BatteryImg,
  RECYCLE: RecycleImg,
  MEDICINE: MedicineImg,
};

const getPlaceType = (place, fallbackCategory = "") =>
  place.placeType ||
  CATEGORY_TYPE_MAP[place.bookmarkedCategory] ||
  CATEGORY_TYPE_MAP[fallbackCategory] ||
  "RECYCLE";

const getPlaceImage = (place, category) =>
  PLACE_TYPE_IMAGE_MAP[getPlaceType(place, category)] || RecycleImg;

const getDisplayCategory = (place, activeCategory) =>
  activeCategory === "북마크"
    ? place.bookmarkedCategory || "북마크"
    : activeCategory;

const getBookmarkKey = (place) => String(place.id ?? getPlaceUniqueKey(place));

const MapPage = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerListRef = useRef([]);
  const markerPlacesRef = useRef([]);
  const placeRequestIdRef = useRef(0);
  const lastGpsPositionRef = useRef(null);
  const lastGpsDistrictRef = useRef("");

  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [places, setPlaces] = useState([]);
  const [placeLoadError, setPlaceLoadError] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [bookmarks, setBookmarks] = useState(getSavedBookmarks);
  const [activeCategory, setActiveCategory] = useState("분리수거함");
  const [currentPosition, setCurrentPosition] = useState(DEFAULT_POSITION);
  const [currentDistrict, setCurrentDistrict] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(isLocationAllowed());
  const [isSearchMode, setIsSearchMode] = useState(false);
  const DEFAULT_SHEET_HEIGHT = 250;
  const [sheetHeight, setSheetHeight] = useState(DEFAULT_SHEET_HEIGHT);
  const sheetStartHeight = useRef(DEFAULT_SHEET_HEIGHT);
  const dragStartY = useRef(null);
  const clearMarkers = () => {
    markerListRef.current.forEach((marker) => marker.setMap(null));
    markerListRef.current = [];
  };

  const resetPlaceState = () => {
    placeRequestIdRef.current += 1;
    setPlaces([]);
    setSelectedPlace(null);
    setSelectedPlaceId(null);
    markerPlacesRef.current = [];
    clearMarkers();
  };

  const getSelectedMarkerImage = () =>
    new window.kakao.maps.MarkerImage(
      "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2242%22%20height%3D%2252%22%20viewBox%3D%220%200%2042%2052%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M21%2051C21%2051%2039%2032.682%2039%2020.824C39%2010.595%2030.941%202%2021%202C11.059%202%203%2010.595%203%2020.824C3%2032.682%2021%2051%2021%2051Z%22%20fill%3D%22%2353B175%22%20stroke%3D%22white%22%20stroke-width%3D%224%22/%3E%3Ccircle%20cx%3D%2221%22%20cy%3D%2220%22%20r%3D%228%22%20fill%3D%22white%22/%3E%3C/svg%3E",
      new window.kakao.maps.Size(42, 52),
      { offset: new window.kakao.maps.Point(21, 52) },
    );

  function moveToPlace(place, shouldCollapseSheet = false) {
    setSelectedPlace(place);
    setSelectedPlaceId(place.id);
    setIsOpen(!shouldCollapseSheet);
    addPlaceMarkers(markerPlacesRef.current, place.id);

    if (!mapInstanceRef.current || !window.kakao) return;

    const movePosition = new window.kakao.maps.LatLng(
      place.latitude,
      place.longitude,
    );

    mapInstanceRef.current.panTo(movePosition);
  }

  const addPlaceMarkers = (
    placeList,
    nextSelectedPlaceId = selectedPlaceId,
  ) => {
    if (!mapInstanceRef.current || !window.kakao) return;

    clearMarkers();
    const selectedMarkerImage = getSelectedMarkerImage();

    placeList.forEach((place) => {
      const markerPosition = new window.kakao.maps.LatLng(
        place.latitude,
        place.longitude,
      );

      const marker = new window.kakao.maps.Marker({
        map: mapInstanceRef.current,
        position: markerPosition,
        image:
          place.id === nextSelectedPlaceId ? selectedMarkerImage : undefined,
      });

      markerListRef.current.push(marker);

      window.kakao.maps.event.addListener(marker, "click", () => {
        moveToPlace(place, true);
      });
    });
  };

  async function getDistrictFromCoordinates(latitude, longitude) {
    return new Promise((resolve) => {
      if (!window.kakao?.maps?.services) {
        resolve("");
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
        if (
          status !== window.kakao.maps.services.Status.OK ||
          !result?.length
        ) {
          resolve("");
          return;
        }

        const region =
          result.find((item) => item.region_type === "B") || result[0];

        resolve(region?.region_2depth_name || "");
      });
    });
  }

  async function fetchPlaces(
    latitude,
    longitude,
    category = activeCategory,
    district = currentDistrict,
  ) {
    let requestId = 0;

    try {
      setPlaceLoadError("");
      resetPlaceState();
      requestId = placeRequestIdRef.current;

      const type = CATEGORY_TYPE_MAP[category];
      if (!type) return;

      const data = normalizePlacesResponse(
        await getPlaces({
          type,
          latitude,
          longitude,
          district,
        }),
      ).map((place) => ({
        ...place,
        placeType: place.placeType || type,
      }));

      if (requestId !== placeRequestIdRef.current) return;

      const sortedPlaces = getPlacesByDistance(data, {
        latitude,
        longitude,
      });
      const topPlaces = sortedPlaces.slice(0, 3);

      const detectedDistrict =
        district ||
        data.find((place) => place.district)?.district ||
        data.map(getPlaceDistrict).find(Boolean) ||
        "";

      setCurrentDistrict(detectedDistrict);
      setPlaces(topPlaces);
      setSelectedPlace(null);
      setSelectedPlaceId(null);
      markerPlacesRef.current = sortedPlaces;

      if (sortedPlaces.length === 0) {
        resetPlaceState();
        return;
      }

      addPlaceMarkers(sortedPlaces, null);
    } catch (error) {
      if (requestId !== placeRequestIdRef.current) return;

      console.error("장소 조회 실패:", error);
      resetPlaceState();
      setPlaceLoadError("장소 정보를 불러오지 못했습니다.");
    }
  }

  function fetchBookmarkedPlaces(latitude, longitude) {
    setPlaceLoadError("");
    resetPlaceState();

    const savedBookmarks = getSavedBookmarks();
    setBookmarks(savedBookmarks);

    const sortedBookmarks = getPlacesByDistance(savedBookmarks, {
      latitude,
      longitude,
    });

    clearMarkers();
    markerPlacesRef.current = sortedBookmarks;

    setCurrentDistrict("");
    setPlaces(sortedBookmarks);
    setSelectedPlace(null);
    setSelectedPlaceId(null);

    if (sortedBookmarks.length === 0) {
      resetPlaceState();
      return;
    }

    addPlaceMarkers(sortedBookmarks, null);
  }

  const resetPlacesForLocationOff = () => {
    setLocationEnabled(false);
    setIsSearchMode(false);
    setCurrentPosition(DEFAULT_POSITION);
    setCurrentDistrict(DEFAULT_DISTRICT);
    setPlaceLoadError("");
    resetPlaceState();

    if (activeCategory === "북마크") {
      fetchBookmarkedPlaces(
        DEFAULT_POSITION.latitude,
        DEFAULT_POSITION.longitude,
      );
      return;
    }

    fetchPlaces(
      DEFAULT_POSITION.latitude,
      DEFAULT_POSITION.longitude,
      activeCategory,
      DEFAULT_DISTRICT,
    );
  };

  useEffect(() => {
    const handleLocationPermissionChange = () => {
      const nextLocationEnabled = isLocationAllowed();

      setLocationEnabled(nextLocationEnabled);

      if (!nextLocationEnabled) {
        resetPlacesForLocationOff();
      }
    };

    window.addEventListener(
      "reco-location-permission-change",
      handleLocationPermissionChange,
    );
    window.addEventListener("storage", handleLocationPermissionChange);

    return () => {
      window.removeEventListener(
        "reco-location-permission-change",
        handleLocationPermissionChange,
      );
      window.removeEventListener("storage", handleLocationPermissionChange);
    };
  }, []);

  const moveToCurrentLocation = () => {
    if (!isLocationAllowed()) {
      setLocationEnabled(false);
      setIsSearchMode(false);
      alert("마이페이지에서 위치 정보 허용을 켜주세요.");
      return;
    }

    setLocationEnabled(true);
    setIsSearchMode(false);
    setKeyword("");

    const cachedPosition = lastGpsPositionRef.current;
    const cachedDistrict = lastGpsDistrictRef.current;

    if (cachedPosition) {
      resetPlaceState();
      setIsOpen(true);
      setSheetHeight(DEFAULT_SHEET_HEIGHT);
      setCurrentPosition(cachedPosition);
      setCurrentDistrict(cachedDistrict);

      const cachedMovePosition = new window.kakao.maps.LatLng(
        cachedPosition.latitude,
        cachedPosition.longitude,
      );

      mapInstanceRef.current.setCenter(cachedMovePosition);
      mapInstanceRef.current.setLevel(4);

      if (activeCategory === "북마크") {
        fetchBookmarkedPlaces(cachedPosition.latitude, cachedPosition.longitude);
      } else {
        fetchPlaces(
          cachedPosition.latitude,
          cachedPosition.longitude,
          activeCategory,
          cachedDistrict,
        );
      }
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        resetPlaceState();
        setIsOpen(true);
        setSheetHeight(DEFAULT_SHEET_HEIGHT);

        const nextPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCurrentPosition(nextPosition);

        const movePosition = new window.kakao.maps.LatLng(
          nextPosition.latitude,
          nextPosition.longitude,
        );

        mapInstanceRef.current.setCenter(movePosition);
        mapInstanceRef.current.setLevel(4);

        const district = await getDistrictFromCoordinates(
          nextPosition.latitude,
          nextPosition.longitude,
        );

        lastGpsPositionRef.current = nextPosition;
        lastGpsDistrictRef.current = district;

        setCurrentDistrict(district);

        if (activeCategory === "북마크") {
          fetchBookmarkedPlaces(nextPosition.latitude, nextPosition.longitude);
          return;
        }

        fetchPlaces(
          nextPosition.latitude,
          nextPosition.longitude,
          activeCategory,
          district,
        );
      },
      () => {
        alert("현재 위치를 가져올 수 없습니다.");
      },
      {
        enableHighAccuracy: false,
        maximumAge: Infinity,
        timeout: 3000,
      },
    );
  };

  const toggleBookmark = (place) => {
    const placeKey = getBookmarkKey(place);
    const isAlreadyBookmarked = bookmarks.some(
      (item) => getBookmarkKey(item) === placeKey,
    );
    const placeWithCategory = {
      ...place,
      bookmarkedCategory: place.bookmarkedCategory || activeCategory,
      placeType: getPlaceType(place, activeCategory),
    };

    const nextBookmarks = isAlreadyBookmarked
      ? bookmarks.filter((item) => getBookmarkKey(item) !== placeKey)
      : [...bookmarks, placeWithCategory];

    setBookmarks(nextBookmarks);
    localStorage.setItem("bookmarkedPlaces", JSON.stringify(nextBookmarks));

    if (activeCategory === "북마크") {
      const sortedBookmarks = getPlacesByDistance(nextBookmarks, {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      });

      clearMarkers();
      markerPlacesRef.current = sortedBookmarks;

      setCurrentDistrict("");
      setPlaces(sortedBookmarks);
      setSelectedPlace(null);
      setSelectedPlaceId(null);

      if (sortedBookmarks.length === 0) {
        clearMarkers();
        markerPlacesRef.current = [];
        return;
      }

      addPlaceMarkers(sortedBookmarks, null);
    }
  };

  const isBookmarked = (place) => {
    const placeKey = getBookmarkKey(place);

    return bookmarks.some((item) => getBookmarkKey(item) === placeKey);
  };

  useEffect(() => {
    let kakaoMapKey;

    try {
      kakaoMapKey = getRequiredEnv("VITE_KAKAO_MAP_KEY");
    } catch (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    const loadMap = () => {
      window.kakao.maps.load(() => {
        const createMap = async (positionData, shouldFetchPlaces = true) => {
          const center = new window.kakao.maps.LatLng(
            positionData.latitude,
            positionData.longitude,
          );

          const map = new window.kakao.maps.Map(mapRef.current, {
            center,
            level: 4,
          });

          mapInstanceRef.current = map;
          setCurrentPosition(positionData);

          if (shouldFetchPlaces) {
            const district = await getDistrictFromCoordinates(
              positionData.latitude,
              positionData.longitude,
            );

            lastGpsDistrictRef.current = district;
            setCurrentDistrict(district);

            fetchPlaces(
              positionData.latitude,
              positionData.longitude,
              activeCategory,
              district,
            );
          }
        };

        if (!isLocationAllowed()) {
          setLocationEnabled(false);
          setIsSearchMode(false);
          createMap(DEFAULT_POSITION, true);
          // resetPlacesForLocationOff();
          return;
        }

        setLocationEnabled(true);
        setIsSearchMode(false);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const positionData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            lastGpsPositionRef.current = positionData;
            createMap(positionData);
          },
          () => {
            setLocationEnabled(false);
            setIsSearchMode(false);
            createMap(DEFAULT_POSITION);
          },
        );
      });
    };

    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com/v2/maps/sdk.js"]',
    );

    if (existingScript) {
      const checkKakaoLoaded = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakaoLoaded);
          loadMap();
        }
      }, 100);

      return () => {
        clearInterval(checkKakaoLoaded);
        clearMarkers();
      };
    }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = loadMap;
    document.head.appendChild(script);

    return () => {
      clearMarkers();
    };
  }, []);

  const handleCategoryClick = async (category) => {
    setActiveCategory(category);
    setIsOpen(true);
    setSheetHeight(DEFAULT_SHEET_HEIGHT);
    resetPlaceState();

    if (!isLocationAllowed() && !isSearchMode) {
      setLocationEnabled(false);

      if (category === "북마크") {
        await fetchBookmarkedPlaces(
          DEFAULT_POSITION.latitude,
          DEFAULT_POSITION.longitude,
        );
        return;
      }

      fetchPlaces(
        DEFAULT_POSITION.latitude,
        DEFAULT_POSITION.longitude,
        category,
        DEFAULT_DISTRICT,
      );
      return;
    }

    setLocationEnabled(true);

    if (category === "북마크") {
      await fetchBookmarkedPlaces(
        currentPosition.latitude,
        currentPosition.longitude,
      );
      return;
    }

    fetchPlaces(
      currentPosition.latitude,
      currentPosition.longitude,
      category,
      currentDistrict,
    );
  };

  const handleDragStart = (e) => {
    dragStartY.current = e.touches ? e.touches[0].clientY : e.clientY;
    sheetStartHeight.current = sheetHeight;
  };

  const handleDragMove = (e) => {
    if (dragStartY.current === null) return;

    e.preventDefault();

    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const diff = dragStartY.current - currentY;

    const nextHeight = sheetStartHeight.current + diff;

    setSheetHeight(Math.min(Math.max(nextHeight, 120), 560));
  };

  const handleDragEnd = () => {
    if (sheetHeight < 220 && places.length > 0) {
      setIsOpen(false);
    }

    dragStartY.current = null;
  };
  const handleSearch = () => {
    if (!keyword.trim()) return;

    if (!window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, async (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resetPlaceState();
        setIsOpen(true);
        setSheetHeight(DEFAULT_SHEET_HEIGHT);

        const place = data[0];
        const searchedPosition = {
          latitude: Number(place.y),
          longitude: Number(place.x),
        };
        const searchedDistrict =
          getPlaceDistrict({
            address: place.address_name,
            roadAddress: place.road_address_name,
            name: place.place_name,
          }) || "";

        const movePosition = new window.kakao.maps.LatLng(
          searchedPosition.latitude,
          searchedPosition.longitude,
        );

        setLocationEnabled(true);
        setIsSearchMode(true);
        setCurrentPosition(searchedPosition);
        setCurrentDistrict(searchedDistrict);
        mapInstanceRef.current.panTo(movePosition);
        mapInstanceRef.current.setLevel(4);

        if (activeCategory === "북마크") {
          await fetchBookmarkedPlaces(
            searchedPosition.latitude,
            searchedPosition.longitude,
          );
          return;
        }

        await fetchPlaces(
          searchedPosition.latitude,
          searchedPosition.longitude,
          activeCategory,
          searchedDistrict,
        );
      } else {
        alert("검색 결과가 없습니다.");
      }
    });
  };

  return (
    <Container>
      <MapBox ref={mapRef} />

      <SearchBox>
        <SearchInput
          value={keyword}
          placeholder="위치를 입력하세요"
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <SearchImg src={SearchIcon} alt="검색" onClick={handleSearch} />
      </SearchBox>

      <CategoryScroll>
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category}
            type="button"
            $active={activeCategory === category}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryScroll>

      <CurrentLocationButton type="button" onClick={moveToCurrentLocation}>
        ⌖
      </CurrentLocationButton>

      {isOpen ? (
        <BottomSheet $height={sheetHeight}>
          <Handle
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          />

          <SheetTitle>
            <div>
              {activeCategory === "북마크" ? (
                `북마크한 장소 (${bookmarks.length})`
              ) : (
                <>
                  근처 {activeCategory} <GreenText>TOP3</GreenText>
                </>
              )}
            </div>
          </SheetTitle>

          {places.length > 0 ? (
            places.map((place) => {
              const displayCategory = getDisplayCategory(place, activeCategory);

              return (
                <PlaceCard
                  key={getBookmarkKey(place)}
                  $selected={selectedPlaceId === place.id}
                  onClick={() => moveToPlace(place)}
                >
                  <Thumbnail>
                    <img
                      src={getPlaceImage(place, activeCategory)}
                      alt={displayCategory}
                    />
                  </Thumbnail>

                  <PlaceInfo>
                    <PlaceName $selected={selectedPlaceId === place.id}>
                      {getPlaceDistrict(place)
                        ? `${getPlaceDistrict(place)} ${displayCategory}`
                        : place.name || displayCategory}
                    </PlaceName>
                    {selectedPlaceId === place.id && (
                      <SelectedBadge>현재 선택된 장소</SelectedBadge>
                    )}

                    <PlaceDesc>
                      {place.distance && (
                        <>
                          현재 위치에서 <Distance>{place.distance}</Distance>
                          <br />
                        </>
                      )}
                      {place.address || place.name || "위치 정보가 없습니다."}
                    </PlaceDesc>
                  </PlaceInfo>

                  <BookmarkButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(place);
                    }}
                  >
                    {isBookmarked(place) ? "★" : "☆"}
                  </BookmarkButton>
                </PlaceCard>
              );
            })
          ) : (
            <>
              <EmptyText>
                {activeCategory === "북마크"
                  ? "북마크한 장소가 없어요"
                  : placeLoadError
                    ? placeLoadError
                    : !locationEnabled
                      ? "마이페이지에서 위치 정보 허용을 켜주세요."
                      : currentDistrict
                        ? isSearchMode
                          ? `${currentDistrict}에는 정보를 제공하지 않습니다.`
                          : `현재 위치한 ${currentDistrict}에는 정보를 제공하지 않습니다.`
                        : "현재 위치한 구의 정보는 제공되지 않습니다."}
              </EmptyText>
              {locationEnabled && activeCategory !== "북마크" && (
                <ReportButton onClick={() => navigate("/report-location")}>
                  위치 제보하기
                </ReportButton>
              )}
            </>
          )}
        </BottomSheet>
      ) : (
        <>
          <MiniSheet
            onClick={() => {
              setSheetHeight(DEFAULT_SHEET_HEIGHT);
              setIsOpen(true);
            }}
          >
            <MiniHandle />
          </MiniSheet>

          {selectedPlace && (
            <FloatingCard onClick={() => setIsOpen(true)}>
              <Thumbnail>
                <img
                  src={getPlaceImage(selectedPlace, activeCategory)}
                  alt={getDisplayCategory(selectedPlace, activeCategory)}
                />
              </Thumbnail>
              <PlaceInfo>
                <PlaceName>{selectedPlace.name}</PlaceName>
                <PlaceDesc>
                  {selectedPlace.distance && (
                    <>
                      지금 내가 있는 곳에서{" "}
                      <Distance>{selectedPlace.distance}</Distance> 떨어진 곳에
                      있어요
                      <br />
                    </>
                  )}
                  {selectedPlace.address || "주소 정보가 없습니다."}
                </PlaceDesc>
              </PlaceInfo>
              <BookmarkButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(selectedPlace);
                }}
              >
                {isBookmarked(selectedPlace) ? "★" : "☆"}
              </BookmarkButton>
            </FloatingCard>
          )}
        </>
      )}

      <BottomNavComponent />
    </Container>
  );
};

export default MapPage;

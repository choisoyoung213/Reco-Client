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
  border: 1px solid ${({ $selected }) => ($selected ? "#53b175" : "transparent")};
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
  background: #53B175;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const DEFAULT_POSITION = {
  latitude: 37.4604,
  longitude: 126.9188,
};

const isLocationAllowed = () =>
  localStorage.getItem("locationAllowed") === "true";

const getPlaceLatitude = (place) =>
  Number(place.latitude ?? place.lat ?? place.y);

const getPlaceLongitude = (place) =>
  Number(place.longitude ?? place.lng ?? place.lon ?? place.x);

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
  const address = place.address || place.roadAddress || place.addressName || "";
  const addressDistrict = address.match(/[가-힣]+구/)?.[0] || "";

  if (addressDistrict) return addressDistrict;
  if (place.district?.endsWith("구")) return place.district;

  return place.placeDistrict || "";
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
};
const getCategoryImage = (category) => {
  switch (category) {
    case "길거리 쓰레기통":
      return TrashImg;

    case "의류수거함":
      return ClothesImg;

    case "폐형광등, 폐건전지 수거함":
      return BatteryImg;

    case "분리수거함":
      return RecycleImg;

    case "폐의약품":
      return MedicineImg;

    default:
      return RecycleImg;
  }
};

const MapPage = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerListRef = useRef([]);
  const districtCacheRef = useRef(new Map());
  const regionLookupUnavailableRef = useRef(false);

  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("분리수거함");
  const [currentPosition, setCurrentPosition] = useState(DEFAULT_POSITION);
  const [currentDistrict, setCurrentDistrict] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(isLocationAllowed());
  const DEFAULT_SHEET_HEIGHT = 250;
  const [sheetHeight, setSheetHeight] = useState(DEFAULT_SHEET_HEIGHT);
  const sheetStartHeight = useRef(DEFAULT_SHEET_HEIGHT);
  const dragStartY = useRef(null);
  const clearMarkers = () => {
    markerListRef.current.forEach((marker) => marker.setMap(null));
    markerListRef.current = [];
  };

  const resetPlacesForLocationOff = () => {
    setLocationEnabled(false);
    setCurrentPosition(DEFAULT_POSITION);
    setCurrentDistrict("");
    setPlaces([]);
    setSelectedPlace(null);
    setSelectedPlaceId(null);
    clearMarkers();
  };

  const getSelectedMarkerImage = () =>
    new window.kakao.maps.MarkerImage(
      "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2242%22%20height%3D%2252%22%20viewBox%3D%220%200%2042%2052%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M21%2051C21%2051%2039%2032.682%2039%2020.824C39%2010.595%2030.941%202%2021%202C11.059%202%203%2010.595%203%2020.824C3%2032.682%2021%2051%2021%2051Z%22%20fill%3D%22%2353B175%22%20stroke%3D%22white%22%20stroke-width%3D%224%22/%3E%3Ccircle%20cx%3D%2221%22%20cy%3D%2220%22%20r%3D%228%22%20fill%3D%22white%22/%3E%3C/svg%3E",
      new window.kakao.maps.Size(42, 52),
      { offset: new window.kakao.maps.Point(21, 52) },
    );

  const addPlaceMarkers = (placeList, nextSelectedPlaceId = selectedPlaceId) => {
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
        image: place.id === nextSelectedPlaceId ? selectedMarkerImage : undefined,
      });

      markerListRef.current.push(marker);

      window.kakao.maps.event.addListener(marker, "click", () => {
        moveToPlace(place, true);
      });
    });
  };

  useEffect(() => {
    const savedBookmarks =
      JSON.parse(localStorage.getItem("bookmarkedPlaces")) || [];

    setBookmarks(savedBookmarks);
  }, []);

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

  const getCurrentDistrict = (latitude, longitude) =>
    new Promise((resolve) => {
      if (regionLookupUnavailableRef.current) {
        resolve("");
        return;
      }

      if (!window.kakao?.maps?.services) {
        resolve("");
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK) {
          if (status === window.kakao.maps.services.Status.ERROR) {
            regionLookupUnavailableRef.current = true;
          }

          resolve("");
          return;
        }

        const district =
          result.find((item) => item.region_type === "B")?.region_2depth_name ||
          result[0]?.region_2depth_name ||
          "";

        resolve(district);
      });
    });

  const getDistrictByCoords = (latitude, longitude) =>
    new Promise((resolve) => {
      if (regionLookupUnavailableRef.current) {
        resolve("");
        return;
      }

      const lat = Number(latitude);
      const lon = Number(longitude);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        resolve("");
        return;
      }

      const cacheKey = `${lat.toFixed(6)},${lon.toFixed(6)}`;
      const cachedDistrict = districtCacheRef.current.get(cacheKey);

      if (cachedDistrict !== undefined) {
        resolve(cachedDistrict);
        return;
      }

      if (!window.kakao?.maps?.services) {
        resolve("");
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.coord2RegionCode(lon, lat, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK) {
          if (status === window.kakao.maps.services.Status.ERROR) {
            regionLookupUnavailableRef.current = true;
          }

          districtCacheRef.current.set(cacheKey, "");
          resolve("");
          return;
        }

        const district =
          result.find((item) => item.region_type === "B")?.region_2depth_name ||
          result[0]?.region_2depth_name ||
          "";

        districtCacheRef.current.set(cacheKey, district);
        resolve(district);
      });
    });

  const getPlaceDistrictByInfoOrCoords = async (place) => {
    const knownDistrict = getPlaceDistrict(place);

    if (knownDistrict) return knownDistrict;

    return getDistrictByCoords(
      getPlaceLatitude(place),
      getPlaceLongitude(place),
    );
  };

  const getPlacesInDistrict = async (placeList, district) => {
    if (!district) return placeList;

    const placesWithDistrict = await Promise.all(
      placeList.map(async (place) => ({
        ...place,
        placeDistrict: await getPlaceDistrictByInfoOrCoords(place),
      })),
    );

    return placesWithDistrict.filter(
      (place) => getPlaceDistrict(place) === district,
    );
  };

  const fetchPlaces = async (latitude, longitude, category = activeCategory) => {
    try {
      if (category === "폐의약품") {
        alert("폐의약품 수거함은 준비 중입니다.");
        return;
      }

      const type = CATEGORY_TYPE_MAP[category];
      if (!type) return;

      const data = await getPlaces(type);
      const district = await getCurrentDistrict(latitude, longitude);
      const districtPlaces = await getPlacesInDistrict(data, district);
      const sortedPlaces = getPlacesByDistance(districtPlaces, {
        latitude,
        longitude,
      });
      const topPlaces = sortedPlaces.slice(0, 3);

      setCurrentDistrict(district);
      setPlaces(topPlaces);
      setSelectedPlace(null);
      setSelectedPlaceId(null);

      if (topPlaces.length === 0) {
        clearMarkers();
        return;
      }

      addPlaceMarkers(topPlaces, null);
    } catch (error) {
      console.error("장소 조회 실패:", error);
    }
  };

  const fetchBookmarkedPlaces = async (latitude, longitude) => {
    const district = await getCurrentDistrict(latitude, longitude);
    const districtBookmarks = await getPlacesInDistrict(bookmarks, district);
    const sortedBookmarks = getPlacesByDistance(districtBookmarks, {
      latitude,
      longitude,
    });
    const topBookmarks = sortedBookmarks.slice(0, 3);

    setCurrentDistrict(district);
    setPlaces(topBookmarks);
    setSelectedPlace(null);
    setSelectedPlaceId(null);

    if (topBookmarks.length === 0) {
      clearMarkers();
      return;
    }

    addPlaceMarkers(topBookmarks, null);
  };

  const moveToCurrentLocation = () => {
    if (!isLocationAllowed()) {
      setLocationEnabled(false);
      alert("마이페이지에서 위치 정보 허용을 켜주세요.");
      return;
    }

    setLocationEnabled(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setCurrentPosition(nextPosition);

        const movePosition = new window.kakao.maps.LatLng(
          nextPosition.latitude,
          nextPosition.longitude,
        );

        mapInstanceRef.current.panTo(movePosition);

        setTimeout(() => {
          mapInstanceRef.current.setLevel(4);
        }, 300);

        if (activeCategory === "북마크") {
          fetchBookmarkedPlaces(nextPosition.latitude, nextPosition.longitude);
          return;
        }

        fetchPlaces(nextPosition.latitude, nextPosition.longitude);
      },
      () => {
        alert("현재 위치를 가져올 수 없습니다.");
      },
    );
  };

  const toggleBookmark = (place) => {
    const isAlreadyBookmarked = bookmarks.some((item) => item.id === place.id);

    const nextBookmarks = isAlreadyBookmarked
      ? bookmarks.filter((item) => item.id !== place.id)
      : [...bookmarks, place];

    setBookmarks(nextBookmarks);
    localStorage.setItem("bookmarkedPlaces", JSON.stringify(nextBookmarks));
  };

  const isBookmarked = (placeId) => {
    return bookmarks.some((item) => item.id === placeId);
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
        const createMap = (positionData, shouldFetchPlaces = true) => {
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
            fetchPlaces(positionData.latitude, positionData.longitude);
          }
        };

        if (!isLocationAllowed()) {
          setLocationEnabled(false);
          createMap(DEFAULT_POSITION, false);
          resetPlacesForLocationOff();
          return;
        }

        setLocationEnabled(true);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const positionData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            createMap(positionData);
          },
          () => {
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

    if (!isLocationAllowed()) {
      setLocationEnabled(false);
      resetPlacesForLocationOff();
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

    fetchPlaces(currentPosition.latitude, currentPosition.longitude, category);
  };

  const moveToPlace = (place, shouldCollapseSheet = false) => {
    setSelectedPlace(place);
    setSelectedPlaceId(place.id);
    setIsOpen(!shouldCollapseSheet);
    addPlaceMarkers(places, place.id);

    if (!mapInstanceRef.current || !window.kakao) return;

    const movePosition = new window.kakao.maps.LatLng(
      place.latitude,
      place.longitude,
    );

    mapInstanceRef.current.panTo(movePosition);
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
    if (sheetHeight < 220) {
      setIsOpen(false);
    }

    dragStartY.current = null;
  };
  const handleSearch = () => {
    if (!keyword.trim()) return;

    if (!window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const place = data[0];

        const movePosition = new window.kakao.maps.LatLng(
          Number(place.y),
          Number(place.x),
        );

        mapInstanceRef.current.panTo(movePosition);

        setTimeout(() => {
          mapInstanceRef.current.setLevel(3);
        }, 300);
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
                "북마크한 장소"
              ) : (
                <>
                  근처 {activeCategory} <GreenText>TOP3</GreenText>
                </>
              )}
            </div>
          </SheetTitle>

          {places.length > 0 ? (
            places.map((place) => (
              <PlaceCard
                key={place.id}
                $selected={selectedPlaceId === place.id}
                onClick={() => moveToPlace(place)}
              >
                <Thumbnail>
                  <img
                    src={getCategoryImage(activeCategory)}
                    alt={activeCategory}
                  />
                </Thumbnail>

                <PlaceInfo>
                  <PlaceName $selected={selectedPlaceId === place.id}>
                    {getPlaceDistrict(place)
                      ? `${getPlaceDistrict(place)} ${activeCategory}`
                      : place.name || activeCategory}
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
                  {isBookmarked(place.id) ? "★" : "☆"}
                </BookmarkButton>
              </PlaceCard>
            ))
          ) : (
            <>
            <EmptyText>
              {activeCategory === "북마크"
                ? "북마크한 장소가 없어요"
                : !locationEnabled
                  ? "마이페이지에서 위치 정보 허용을 켜주세요."
                : currentDistrict
                  ? `현재 위치한 ${currentDistrict}에는 정보를 제공하지 않습니다.`
                  : "가까운 분리배출 장소를 불러오는 중이에요"}
            </EmptyText>
            {locationEnabled && currentDistrict && activeCategory !== "북마크" && (
            <ReportButton
              onClick={() => navigate("/report-location")}
            >
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
                  src={getCategoryImage(activeCategory)}
                  alt={activeCategory}
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
                {isBookmarked(selectedPlace.id) ? "★" : "☆"}
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

import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import BottomNavComponent from "../components/BottomNav"
import SearchIcon from "../assets/img/search.svg"

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #fff;
`

const MapBox = styled.div`
  width: 100%;
  height: 100vh;
  background: #eee;
`

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
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-family: 'Paperlogy';
  font-size: 15px;
  color: #272727;

  &::placeholder {
    color: #b8b8b8;
  }
`

const SearchImg = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`

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
`

const CategoryButton = styled.button`
  flex-shrink: 0;
  height: 35px;
  padding: 0 15px;
  border-radius: 15px;
  border: 1px solid #53b175;
  background: ${({ $active }) => ($active ? "#53b175" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#272727")};
  font-family: 'Paperlogy';
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`

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
`

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
`

const Handle = styled.div`
  width: 132px;
  height: 6px;
  border-radius: 10px;
  background: #d9d9d9;
  margin: 0 auto 28px;

  cursor: pointer;
`

const SheetTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Paperlogy';
  font-size: 18px;
  font-weight: 700;
  color: #272727;
  margin-bottom: 24px;
`

const GreenText = styled.span`
  color: #53b175;
`

const PlaceCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 10px;
  border: 1px solid #eeeeee;
  border-radius: 18px;
  margin-bottom: 14px;
  background: #fff;
  cursor: pointer;
`

const Thumbnail = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background: #d9d9d9;
  flex-shrink: 0;
`

const PlaceInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0px;
`

const PlaceName = styled.p`
  font-family: 'Paperlogy';
  font-size: 15px;
  font-weight: 700;
  color: #272727;
`

const PlaceDesc = styled.p`
   font-family: 'Paperlogy';
  font-size: 11px;
  color: #959595;
  line-height: 1.5; 
  white-space: nowrap;
  text-align: left;
`

const Distance = styled.span`
  color: #53b175;
  font-weight: 700;
`

const BookmarkButton = styled.button`
  border: none;
  background: transparent;
  color: #53b175;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
`
const FloatingCard = styled.div`
  position: absolute;
  left: 12px;   /* 24px → 12px */
  right: 12px;  /* 24px → 12px */
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
`

const EmptyText = styled.p`
  font-family: 'Paperlogy';
  font-size: 13px;
  color: #959595;
  text-align: center;
  padding: 20px 0;
`
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
`

const MiniHandle = styled.div`
  width: 132px;
  height: 6px;
  border-radius: 10px;
  background: #d9d9d9;
`
const DEFAULT_POSITION = {
  latitude: 37.4604,
  longitude: 126.9188,
}

const CATEGORIES = [
  "분리수거함",
  "길거리 쓰레기통",
  "의류수거함",
  "폐형광등, 폐건전지 수거함",
  "폐의약품",
  "북마크"
]

const MapPage = () => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerListRef = useRef([])

  const [keyword, setKeyword] = useState("")
  const [isOpen, setIsOpen] = useState(true)
  const [places, setPlaces] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [activeCategory, setActiveCategory] = useState("분리수거함")
  const [currentPosition, setCurrentPosition] = useState(DEFAULT_POSITION)
  const DEFAULT_SHEET_HEIGHT = 250
  const [sheetHeight, setSheetHeight] = useState(DEFAULT_SHEET_HEIGHT)
  const sheetStartHeight = useRef(DEFAULT_SHEET_HEIGHT)
  const dragStartY = useRef(null)
  const clearMarkers = () => {
    markerListRef.current.forEach((marker) => marker.setMap(null))
    markerListRef.current = []
  }
  const addPlaceMarkers = (placeList) => {
    if (!mapInstanceRef.current || !window.kakao) return

    clearMarkers()

    placeList.forEach((place) => {
      const markerPosition = new window.kakao.maps.LatLng(
        place.latitude,
        place.longitude
      )

      const marker = new window.kakao.maps.Marker({
        map: mapInstanceRef.current,
        position: markerPosition,
      })

      markerListRef.current.push(marker)

      window.kakao.maps.event.addListener(marker, "click", () => {
        moveToPlace(place)
      })
    })
  }

  useEffect(() => {
    const savedBookmarks =
      JSON.parse(localStorage.getItem("bookmarkedPlaces")) || []

    setBookmarks(savedBookmarks)
  }, [])

  const fetchPlaces = async (latitude, longitude, category = activeCategory) => {
    try {
      const params = new URLSearchParams({
        latitude,
        longitude,
        category,
      })

      const res = await fetch(`/api/places?${params.toString()}`)
      const result = await res.json()

      if (result.success) {
        setPlaces(result.data)
        addPlaceMarkers(result.data)

        if (result.data.length > 0) {
          setSelectedPlace(result.data[0])
        } else {
          setSelectedPlace(null)
          clearMarkers()
        }
      }
    } catch (error) {
      console.error("분리수거함 장소 조회 실패:", error)
    }
  }

  const moveToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        setCurrentPosition(nextPosition)

        const movePosition = new window.kakao.maps.LatLng(
          nextPosition.latitude,
          nextPosition.longitude
        )

        mapInstanceRef.current.panTo(movePosition)

        setTimeout(() => {
          mapInstanceRef.current.setLevel(4)
        }, 300)

        fetchPlaces(nextPosition.latitude, nextPosition.longitude)

        fetchPlaces(
          nextPosition.latitude,
          nextPosition.longitude
        )
      },
      () => {
        alert("현재 위치를 가져올 수 없습니다.")
      }
    )
  }



  const toggleBookmark = (place) => {
    const isAlreadyBookmarked = bookmarks.some((item) => item.id === place.id)

    const nextBookmarks = isAlreadyBookmarked
      ? bookmarks.filter((item) => item.id !== place.id)
      : [...bookmarks, place]

    setBookmarks(nextBookmarks)
    localStorage.setItem("bookmarkedPlaces", JSON.stringify(nextBookmarks))
  }

  const isBookmarked = (placeId) => {
    return bookmarks.some((item) => item.id === placeId)
  }

  useEffect(() => {
    const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY

    const loadMap = () => {
      window.kakao.maps.load(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const positionData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }

            setCurrentPosition(positionData)

            const center = new window.kakao.maps.LatLng(
              positionData.latitude,
              positionData.longitude
            )

            const map = new window.kakao.maps.Map(mapRef.current, {
              center,
              level: 4,
            })

            mapInstanceRef.current = map
            fetchPlaces(positionData.latitude, positionData.longitude)
          },
          () => {
            const center = new window.kakao.maps.LatLng(
              DEFAULT_POSITION.latitude,
              DEFAULT_POSITION.longitude
            )

            const map = new window.kakao.maps.Map(mapRef.current, {
              center,
              level: 4,
            })

            mapInstanceRef.current = map
            fetchPlaces(DEFAULT_POSITION.latitude, DEFAULT_POSITION.longitude)
          }
        )
      })
    }

    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
    )

    if (existingScript) {
      const checkKakaoLoaded = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkKakaoLoaded)
          loadMap()
        }
      }, 100)

      return () => {
        clearInterval(checkKakaoLoaded)
        clearMarkers()
      }
    }
    const script = document.createElement("script")
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`
    script.async = true
    script.onload = loadMap
    document.head.appendChild(script)

    return () => {
      clearMarkers()
    }
  }, [])

  const handleCategoryClick = (category) => {
    setActiveCategory(category)

    if (category === "북마크") {
      setPlaces(bookmarks)
      setSelectedPlace(bookmarks[0] || null)
      return
    }

    fetchPlaces(currentPosition.latitude, currentPosition.longitude, category)
  }

  const moveToPlace = (place) => {
    setSelectedPlace(place)
    setIsOpen(false)

    if (!mapInstanceRef.current || !window.kakao) return

    const movePosition = new window.kakao.maps.LatLng(
      place.latitude,
      place.longitude
    )

    mapInstanceRef.current.panTo(movePosition)
  }

  const handleDragStart = (e) => {
    dragStartY.current = e.touches ? e.touches[0].clientY : e.clientY
    sheetStartHeight.current = sheetHeight
  }

  const handleDragMove = (e) => {
    if (dragStartY.current === null) return

    e.preventDefault()

    const currentY = e.touches ? e.touches[0].clientY : e.clientY
    const diff = dragStartY.current - currentY

    const nextHeight = sheetStartHeight.current + diff

    setSheetHeight(Math.min(Math.max(nextHeight, 120), 560))
  }

  const handleDragEnd = () => {
    if (sheetHeight < 220) {
      setIsOpen(false)
    }

    dragStartY.current = null
  }
  const handleSearch = () => {
    if (!keyword.trim()) return

    if (!window.kakao || !window.kakao.maps) return

    const ps = new window.kakao.maps.services.Places()

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const place = data[0]

        const movePosition = new window.kakao.maps.LatLng(
          Number(place.y),
          Number(place.x)
        )

        mapInstanceRef.current.panTo(movePosition)

        setTimeout(() => {
          mapInstanceRef.current.setLevel(3)
        }, 300)
      } else {
        alert("검색 결과가 없습니다.")
      }
    })
  }

  return (
    <Container>
      <MapBox ref={mapRef} />

      <SearchBox>
        <SearchInput
          value={keyword}
          placeholder="위치를 입력하세요"
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch()
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
            places.slice(0, 3).map((place) => (
              <PlaceCard key={place.id} onClick={() => moveToPlace(place)}>
                <Thumbnail />
                <PlaceInfo>
                  <PlaceName>{place.name}</PlaceName>
                  <PlaceDesc>
                    {place.distance && (
                      <>
                        지금 내가 있는 곳에서{" "}
                        <Distance>{place.distance}</Distance> 떨어진 곳에 있어요
                      </>
                    )}
                    <br />
                    {place.address || "주소 정보가 없습니다."}
                  </PlaceDesc>
                </PlaceInfo>
                <BookmarkButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark(place)
                  }}
                >
                  {isBookmarked(place.id) ? "★" : "☆"}
                </BookmarkButton>
              </PlaceCard>
            ))
          ) : (
            <EmptyText>
              {activeCategory === "북마크"
                ? "북마크한 장소가 없어요"
                : "가까운 분리배출 장소를 불러오는 중이에요"}
            </EmptyText>
          )}
        </BottomSheet>
      ) : (
        <>
          <MiniSheet
            onClick={() => {
              setSheetHeight(DEFAULT_SHEET_HEIGHT)
              setIsOpen(true)
            }}
          >
            <MiniHandle />
          </MiniSheet>

          {selectedPlace && (
            <FloatingCard onClick={() => setIsOpen(true)}>
              <Thumbnail />
              <PlaceInfo>
                <PlaceName>{selectedPlace.name}</PlaceName>
                <PlaceDesc>
                  {selectedPlace.distance && (
                    <>
                      지금 내가 있는 곳에서{" "}
                      <Distance>{selectedPlace.distance}</Distance> 떨어진 곳에 있어요
                      <br />
                    </>
                  )}
                  {selectedPlace.address || "주소 정보가 없습니다."}
                </PlaceDesc>
              </PlaceInfo>
              <BookmarkButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleBookmark(selectedPlace)
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
  )
}

export default MapPage
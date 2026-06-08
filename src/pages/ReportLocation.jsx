import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { getRequiredEnv } from "../config/env"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: #F5F5F5;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 24px;
  background: #fff;
  position: relative;
`

const BackButton = styled.div`
  position: absolute;
  left: 24px;
  font-size: 20px;
  cursor: pointer;
  color: #272727;
`

const Title = styled.p`
  font-family: 'Paperlogy';
  font-size: 16px;
  font-weight: 600;
  color: #272727;
`

const Section = styled.div`
  background: #fff;
  padding: 20px 24px;
  margin-bottom: 8px;
`

const SectionTitle = styled.p`
  font-family: 'Paperlogy';
  font-size: 14px;
  font-weight: 600;
  color: #272727;
  margin-bottom: 12px;
  text-align: left;
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

const CategoryItem = styled.div`
  padding: 14px;
  border-radius: 12px;
  border: ${({ $selected }) => $selected ? '2px solid #53B175' : '1px solid #E0E0E0'};
  background: ${({ $selected }) => $selected ? '#F0FAF4' : '#fff'};
  font-family: 'Paperlogy';
  font-size: 12px;
  font-weight: ${({ $selected }) => $selected ? '600' : '400'};
  color: ${({ $selected }) => $selected ? '#53B175' : '#272727'};
  cursor: pointer;
  text-align: center;
`

const AddressBox = styled.div`
  display: flex;
  gap: 8px;
`

const AddressInput = styled.input`
  flex: 1;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #E0E0E0;
  font-family: 'Paperlogy';
  font-size: 14px;
  outline: none;
  background: #fff;

  &::placeholder {
    color: #b8b8b8;
  }

  &:focus {
    border-color: #53B175;
  }
`

const SearchButton = styled.button`
  padding: 12px 16px;
  border-radius: 10px;
  background: #53B175;
  border: none;
  color: white;
  font-family: 'Paperlogy';
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
`

const SearchResultBox = styled.div`
  margin-top: 8px;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
`

const SearchResultItem = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #F0F0F0;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #F5F5F5;
  }

  &:last-child {
    border-bottom: none;
  }
`

const ResultName = styled.div`
  font-family: 'Paperlogy';
  font-size: 14px;
  font-weight: 600;
  color: #272727;
`

const ResultAddress = styled.div`
  font-family: 'Paperlogy';
  font-size: 12px;
  color: #959595;
  margin-top: 4px;
`

const MemoInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #E0E0E0;
  font-family: 'Paperlogy';
  font-size: 14px;
  outline: none;
  resize: none;
  box-sizing: border-box;

  &::placeholder {
    color: #b8b8b8;
  }

  &:focus {
    border-color: #53B175;
  }
`

const SubmitButton = styled.button`
  width: calc(100% - 48px);
  height: 52px;
  margin: 16px 24px;
  border-radius: 12px;
  background: ${({ disabled }) => disabled ? '#D9D9D9' : '#53B175'};
  border: none;
  color: white;
  font-family: 'Paperlogy';
  font-size: 16px;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
`

const CATEGORIES = [
    "\ubd84\ub9ac\uc218\uac70\ud568",
    "\uae38\uac70\ub9ac \uc4f0\ub808\uae30\ud1b5",
    "\uc758\ub958\uc218\uac70\ud568",
    "\ud3d0\ud615\uad11\ub4f1, \ud3d0\uac74\uc804\uc9c0 \uc218\uac70\ud568",
]

const ReportLocation = () => {
    const navigate = useNavigate()
    const mapRef = useRef(null)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [address, setAddress] = useState("")
    const [memo, setMemo] = useState("")
    const [searchedPlace, setSearchedPlace] = useState(null)
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        if (window.kakao?.maps?.services) return

        let kakaoMapKey

        try {
            kakaoMapKey = getRequiredEnv("VITE_KAKAO_MAP_KEY")
        } catch (error) {
            console.error(error)
            return
        }

        const existingScript = document.querySelector(
            'script[src*="dapi.kakao.com/v2/maps/sdk.js"]',
        )

        if (existingScript) return

        const script = document.createElement("script")
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`
        script.async = true
        script.onload = () => {
            window.kakao.maps.load(() => { })
        }
        document.head.appendChild(script)
    }, [])

    const handleSearchAddress = () => {
        if (!address.trim()) {
            alert("\uc8fc\uc18c\ub97c \uc785\ub825\ud574\uc8fc\uc138\uc694.")
            return
        }

        if (!window.kakao?.maps?.services) {
            alert("\uc9c0\ub3c4 \uac80\uc0c9 \uc11c\ube44\uc2a4\ub97c \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4.")
            return
        }

        const ps = new window.kakao.maps.services.Places()

        ps.keywordSearch(address, (data, status) => {
            if (status !== window.kakao.maps.services.Status.OK || data.length === 0) {
                alert("\uac80\uc0c9 \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.")
                setSearchResults([])
                return
            }

            setSearchResults(data)
        })
    }

    const handleSubmit = () => {
        if (!selectedCategory || !address) return

        const reportData = {
            category: selectedCategory,
            address,
            memo,
            latitude: searchedPlace?.latitude || null,
            longitude: searchedPlace?.longitude || null,
        }

        console.log("\uc704\uce58 \uc81c\ubcf4 \ub370\uc774\ud130:", reportData)

        alert("\uc81c\ubcf4\uac00 \uc811\uc218\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \uac10\uc0ac\ud569\ub2c8\ub2e4!")
        navigate(-1)
    }

    return (
        <Container ref={mapRef}>
            <Header>
                <BackButton onClick={() => navigate(-1)}>{"<"}</BackButton>
                <Title>{"\uc704\uce58 \uc81c\ubcf4\ud558\uae30"}</Title>
            </Header>

            <Section>
                <SectionTitle>{"\uce74\ud14c\uace0\ub9ac \uc120\ud0dd"}</SectionTitle>
                <CategoryGrid>
                    {CATEGORIES.map((category) => (
                        <CategoryItem
                            key={category}
                            $selected={selectedCategory === category}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </CategoryItem>
                    ))}
                </CategoryGrid>
            </Section>

            <Section>
                <SectionTitle>{"\uc704\uce58 \uc785\ub825"}</SectionTitle>
                <AddressBox>
                    <AddressInput
                        placeholder={"\uc8fc\uc18c\ub97c \uc785\ub825\ud574\uc8fc\uc138\uc694"}
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value)
                            setSearchedPlace(null)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearchAddress()
                        }}
                    />
                    <SearchButton type="button" onClick={handleSearchAddress}>
                        {"\uac80\uc0c9"}
                    </SearchButton>
                </AddressBox>
                {searchResults.length > 0 && (
                    <SearchResultBox>
                        {searchResults.slice(0, 5).map((place) => (
                            <SearchResultItem
                                key={place.id}
                                onClick={() => {
                                    setAddress(
                                        place.road_address_name ||
                                        place.address_name ||
                                        place.place_name,
                                    )

                                    setSearchedPlace({
                                        name: place.place_name,
                                        address: place.road_address_name || place.address_name,
                                        latitude: Number(place.y),
                                        longitude: Number(place.x),
                                    })

                                    setSearchResults([])
                                }}
                            >
                                <ResultName>{place.place_name}</ResultName>
                                <ResultAddress>
                                    {place.road_address_name || place.address_name}
                                </ResultAddress>
                            </SearchResultItem>
                        ))}
                    </SearchResultBox>
                )}
            </Section>

            <Section>
                <SectionTitle>{"\ucd94\uac00 \uba54\ubaa8 (\uc120\ud0dd)"}</SectionTitle>
                <MemoInput
                    placeholder={"\ucd94\uac00\ub85c \uc54c\ub824\uc8fc\uc2e4 \ub0b4\uc6a9\uc774 \uc788\uc73c\uba74 \uc785\ub825\ud574\uc8fc\uc138\uc694"}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                />
            </Section>

            <SubmitButton
                disabled={!selectedCategory || !address}
                onClick={handleSubmit}
            >
                {"\uc81c\ubcf4\ud558\uae30"}
            </SubmitButton>
        </Container>
    )
}

export default ReportLocation

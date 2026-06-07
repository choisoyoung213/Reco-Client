import { useEffect, useState } from "react";
import styled from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import BottomNavComponent from "../components/BottomNav";
import BiumAct from "../assets/img/Bium_act.svg";
import ChevronDown from "../assets/img/down.svg";
import ChevronUp from "../assets/img/up.svg";
import { getRequiredEnv } from "../config/env";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background: #fff;
  padding-bottom: 110px;
  box-sizing: border-box;
`;

const Header = styled.div`
  padding: 28px 24px 20px;
  text-align: left;
`;

const HeaderTitle = styled.p`
  font-family: "Paperlogy";
  font-size: 20px;
  font-weight: 700;
  color: #272727;
  line-height: 1.4;
  white-space: pre-line;
  text-align: left;
`;

const GreenBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #53b175;
  color: white;
  border-radius: 4px;
  padding:2px 6px;
  font-size: 18px;
  font-weight: 700;
  margin-right: 2px;
`;

const CalendarSection = styled.div`
  padding: 0 24px;
  margin-bottom: 16px;
`;

const CalendarHeader = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
`;

const CalendarSelect = styled.select`
  padding: 7px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  background: #fff;
  font-family: "Paperlogy";
  font-size: 13px;
  color: #272727;
  outline: none;
`;

const CalendarGrid = styled.div`
  width: 100%;
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: 12px;
  color: #959595;
  font-family: "Paperlogy";
  padding: 4px 0;
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 42px;
  cursor: pointer;
`;

const DayNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-family: "Paperlogy";
  background: ${({ $active }) => ($active ? "#53b175" : "transparent")};
  color: ${({ $active, $empty }) =>
    $active ? "white" : $empty ? "#d9d9d9" : "#272727"};
`;

const ActivityDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #53b175;
  margin-top: 2px;
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 8px 24px;
`;

const TodaySection = styled.div`
  padding: 16px 24px;
  text-align: left;
`;

const TodayHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
`;

const TodayDate = styled.span`
  font-size: 28px;
  font-weight: 700;
  font-family: "Paperlogy";
  color: #272727;
`;

const TodayLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  font-family: "Paperlogy";
  color: #272727;
`;

const TodayInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: "Paperlogy";
  font-size: 12px;
  margin-bottom: 12px;
`;

const TodayWeek = styled.span`
  font-weight: 700;
  color: #272727;
`;

const TodaySubText = styled.span`
  font-weight: 400;
  color: #b8b8b8;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  border-radius: 12px;
  background: ${({ $green }) => ($green ? "#53b175" : "#fff")};
  border: ${({ $green }) => ($green ? "none" : "1px solid #e0e0e0")};
  margin-bottom: 8px;
  min-height: 58px;
  box-sizing: border-box;
`;

const ActivityItemText = styled.p`
  font-size: 15px;
  font-family: "Paperlogy";
  font-weight: 600;
  color: ${({ $green }) => ($green ? "white" : "#272727")};
`;

const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 8px;
`;

const EmptyImg = styled.img`
  width: 120px;
  height: auto;
`;

const EmptyText = styled.p`
  font-size: 12px;
  color: #b8b8b8;
  font-family: "Paperlogy";
`;

const StatsSection = styled.div`
  padding: 16px 24px;
  text-align: left;
`;

const StatsTitle = styled.p`
  font-size: 18px;
  font-weight: 700;
  font-family: "Paperlogy";
  color: #272727;
  line-height: 1.4;
  margin-bottom: 20px;
  white-space: pre-line;
`;

const GreenText = styled.span`
  color: #53b175;
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  overflow: hidden;
`;
const ToggleButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  font-size: 20px;
  color: #b8b8b8;
  cursor: pointer;
  padding: 8px 0;
  text-align: center;
`;

const COLORS = ["#53b175", "#3d8f5f", "#2d6e47", "#7bc89a"];
const SPRING_API_BASE = getRequiredEnv("VITE_SPRING_API_BASE_URL");

const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevLastDate = new Date(year, month, 0).getDate();

  const days = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: prevLastDate - i,
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= lastDate; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
    });
  }

  let nextDay = 1;
  while (days.length % 7 !== 0) {
    days.push({
      day: nextDay,
      isCurrentMonth: false,
    });
    nextDay += 1;
  }

  return days;
};

const getWeekText = (year, month, day) => {
  const weekList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekList[new Date(year, month, day).getDay()];
};

const Activity = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("사용자");
  const [isExpanded, setIsExpanded] = useState(false);
  const today = new Date();

  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [records, setRecords] = useState([]);

  const [summary, setSummary] = useState(null);

  const monthParam = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}`;

  const calendarDays = getCalendarDays(selectedYear, selectedMonth);
  const selectedWeek = getWeekText(selectedYear, selectedMonth, selectedDay);

  const activityDays = records.map((record) =>
    new Date(record.analyzedAt).getDate(),
  );

  const selectedDateRecords = records.filter((record) => {
    const recordDate = new Date(record.analyzedAt);

    return (
      recordDate.getFullYear() === selectedYear &&
      recordDate.getMonth() === selectedMonth &&
      recordDate.getDate() === selectedDay
    );
  });

  const chartData =
    summary?.monthlyStats?.map((item) => ({
      name: item.category,
      value: item.count,
    })) ?? [];

  const hasActivity = selectedDateRecords.length > 0;

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    const savedUsername = localStorage.getItem("username");

    if (!savedUserId) {
      navigate("/login");
      return;
    }

    setUserName(savedUsername || savedUserId);

    const fetchActivity = async () => {
      try {
        const response = await fetch(`${SPRING_API_BASE}/api/analysis/summary/${savedUserId}`);

        if (!response.ok) {
          throw new Error("활동 요약을 불러오지 못했습니다.");
        }

        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("활동 요약 조회 오류:", error);
      }
    };

    const fetchRecords = async () => {
      try {
        const response = await fetch(`${SPRING_API_BASE}/api/analysis/list/${savedUserId}`);

        if (!response.ok) {
          throw new Error("활동 기록을 불러오지 못했습니다.");
        }

        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("활동 기록 조회 오류:", error);
      }
    };

    fetchActivity();
    fetchRecords();
  }, [monthParam, navigate]);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          {userName} 님은 자원 순환에{"\n"}
          <GreenText>{summary?.totalCount ?? 0}회</GreenText> 참여했어요!
        </HeaderTitle>
      </Header>

      <CalendarSection>
        <CalendarHeader>
          <CalendarSelect
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(Number(e.target.value));
              setSelectedDay(1);
            }}
          >
            {Array.from({ length: 5 }, (_, index) => {
              const year = today.getFullYear() - 2 + index;

              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </CalendarSelect>

          <CalendarSelect
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(Number(e.target.value));
              setSelectedDay(1);
            }}
          >
            {monthList.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </CalendarSelect>
        </CalendarHeader>

        <CalendarGrid>
          <WeekRow>
            {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
              <DayLabel key={index}>{day}</DayLabel>
            ))}
          </WeekRow>

          <DateGrid>
            {calendarDays.map((date, index) => {
              const isActive = date.day === selectedDay && date.isCurrentMonth;

              const hasDot =
                activityDays.includes(date.day) && date.isCurrentMonth;

              return (
                <DayCell
                  key={index}
                  onClick={() => {
                    if (date.isCurrentMonth) {
                      setSelectedDay(date.day);
                      setIsExpanded(false);
                    }
                  }}
                >
                  <DayNumber $active={isActive} $empty={!date.isCurrentMonth}>
                    {date.day}
                  </DayNumber>
                  {hasDot && <ActivityDot />}
                </DayCell>
              );
            })}
          </DateGrid>
        </CalendarGrid>
      </CalendarSection>

      <Divider />

      <TodaySection>
        <TodayHeader>
          <TodayDate>{selectedDay}</TodayDate>
          <TodayLabel>오늘</TodayLabel>
        </TodayHeader>

        {hasActivity && (
          <TodayInfo>
            <TodayWeek>{selectedWeek}</TodayWeek>
            <TodaySubText>
              {selectedDateRecords.length}개의 분리수거를 완료했어요
            </TodaySubText>
          </TodayInfo>
        )}

        {hasActivity ? (
          <>
            {(isExpanded
              ? selectedDateRecords
              : selectedDateRecords.slice(0, 2)
            ).map((item) => (
              <ActivityItem key={item.recordId} $green={item.isRecyclable}>
                <ActivityItemText $green={item.isRecyclable}>
                  {item.itemName}
                </ActivityItemText>
              </ActivityItem>
            ))}

            {selectedDateRecords.length > 2 && (
              <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
                <img
                  src={isExpanded ? ChevronUp : ChevronDown}
                  width={24}
                  height={24}
                />
              </ToggleButton>
            )}
          </>
        ) : (
          <EmptyBox>
            <EmptyImg src={BiumAct} alt="비움 캐릭터" />
            <EmptyText>오늘은 아직 아무것도 버리지 않았어요</EmptyText>
          </EmptyBox>
        )}
      </TodaySection>

      <Divider />

      <StatsSection>
        <StatsTitle>
          {userName}님 저번달 보다{"\n"}
          <GreenText>{summary?.differenceFromLastMonth ?? 0}회</GreenText> 더
          실천했어요!
        </StatsTitle>

        <ChartWrapper>
          <BarChart
            width={340}
            height={200}
            data={chartData}
            barSize={44}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: "Paperlogy",
                fontSize: 12,
                fontWeight: 600,
                fill: "#272727",
              }}
            />
            <YAxis hide />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              label={{
                position: "insideBottom",
                fill: "white",
                fontFamily: "Paperlogy",
                fontSize: 14,
                fontWeight: 600,
                offset: 10,
              }}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ChartWrapper>
      </StatsSection>

      <BottomNavComponent />
    </Container>
  );
};

export default Activity;

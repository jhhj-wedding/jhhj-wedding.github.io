// =====================================================
//  청첩장 정보 — 이 파일만 수정하면 됩니다
// =====================================================
const CONFIG = {
  groom: {
    name: "석지환",
    father: "석희원",
    mother: "이미경",
    relation: "장남",
    phone: "", // 비워두면 '연락하기'에서 빠짐
  },
  bride: {
    name: "백혜정",
    father: "백운봉",
    mother: "남인숙",
    relation: "장녀",
    phone: "",
  },

  // 예식 일시 (24시간 형식)
  date: "2026-12-13T12:20:00",

  tagline: "첫눈처럼 설레는 날, 결혼합니다.",

  venue: {
    name: "더 리버사이드 호텔",
    hall: "노벨라홀",
    address: "서울 서초구 강남대로107길 6",
    tel: "", // 비워두면 표시 안 함
    // 지도 앱 검색어 (보통 예식장 이름)
    mapQuery: "더 리버사이드 호텔",
    transport: [
      { title: "지하철", desc: "3호선 · 신분당선 신사역 5번 출구에서 도보 3분" },
      {
        title: "버스",
        desc: `신사역 인근 정류장 하차 후 호텔까지 도보 5~8분
간선 142, 145, 148, 240, 441, 542
지선 4212, 4312, 강남08, 서초03
광역 1100, 3030, 8001, 9202, 9404`,
      },
      { title: "자가용", desc: "내비게이션 '더 리버사이드 호텔' 검색 (발렛 주차)" },
    ],
    notice: "발렛 주차로 혼잡이 예상되오니, 대중교통으로 편히 오시길 바랍니다.",
  },

  greeting: `손끝 시리던 겨울, 운명처럼 만나
서로의 온기가 되어 준 두 사람이

벚꽃을 보고 여름밤을 걷고 단풍을 지나
어느덧 세 번째 겨울에 닿았습니다.

처음 만난 이 계절에 평생을 약속합니다.
따뜻한 마음으로 축복해주시면 감사하겠습니다.`,

  // images 폴더에 넣은 파일 이름
  mainImage: "images/main.jpg",
  gallery: [
    "images/gallery1.jpg",
    "images/gallery2.jpg",
    "images/gallery3.jpg",
    "images/gallery4.jpg",
    "images/gallery5.jpg",
    "images/gallery6.jpg",
  ],

  // 마음 전하실 곳 (양쪽 다 비워두면 섹션이 숨겨짐)
  // TODO: 은행 / 계좌번호를 실제 값으로 바꿔주세요
  // 카카오페이 송금 링크가 있으면 kakaopay: "https://qr.kakaopay.com/..." 추가 (없으면 버튼 숨김)
  accounts: {
    groom: [
      { role: "신랑", name: "석지환", bank: "OO은행", number: "000-0000-0000" },
      { role: "아버지", name: "석희원", bank: "OO은행", number: "000-0000-0000" },
      { role: "어머니", name: "이미경", bank: "OO은행", number: "000-0000-0000" },
    ],
    bride: [
      { role: "신부", name: "백혜정", bank: "OO은행", number: "000-0000-0000" },
      { role: "아버지", name: "백운봉", bank: "OO은행", number: "000-0000-0000" },
      { role: "어머니", name: "남인숙", bank: "OO은행", number: "000-0000-0000" },
    ],
  },
};

// Header와 Footer에 공통으로 사용할 디자인 옵션 정의
const designOptions = {
  default: {}, // 기본 스타일 (추가 속성 없음)
  option1: {
    backgroundColor: "#f0f0f0", // 밝은 회색 배경색
    padding: "20px", // 내부 여백 추가
    borderRadius: "10px", // 모서리를 둥글게 처리
  },
  option2: {
    borderBottom: "4px solid #000", // 하단에 검은색 실선 추가
    paddingBottom: "10px", // 내용과 경계선 사이에 여백 추가
  },
};

export default designOptions;

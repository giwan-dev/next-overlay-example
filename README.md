# next-overlay-example

Next.js 환경에서 화면을 가리는 UI 요소를 렌더링할 때 쓸 수 있는 훅을 구현합니다.

`useOverlay` 훅은 `visible`, `raise`, `dismiss`를 반환합니다. `visible`은 화면에 UI 요소를 표시할 지 여부를 저장하는 state입니다.
`raise` 함수는 `visible`을 true로 만들어주는 함수입니다.
`dismiss` 함수는 `visible`을 false로 만들어주는 함수입니다. Promise를 반환합니다.

뒤로 가기로 overlay를 닫을 수 있습니다. 반대로 앞으로 가기로 overlay를 열 수 있습니다.
overlay가 열린 상태로 새로 고침해도 overlay가 열려 있습니다.

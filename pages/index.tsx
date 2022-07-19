import Link from "next/link";
import { useOverlay } from "../hooks/overlay";

export default function IndexPage() {
  const { visible, raise, dismiss } = useOverlay();

  return (
    <div>
      <Link href="?b=foo&a=bar">
        <a>쿼리 변경 테스트하기</a>
      </Link>

      <button onClick={raise}>Raise Dialog</button>
      {visible ? (
        <div>
          This is dialog
          <button onClick={dismiss}>close</button>
        </div>
      ) : null}
    </div>
  );
}

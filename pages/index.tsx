import Link from "next/link";
import { useRouter } from "next/router";
import { useOverlay } from "next-overlay";

export default function IndexPage() {
  const { visible, raise, dismiss } = useOverlay();
  const router = useRouter();

  return (
    <div>
      <Link href="?b=foo&a=bar">
        <a>쿼리 변경 테스트하기</a>
      </Link>

      <button onClick={raise}>Raise Dialog</button>
      {visible ? (
        <div>
          This is dialog
          <button
            onClick={async () => {
              await dismiss();

              await router.push("?foo=bar");
            }}
          >
            close
          </button>
        </div>
      ) : null}
    </div>
  );
}

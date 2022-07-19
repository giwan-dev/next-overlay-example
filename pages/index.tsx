import { useOverlay } from "next-overlay";

export default function IndexPage() {
  const { visible, raise, dismiss } = useOverlay();

  return (
    <div>
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

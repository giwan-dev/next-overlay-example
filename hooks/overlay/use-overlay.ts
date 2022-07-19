import { useRouter } from "next/router";
import { useCallback, useEffect, useId, useState } from "react";

export default function useOverlay() {
  const { events, push, back } = useRouter();
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const raise = useCallback(() => {
    if (initialized === false) {
      return;
    }
    setVisible(true);
  }, [initialized]);

  const dismiss = useCallback(() => {
    if (initialized === false) {
      return;
    }

    return new Promise<void>((resolve) => {
      const removeListener = () => {
        events.off("hashChangeComplete", removeListener);

        resolve();
      };
      events.on("hashChangeComplete", removeListener);

      setVisible(false);
    });
  }, [events, initialized]);

  useEffect(() => {
    const initialHash = window.location.hash.replace("#", "");

    if (initialHash === id) {
      setVisible(true);
    } else {
      setVisible(false);
    }

    setInitialized(true);
  }, [id]);

  useEffect(() => {
    if (initialized === false) {
      return;
    }

    const currentHash = window.location.hash.replace("#", "");

    if (visible === true && currentHash !== id) {
      push(`#${id}`);
    }
    if (visible === false && currentHash === id) {
      back();
    }
    // push, back은 렌더링시 새로 정의됨
  }, [id, initialized, visible]);

  useEffect(() => {
    const syncVisibleWithHash = (url: string) => {
      const [, currentHash] = url.split("#");

      if (visible === true && currentHash !== id) {
        setVisible(false);
      }
      if (visible === false && currentHash === id) {
        setVisible(true);
      }
    };

    if (initialized === true) {
      events.on("routeChangeComplete", syncVisibleWithHash);
      events.on("hashChangeComplete", syncVisibleWithHash);

      return () => {
        events.off("routeChangeComplete", syncVisibleWithHash);
        events.off("hashChangeComplete", syncVisibleWithHash);
      };
    }
  }, [events, id, initialized, visible]);

  useEffect(() => {
    if (visible) {
      const warnRouteChange = () => {
        console.warn(
          "Overlay를 사용하고 있는 중에 route 변경이 감지되었습니다.\n이는 예기치 못한 행동을 야기할 수 있습니다.\noverlay를 완전히 닫은 후 route를 변경해 주세요."
        );
      };

      events.on("routeChangeStart", warnRouteChange);

      return () => {
        events.off("routeChangeStart", warnRouteChange);
      };
    }
  }, [events, visible]);

  return { visible, raise, dismiss };
}

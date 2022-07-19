import { useRouter } from "next/router";
import { useEffect, useId, useState } from "react";

export default function useOverlay() {
  const router = useRouter();
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const raise = () => {
    if (initialized === false) {
      return;
    }
    setVisible(true);
  };

  const dismiss = () => {
    if (initialized === false) {
      return;
    }

    return new Promise<void>((resolve) => {
      const removeListener = () => {
        router.events.off("hashChangeComplete", removeListener);

        resolve();
      };
      router.events.on("hashChangeComplete", removeListener);

      setVisible(false);
    });
  };

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
      router.push(`#${id}`);
    }
    if (visible === false && currentHash === id) {
      router.back();
    }
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
      router.events.on("routeChangeComplete", syncVisibleWithHash);
      router.events.on("hashChangeComplete", syncVisibleWithHash);

      return () => {
        router.events.off("routeChangeComplete", syncVisibleWithHash);
        router.events.off("hashChangeComplete", syncVisibleWithHash);
      };
    }
  }, [id, initialized, visible]);

  useEffect(() => {
    if (visible) {
      const warnRouteChange = () => {
        console.warn(
          "Overlay를 사용하고 있는 중에 route 변경이 감지되었습니다.\n이는 예기치 못한 행동을 야기할 수 있습니다.\noverlay를 완전히 닫은 후 route를 변경해 주세요."
        );
      };

      router.events.on("routeChangeStart", warnRouteChange);

      return () => {
        router.events.off("routeChangeStart", warnRouteChange);
      };
    }
  }, [router.events, visible]);

  return { visible, raise, dismiss };
}

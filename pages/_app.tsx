import IpAddressTracker from "@/components/api/ipFing";
import useAuth, { AuthProvider } from "@/hooks/useAuth";
import "@/styles/globals.css";
import axios from "axios";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import { RecoilEnv } from 'recoil';


interface IpData {
  ip: string;
  city: string;
  loc: string;
  region: string;
}


export default function App({ Component, pageProps }: AppProps) {
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [isCaptchaCompleted, setIsCaptchaCompleted] = useState(false);
  const [captchaDisplayed, setCaptchaDisplayed] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const { user } = useAuth(); // Custom hook from useAuth

  const router = useRouter();
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;



  useEffect(() => {
    setCurrentUrl(window.location.href);

    const handleRouteChange = (url: string) => {
      setCurrentUrl(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const handleIpFetched = async (ipData: IpData) => {
    setIpData(ipData);

    const requestData = `
      A new visitor has arrived: 🐑
      [🌐 - ${ipData.ip}]
      [📍 - ${ipData.city}]
      [🖖 - ${ipData.loc}]
      [📍 - ${ipData.region}]

      =========================
      [🌐 - URL: ${currentUrl}]
    `;

    try {
      const response = await axios.post("/api/sendMessage", { text: requestData }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        setIsCaptchaCompleted(true);
      } else {
        console.error("Failed to send message.");
      }
    } catch (error : any) {
      console.error("Error sending message:", error.response ? error.response.data : error);
    }
  };

  useEffect(() => {
    const hasCaptchaCookie = document.cookie.includes("captchaDisplayed=true");
    const hasVisitedCaptchaCookie = document.cookie.includes(
      "visitedCaptcha=true"
    );

    if (isCaptchaCompleted) {
      if (!hasVisitedCaptchaCookie) {
        if (!hasCaptchaCookie && router.pathname === "/" && !captchaDisplayed) {
          setCaptchaDisplayed(true);
          document.cookie = "captchaDisplayed=true; max-age=60";
        } else if (hasCaptchaCookie && router.pathname !== "/captcha") {
          router.push("/captcha");
          document.cookie = "visitedCaptcha=true; max-age=60";
        } else if (
          hasVisitedCaptchaCookie &&
          router.pathname !== "/subscribe"
        ) {
          router.push("/subscribe");
        }
      }
    }
  }, [isCaptchaCompleted, captchaDisplayed, router]);

  return (
    <RecoilRoot>
      <AuthProvider>
        <IpAddressTracker onIpFetched={handleIpFetched} />
        <Component {...pageProps} />
      </AuthProvider>
    </RecoilRoot>
  );
}

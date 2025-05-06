import { FunctionComponent } from "react";
import { BannerType } from "./banner.types";
import "./banner.css";

interface AlertBannerProps {
  bannerType: BannerType;
  text: string;
}

const AlertBanner: FunctionComponent<AlertBannerProps> = ({
  bannerType,
  text,
}) => {
  return (
    <>
      <div className="banner-container">
        <h3>{text}</h3>
      </div>
    </>
  );
};

export default AlertBanner;

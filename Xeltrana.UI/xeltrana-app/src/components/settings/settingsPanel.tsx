import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UserRoles } from "../../types/types";
import { useState } from "react";
import { ProfileSettings } from "./settingsOptions/profileSettings";
import "./settings.css";
import ProductSettings from "./settingsOptions/productSettings/productSettings";

const settingsOptions = [
  { key: "profile", label: "Profile Settings" },
  { key: "account", label: "Account Settings" },
  { key: "notifications", label: "Notifications" },
];

const SettingsPanel = () => {
  const roleId = useSelector((state: RootState) => state.auth?.user?.roleId);
  const [selectedSetting, setSelectedSetting] = useState("profile");

  if (
    roleId === UserRoles.Admin &&
    !settingsOptions.find((o) => o.key === "products")
  ) {
    settingsOptions.push({ key: "products", label: "Product Settings" });
  }

  const renderSettingContent = () => {
    switch (selectedSetting) {
      case "profile":
        return <ProfileSettings />;
      case "account":
        return <div>account settings</div>;
      case "notifications":
        return <div>notification settings</div>;
      case "products":
        return <ProductSettings />;
      default:
        return <div>Select a setting.</div>;
    }
  };

  console.log(roleId);

  return (
    <div className="settings-container">
      <div className="sidebar">
        <h2>Settings</h2>
        <ul className="settings-options">
          {settingsOptions.map((option) => (
            <li key={option.key}>
              <button
                className={`option-button ${
                  selectedSetting === option.key ? "active" : ""
                }`}
                onClick={() => setSelectedSetting(option.key)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="content">{renderSettingContent()}</div>
    </div>
  );
};

export default SettingsPanel;

import { useState, useEffect } from "react";
import api from "../../services/api";
import { Gender, ViewProduct } from "../../types/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./dashboard.css";
import Carousel from "../react-custom-components/carousel/carousel";
import Toggle, { ToggleOption } from "../react-custom-components/toggle/toggle";

const Dashboard = () => {
  const [maleProducts, setMaleProducts] = useState<ViewProduct[]>([]);
  const [femaleProducts, setFemaleProducts] = useState<ViewProduct[]>([]);
  const [gender, setGender] = useState<string>(Gender.Male);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const genderOptions: ToggleOption[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (gender === Gender.Male) {
          const maleDataResponse = await api.get<ViewProduct[]>(
            "/products?audience=1"
          );
          setMaleProducts(maleDataResponse.data);
        } else if (gender === Gender.Female) {
          const femaleDataResponse = await api.get<ViewProduct[]>(
            "/products?audience=2"
          );
          setFemaleProducts(femaleDataResponse.data);
        }
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [gender]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="toggle-audience-container">
        <Toggle
          options={genderOptions}
          selected={gender}
          onSelect={setGender}
        />
      </div>
      {gender === Gender.Male && (
        <div className="male-carousel-container">
          <Carousel items={maleProducts} />
        </div>
      )}
      {gender === Gender.Female && (
        <div className="female-carousel-container">
          <Carousel items={femaleProducts} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

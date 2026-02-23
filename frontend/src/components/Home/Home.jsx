import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../../main";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCompanies from "./PopularCampanies";
import PopularCategories from "./PopularCategories";

const Home = () => {
  const { isAuthorized } = useContext(Context);
  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      <section className="homePage page">
        <HeroSection />
        <HowItWorks />
        <PopularCategories />
        <PopularCompanies />
      </section>
    </>
  );
};

export default Home;
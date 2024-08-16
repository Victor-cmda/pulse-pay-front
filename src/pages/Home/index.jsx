import React from "react";

const Home = () => {
  return (
    <div
      className="hero"
      style={{
        backgroundImage:
          "url('/homePage.png')",
        minHeight: "94vh"
      }}
      
    >
      <img src="././" alt="" />
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Bem vindo ao PulsePay</h1>
          <p className="mb-5">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <button className="btn btn-primary glass">Ir ao Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default Home;

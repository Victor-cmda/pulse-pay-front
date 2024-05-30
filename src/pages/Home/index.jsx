import React from "react";

const Home = () => {
  return (
    <div
      className="hero"
      style={{
        backgroundImage:
          "url(https://img.freepik.com/free-photo/closeup-female-entrepreneur-using-laptop-credit-card-online-shopping-while-working-late-office_637285-2598.jpg?t=st=1717023486~exp=1717027086~hmac=cdcb69777039c5d9513ce32275ddd536e3269c4a086609163da9735e379a4555&w=2000)",
        minHeight: "94vh"
      }}
    >
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

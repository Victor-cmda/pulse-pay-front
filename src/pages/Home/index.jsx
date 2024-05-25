import React from "react";

const Home = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://img.freepik.com/fotos-gratis/cliente-de-alto-angulo-pagando-com-dispositivo-nfc_23-2150690010.jpg?w=1380&t=st=1716607036~exp=1716607636~hmac=a438faef4654f7f4e7b868aa4a9c0dbc692fc19f1e00b82d2b25fd9a5098a4db)",
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

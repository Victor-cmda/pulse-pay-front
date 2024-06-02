import React from "react";
import { Link } from "react-router-dom";
import { Result, Button } from "antd";

const NotFound = () => {
  return (
    <div className="hero" style={{minHeight: "93vh"}}>
        <Result
          status="404"
          title="404"
          subTitle="Desculpe, a página que você está tentando acessar não existe"
          extra={
            <Link to="/">
              <Button type="primary">Voltar para a página inicial</Button>
            </Link>
          }
        />
    </div>
  );
};

export default NotFound;

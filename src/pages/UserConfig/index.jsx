import React, { useRef, useState, useEffect } from "react";
import { CollapseOpened, Container, LoadingSkeleton } from "../../components";
import {
  IdentificationIcon,
  ArrowRightCircleIcon,
  ChartPieIcon,
  ClipboardIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { notification, Typography } from "antd";
import  AuthService  from "../../services/AuthService";
const { Title } = Typography;

const UserConfig = () => {
  const inputRefs = useRef([]);
  const [showPassword, setShowPassword] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    console.log("UserConfig component mounted"); // Log para verificar montagem do componente

    const fetchData = async () => {
      console.log("Fetching data from API"); // Log para verificar chamada da API
      const result = await AuthService.getUserConfig();
      if (result.success) {
        setConfigData(result.data);
      } else {
        console.error("Erro ao buscar dados da API:", result.message);
      }
    };
    fetchData();
  }, []); // Certifique-se de que a dependência está correta (array vazio para rodar uma vez)

  const openNotification = () => {
    api.info({
      message: `Sucesso`,
      description: `Texto copiado para a área de transferência!`,
      placement: "topRight",
    });
  };

  const handleCopy = (index) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].select();
      document.execCommand("copy");
      openNotification();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  if (!configData) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      {contextHolder}
      <Container>
        <Title>Configurações</Title>
        <CollapseOpened
          title={
            <div className="flex items-center space-x-2">
              <ChartPieIcon className="size-7" />
              <h1>Identificação da API</h1>
            </div>
          }
        >
          <label className="form-control w-full">
            <h1>Credenciais do cliente</h1>
            <label className="flex items-center input input-bordered gap-2">
              <input
                type="text"
                placeholder=""
                className="w-full grow"
                value={configData.clientId || ''}
                readOnly
                ref={(el) => (inputRefs.current[1] = el)}
              />
              <ClipboardIcon
                className="w-6 h-6 text-gray-500 cursor-pointer ml-2"
                onClick={() => handleCopy(1)}
              />
            </label>
            <div className="label">
              <span className="label-text-alt">clientId</span>
            </div>
            <label className="flex items-center input input-bordered gap-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=""
                className="w-full grow"
                value={configData.clientSecret || ''}
                readOnly
                ref={(el) => (inputRefs.current[2] = el)}
              />
              {showPassword ? (
                <EyeSlashIcon
                  className="w-6 h-6 text-gray-500 cursor-pointer ml-2"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <EyeIcon
                  className="w-6 h-6 text-gray-500 cursor-pointer ml-2"
                  onClick={togglePasswordVisibility}
                />
              )}
              <ClipboardIcon
                className="w-6 h-6 text-gray-500 cursor-pointer ml-2"
                onClick={() => handleCopy(2)}
              />
            </label>
            <div className="label">
              <span className="label-text-alt">clientSecret</span>
            </div>
          </label>
          <div className="divider"></div>
          <label className="form-control w-full">
            <h1>Canal de acesso a API</h1>
            <label className="flex items-center input input-bordered gap-2">
              <input
                type="text"
                placeholder=""
                className="w-full grow"
                value={(configData.callbacks.credit) || ''}
                readOnly
                ref={(el) => (inputRefs.current[3] = el)}
              />
              <div className="tooltip" data-tip="Copiar">
                <ClipboardIcon
                  className="w-6 h-6 text-gray-500 cursor-pointer ml-2"
                  onClick={() => handleCopy(3)}
                />
              </div>
            </label>
          </label>
        </CollapseOpened>
        <div className="divider"></div>
        <CollapseOpened
          title={
            <div className="flex items-center space-x-2">
              <ArrowRightCircleIcon className="size-7" />
              <h1>Callback</h1>
            </div>
          }
        >
          <div className="flex items-center space-x-2">
            <label className="form-control w-full">
              <h1>Pagamento de crédito</h1>
              <input
                type="text"
                value={(configData.callbacks.credit) || ''}
                className="input input-bordered w-full"
                readOnly
              />
            </label>
          </div>
          <div className="divider"></div>
          <div className="flex items-center space-x-2">
            <label className="form-control w-full">
              <h1>Pagamento de débito</h1>
              <input
                type="text"
                value={(configData.callbacks.debit) || ''}
                className="input input-bordered w-full"
                readOnly
              />
            </label>
          </div>
          <div className="divider"></div>
          <div className="flex items-center space-x-2">
            <label className="form-control w-full">
              <h1>Registro/Baixa do Boleto</h1>
              <input
                type="text"
                value={(configData.callbacks.registration) || ''}
                className="input input-bordered w-full"
                readOnly
              />
            </label>
          </div>
        </CollapseOpened>
        <div className="divider"></div>
        <CollapseOpened
          title={
            <div className="flex items-center space-x-2 ">
              <IdentificationIcon className="size-7" />
              <h1>Identificação no E-Commerce</h1>
            </div>
          }
        >
          <div className="flex items-center space-x-2">
            <label className="form-control w-full">
              <h1>Identificador de Loja</h1>
              <label className="flex items-center input input-bordered gap-2">
                <input
                  type="text"
                  value={(configData.sellers && configData.sellers[0] && configData.sellers[0].sellerId) || ''}
                  className="w-full grow"
                  readOnly
                  ref={(el) => (inputRefs.current[0] = el)}
                />
                <ClipboardIcon
                  className="w-6 h-6 text-gray-500 cursor-pointer ml-2"
                  onClick={() => handleCopy(0)}
                />
              </label>
              <div className="label">
                <span className="label-text-alt">sellerId</span>
              </div>
            </label>
          </div>
        </CollapseOpened>
      </Container>
    </div>
  );
};

export default UserConfig;

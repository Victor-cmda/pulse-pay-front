import React, { useEffect, useState } from "react";
import {
  Users,
  Target,
  Award,
  Rocket,
  CheckCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  MessageSquare,
} from "lucide-react";

const About = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Nossa Missão",
      description:
        "Simplificar e revolucionar a forma como as empresas gerenciam seus pagamentos, oferecendo soluções tecnológicas inovadoras e seguras.",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Nossa Visão",
      description:
        "Ser referência nacional em soluções de pagamento, reconhecida pela excelência, inovação e compromisso com o sucesso dos nossos clientes.",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Nossos Valores",
      description:
        "Integridade, Inovação, Excelência, Segurança e Foco no Cliente são os pilares que guiam nossas ações.",
    },
  ];

  const stats = [
    { value: "50k+", label: "Usuários Ativos" },
    { value: "R$ 1M+", label: "Transações Diárias" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Suporte" },
  ];

  const team = [
    {
      name: "Victor Hugo Somavilla",
      role: "CTO & Fundador",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=João",
    },
    {
      name: "Anderson De Bona",
      role: "CEO & Fundador",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    {
      name: "Eduardo Ribeiro Pereira Leal",
      role: "CFO & Fundador",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    },
  ];

  return (
    <div className="min-h-[94vh] bg-gradient-to-b from-base-200 to-base-300">
      <div
        className={`container mx-auto px-4 py-16 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Sobre o PulsePay</h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Somos uma empresa de tecnologia financeira dedicada a transformar a
            maneira como as empresas gerenciam seus pagamentos e transações
            financeiras.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat bg-base-100 rounded-box shadow-lg text-center"
            >
              <div className="stat-value text-primary">{stat.value}</div>
              <div className="stat-title">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h2 className="card-title mb-3">{feature.title}</h2>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Nossa História
          </h2>
          <div className="flex flex-col md:grid grid-cols-9 mx-auto p-2">
            <div className="flex flex-row-reverse md:contents">
              <div className="col-start-1 col-end-5 p-4 rounded-xl my-4 ml-auto shadow-md bg-primary">
                <h3 className="font-semibold text-lg mb-1 text-primary-content">
                  2023 - Fundação
                </h3>
                <p className="text-primary-content">
                  Nascimento do PulsePay com uma visão inovadora para o mercado
                  de pagamentos.
                </p>
              </div>
              <div className="col-start-5 col-end-6 md:mx-auto relative mr-10">
                <div className="h-full w-6 flex items-center justify-center">
                  <div className="h-full w-1 bg-primary pointer-events-none"></div>
                </div>
                <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-primary"></div>
              </div>
            </div>
            <div className="flex md:contents">
              <div className="col-start-5 col-end-6 mr-10 md:mx-auto relative">
                <div className="h-full w-6 flex items-center justify-center">
                  <div className="h-full w-1 bg-secondary pointer-events-none"></div>
                </div>
                <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-secondary"></div>
              </div>
              <div className="col-start-6 col-end-10 p-4 rounded-xl my-4 mr-auto shadow-md bg-secondary">
                <h3 className="font-semibold text-lg mb-1 text-secondary-content">
                  2024 - Expansão
                </h3>
                <p className="text-secondary-content">
                  Alcance de marcos significativos e expansão para novos
                  mercados.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nossa Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <figure className="px-10 pt-10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-xl w-32 h-32"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">{member.name}</h2>
                  <p className="text-base-content/70">{member.role}</p>
                  <div className="card-actions justify-center mt-2">
                    <button className="btn btn-circle btn-sm">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="btn btn-circle btn-sm">
                      <Github className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tecnologias</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {["React", "Node.js", "MongoDB", "Docker", "AWS"].map(
              (tech, index) => (
                <div key={index} className="badge badge-lg badge-primary p-4">
                  {tech}
                </div>
              )
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-center justify-center mb-6">
              Entre em Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>contato@pulsepay.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>São Paulo, SP</span>
              </div>
            </div>
            <div className="divider"></div>
            <div className="flex justify-center gap-4">
              <button className="btn btn-primary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

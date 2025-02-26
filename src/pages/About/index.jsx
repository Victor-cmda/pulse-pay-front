import React, { useEffect, useState } from "react";
import {
  Users,
  Target,
  Award,
  Rocket,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

const About = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Nossa Missão",
      description:
        "Simplificar e revolucionar a forma como as empresas gerenciam seus pagamentos, oferecendo soluções tecnológicas inovadoras e seguras.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Nossa Visão",
      description:
        "Ser referência nacional em soluções de pagamento, reconhecida pela excelência, inovação e compromisso com o sucesso dos nossos clientes.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
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

  const timeline = [
    {
      year: "2023",
      title: "Fundação",
      description:
        "Nascimento do PulsePay com uma visão inovadora para o mercado de pagamentos.",
    },
    {
      year: "2024",
      title: "Expansão",
      description:
        "Alcance de marcos significativos e expansão para novos mercados.",
    },
    {
      year: "2025",
      title: "Próximos Passos",
      description:
        "Novas tecnologias e expansão da equipe para atender demandas crescentes.",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      <section className="pt-12 pb-20 px-4 bg-base-200">
        <div className="container mx-auto max-w-4xl">
          <div
            className={`transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Sobre o PulsePay
            </h1>
            <p className="text-lg md:text-xl text-base-content/70 text-center max-w-3xl mx-auto">
              Somos uma empresa de tecnologia financeira dedicada a transformar
              a maneira como as empresas gerenciam seus pagamentos e transações
              financeiras.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-base-100 p-6 rounded-lg shadow-sm border border-base-200"
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-base-content/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-base-100">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Nossos Princípios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-base-100 p-8 rounded-lg shadow-sm border border-base-200"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-base-content/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-base-200">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Nossa História
          </h2>

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                    {item.year}
                  </div>
                </div>
                <div className="flex-grow pt-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-base-content/70">{item.description}</p>
                  {index < timeline.length - 1 && (
                    <div className="h-16 w-0.5 bg-base-300 ml-8 my-4"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-base-100">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Nossa Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-base-100 rounded-lg shadow-sm border border-base-200 overflow-hidden"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mb-6"
                  />
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-base-content/70 mb-4">{member.role}</p>
                  <div className="flex space-x-3">
                    <a
                      href="#"
                      className="p-2 rounded-full bg-base-200 hover:bg-primary hover:text-primary-content transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-full bg-base-200 hover:bg-primary hover:text-primary-content transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-base-200">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Tecnologias</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["PulsePay", "ASD Amazonas"].map((tech, index) => (
              <div key={index} className="badge badge-lg py-3 px-4">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-base-100">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-base-100 shadow-sm border border-base-200 rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Entre em Contato
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-base-content/70">contato@pulsepay.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Telefone</h3>
                    <p className="text-base-content/70">(11) 9999-9999</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Localização</h3>
                    <p className="text-base-content/70">São Paulo, SP</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <a href="/contato" className="btn btn-primary">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Fale Conosco
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

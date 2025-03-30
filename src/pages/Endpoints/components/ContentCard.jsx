import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import OverviewContent from "./content/OverViewContent";
import GettingStartedContent from "./content/GettingStartedContent";
import AuthenticationContent from "./content/AuthenticationContent";
import WebhooksContent from "./content/WebhooksContent";

const ContentCard = ({ endpoint, t }) => {
  const renderContent = () => {
    switch (endpoint.id) {
      case "overview":
        return <OverviewContent t={t} />;
      case "getting-started":
        return <GettingStartedContent t={t} />;
      case "authentication-overview":
        return <AuthenticationContent t={t} />;
      case "webhooks-overview":
        return <WebhooksContent t={t} />;
      default:
        return <p>Conteúdo não disponível</p>;
    }
  };

  return (
    <Card id={endpoint.id} className="scroll-mt-20 mb-6">
      <CardHeader>
        <CardTitle>{endpoint.path}</CardTitle>
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default ContentCard;
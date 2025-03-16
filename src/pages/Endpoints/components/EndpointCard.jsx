// src/pages/Endpoints/components/EndpointCard.jsx
import React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import RequestResponse from "./RequestResponse";

const EndpointCard = ({ endpoint, t }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Poderia implementar um feedback visual aqui
  };

  return (
    <Card
      id={endpoint.id}
      className="scroll-mt-20 border-l-4 border-l-indigo-500"
    >
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-block px-2 py-1 text-xs font-bold rounded-md ${
                endpoint.method === "GET"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : endpoint.method === "POST"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : endpoint.method === "PUT"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                  : endpoint.method === "DELETE"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              }`}
            >
              {endpoint.method}
            </span>
            <span className="font-mono">{endpoint.path}</span>
          </CardTitle>

          <div className="flex items-center gap-2">
            <div className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md">
              {endpoint.authentication}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(endpoint.requestExample)}
              className="h-7 px-2"
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">{t.common.copy}</span>
            </Button>
          </div>
        </div>
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <RequestResponse endpoint={endpoint} t={t} />
      </CardContent>
    </Card>
  );
};

export default EndpointCard;

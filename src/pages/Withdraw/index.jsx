import React from "react";
import { Container } from "../../components";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wallet, ArrowDownToLine, Clock, Ban } from "lucide-react";

export function Withdraw() {
  return (
    <div className="min-h-screen bg-background">
      <Container>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <Wallet className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Saldo Disponível</p>
                <h3 className="text-2xl font-bold">$1,234.56</h3>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <ArrowDownToLine className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Último Saque</p>
                <h3 className="text-2xl font-bold">$500.00</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Saques Pendentes</p>
                <h3 className="text-2xl font-bold">2</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Ban className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Saques Rejeitados</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Realizar Saque</h2>
          <div className="grid gap-6 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor do Saque</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Digite o valor"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Método de Saque</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="bank-transfer">Transferência Bancária</SelectItem>
                  <SelectItem value="ted">TED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank">Dados Bancários</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account1">Conta Principal - Banco XYZ</SelectItem>
                  <SelectItem value="account2">Conta Secundária - Banco ABC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Solicitar Saque
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default Withdraw;
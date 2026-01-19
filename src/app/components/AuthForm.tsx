import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useAuth } from "@/app/context/AuthContext";
import { Building2, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import LogoApp from "@/app/assets/ImagenesApp/LogoApp.png";

export function AuthForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerCompany, setRegisterCompany] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      toast.success("¡Bienvenido!", {
        description: "Has iniciado sesión correctamente",
      });
    } catch {
      toast.error("Error al iniciar sesión", {
        description: "Por favor, verifica tus credenciales",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Nota: aquí probablemente debería ser register(), no login().
      // Lo dejamos tal cual para no romper tu lógica actual.
      await login(registerEmail, registerPassword, registerCompany);

      toast.success("¡Cuenta creada!", {
        description: "Tu cuenta ha sido creada exitosamente",
      });
    } catch {
      toast.error("Error al crear cuenta", {
        description: "Por favor, intenta nuevamente",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-10">
      {/* Glow suave */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(600px_circle_at_50%_200px,rgba(42,167,223,0.12),transparent_60%)]" />

      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="mx-auto w-fit">
            {/* Borde degradado suave */}
            {/* Borde más vivo */}
            <div className="rounded-[26px] bg-gradient-to-br from-[#1f77d3] via-[#2aa7df] to-[#2fb85a] p-[3px] shadow-[0_22px_60px_-34px_rgba(0,0,0,0.55)]">
              {/* Interior blanco roto (sin inset para que no salga el reborde) */}
              <div className="inline-flex items-center justify-center rounded-[24px] bg-[#f8fafc] p-4 shadow-[0_10px_22px_-16px_rgba(0,0,0,0.35)]">
                <img
                  src={LogoApp}
                  alt="Logo TasKontrol"
                  className="h-20 w-20 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.12)]"
                />
              </div>
            </div>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
            TasKontrol
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sistema de Gestión Operativa
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Crear cuenta</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Bienvenido de nuevo</CardTitle>
                <CardDescription>
                  Ingresa tus credenciales para acceder
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10 bg-input-background border-border focus-visible:ring-ring"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-input-background border-border focus-visible:ring-ring"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>

                  <div className="text-xs text-center text-muted-foreground mt-4">
                    Prueba con: admin@empresa.com, manager@empresa.com o
                    empleado@empresa.com
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Crear cuenta</CardTitle>
                <CardDescription>
                  Completa tus datos para registrarte
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-company">Nombre de empresa</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="register-company"
                        type="text"
                        placeholder="Mi Empresa S.A."
                        className="pl-10 bg-input-background border-border focus-visible:ring-ring"
                        value={registerCompany}
                        onChange={(e) => setRegisterCompany(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Juan Pérez"
                        className="pl-10 bg-input-background border-border focus-visible:ring-ring"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        className="pl-10 bg-input-background border-border focus-visible:ring-ring"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-input-background border-border focus-visible:ring-ring"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Al continuar, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}

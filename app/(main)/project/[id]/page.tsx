'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ProjectData = {
  // Paso 1: Datos del Proyecto
  nombre: string;
  descripcion: string;
  fecha: string;
  
  // Paso 2: Datos del Investigador/Accidentado
  nombres: string;
  apellidos: string;
  edad: string;
  dni: string;
  cargo: string;
  empresaMinera: string;
  contrata: string;
}

type Props = {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectData>({
    nombre: '',
    descripcion: '',
    fecha: '',
    nombres: '',
    apellidos: '',
    edad: '',
    dni: '',
    cargo: '',
    empresaMinera: '',
    contrata: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Datos del Proyecto</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Nombre del proyecto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción del proyecto"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha</Label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Button onClick={nextStep} className="w-full">Siguiente</Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Datos del Investigador/Accidentado</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombres">Nombres</Label>
          <Input
            id="nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleInputChange}
            placeholder="Nombres"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input
            id="apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleInputChange}
            placeholder="Apellidos"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edad">Edad</Label>
          <Input
            id="edad"
            name="edad"
            type="number"
            value={formData.edad}
            onChange={handleInputChange}
            placeholder="Edad"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dni">DNI</Label>
          <Input
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            placeholder="DNI"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cargo">Cargo</Label>
          <Input
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={handleInputChange}
            placeholder="Cargo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresaMinera">Empresa Minera</Label>
          <Input
            id="empresaMinera"
            name="empresaMinera"
            value={formData.empresaMinera}
            onChange={handleInputChange}
            placeholder="Empresa Minera"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contrata">Contrata</Label>
          <Input
            id="contrata"
            name="contrata"
            value={formData.contrata}
            onChange={handleInputChange}
            placeholder="Contrata"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={prevStep} variant="outline" className="w-full">Anterior</Button>
        <Button type="submit" className="w-full">Guardar</Button>
      </div>
    </div>
  );

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-2xl md:text-4xl mb-8 font-bold">Nuevo Proyecto</h1>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        {step === 1 ? renderStep1() : renderStep2()}
      </div>
    </div>
  );
}

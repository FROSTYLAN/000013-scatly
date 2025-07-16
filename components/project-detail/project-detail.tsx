'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project } from '@/types/database-types';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useNavStore } from '@/store/use-nav-store';

export function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const { addNavItem, setActivePath } = useNavStore();
  const projectId = params?.id ? Number(params.id) : null;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId || projectId <= 1) {
        setError('ID de proyecto no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log('No hay token, redirigiendo al login');
          window.location.href = '/login';
          return;
        }

        const response = await fetch(`/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.log('Token inválido, redirigiendo al login');
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            return;
          }
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProject(data);
        } else {
          setError('No se encontraron datos del proyecto');
        }
      } catch (err) {
        console.error('Error al cargar el proyecto:', err);
        setError('No se pudo cargar la información del proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Crear Map de campos para búsquedas eficientes
  const fieldsMap = useMemo(() => {
    if (!project?.projectFields) return new Map();
    return new Map(
      project.projectFields.map(field => [field.field_code, field])
    );
  }, [project?.projectFields]);

  // Obtener campos específicos
  const fechaField = fieldsMap.get('S1_3');
  const tituloField = fieldsMap.get('S1_1');
  const descripcionField = fieldsMap.get('S1_2');

  // Formatear la fecha
  const formattedDate = fechaField?.comment ? new Date(fechaField.comment).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Fecha no disponible';

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Cargando detalles del proyecto...</p>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen justify-center items-center">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/')}
            className="mt-2 w-full"
          >
            Volver a Proyectos
          </Button>
        </div>
      </div>
    );
  }

  // Si no hay proyecto
  if (!project) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen justify-center items-center">
        <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Proyecto no encontrado</h3>
          <p className="text-yellow-600 mb-4">No se pudo encontrar el proyecto solicitado.</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/')}
            className="mt-2 w-full"
          >
            Volver a Proyectos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-muted-foreground/20 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-primary/10 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{tituloField?.comment}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </div>
            </div>
            <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
              ID: {project.id}
            </span>
          </div>
        </div>

          <div className="p-6 space-y-6">
            {/* Información del Proyecto */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2 text-primary/70">📋 Información del Proyecto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Nombre del proyecto</label>
                  <p className="mt-1 text-sm text-foreground">{tituloField?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Fecha</label>
                  <p className="mt-1 text-sm text-foreground">{formattedDate}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground">Descripción</label>
                  <p className="mt-1 text-sm text-foreground">{descripcionField?.comment || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Datos del Investigador */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2 text-primary/70">🔍 Datos del Investigador</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_A_1')?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Apellido</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_A_2')?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">DNI</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_A_3')?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Cargo</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_A_4')?.comment || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Datos del Accidentado */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2 text-primary/70">🚨 Datos del Accidentado</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_B_1')?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Apellido</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_B_2')?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Edad</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_B_3')?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">DNI</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_B_4')?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Cargo</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_B_5')?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Empresa minera</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_B_6')?.comment || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Empleado</label>
                  <p className="mt-1 text-sm text-foreground">{fieldsMap.get('S2_B_7')?.comment || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Evaluación Potencial de Pérdida */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2 text-primary/70">⚠️ Evaluación Potencial de Pérdida</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted/20 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">Potencial de Severidad</h3>
                  <div className="space-y-2">
                    {fieldsMap.get('S3_1_1') && <div className="flex items-center"><span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>Mayor (A)</div>}
                    {fieldsMap.get('S3_1_2') && <div className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Grave (B)</div>}
                    {fieldsMap.get('S3_1_3') && <div className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>Menor (C)</div>}
                  </div>
                  {fieldsMap.get('S3_1')?.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{fieldsMap.get('S3_1')?.comment}</p>
                  )}
                </div>
                <div className="bg-muted/20 border border-orange-200 p-4 rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">Probabilidad de Ocurrencia</h3>
                  <div className="space-y-2">
                    {fieldsMap.get('S3_2_1') && <div className="flex items-center"><span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>Alta (A)</div>}
                    {fieldsMap.get('S3_2_2') && <div className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Moderada (B)</div>}
                    {fieldsMap.get('S3_2_3') && <div className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>Rara (C)</div>}
                  </div>
                  {fieldsMap.get('S3_2')?.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{fieldsMap.get('S3_2')?.comment}</p>
                  )}
                </div>
                <div className="bg-muted/20 border border-yellow-200 p-4 rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">Frecuencia de Exposición</h3>
                  <div className="space-y-2">
                    {fieldsMap.get('S3_3_1') && <div className="flex items-center"><span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>Grande (A)</div>}
                    {fieldsMap.get('S3_3_2') && <div className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Moderada (B)</div>}
                    {fieldsMap.get('S3_3_3') && <div className="flex items-center"><span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>Baja (C)</div>}
                  </div>
                  {fieldsMap.get('S3_3')?.comment && (
                    <p className="mt-2 text-sm text-muted-foreground">{fieldsMap.get('S3_3')?.comment}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tipo de Contacto */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2 text-primary/70">💥 Tipo de Contacto con Energía o Sustancia</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { code: 'S4_1', name: 'Golpeada Contra' },
                  { code: 'S4_2', name: 'Golpeado por' },
                  { code: 'S4_3', name: 'Caída a nivel más bajo' },
                  { code: 'S4_4', name: 'Caída en mismo nivel' },
                  { code: 'S4_5', name: 'Atrapado' },
                  { code: 'S4_6', name: 'Cogido' },
                  { code: 'S4_7', name: 'Atrapado entre/debajo' },
                  { code: 'S4_8', name: 'Contacto con' },
                  { code: 'S4_9', name: 'Sobretensión/Sobreesfuerzo' }
                ].map(item => {
                  const field = fieldsMap.get(item.code);
                  return field?.comment ? (
                    <div key={item.code} className="bg-muted/20 border border-blue-200 p-3 rounded-lg">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{field.comment}</p>
                    </div>
                  ) : null;
                }).filter(Boolean)}
              </div>
            </div>

            {/* Causas Inmediatas */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2 text-primary/70">🎯 Causas Inmediatas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actos Subestándar */}
                <div className="bg-muted/20 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">🚫 Actos Subestándar/Inseguros</h3>
                  <div className="space-y-2">
                    {[
                      'S5_C1_1', 'S5_C1_2', 'S5_C1_3', 'S5_C1_4', 'S5_C1_5',
                      'S5_C1_6', 'S5_C1_7', 'S5_C1_8', 'S5_C1_9', 'S5_C1_10',
                      'S5_C1_11', 'S5_C1_12', 'S5_C1_13', 'S5_C1_14', 'S5_C1_15', 'S5_C1_16'
                    ].map(code => {
                      const field = fieldsMap.get(code);
                      return field?.comment ? (
                        <div key={code} className="text-sm">
                          <span className="font-medium">{field.field_name}:</span>
                          <span className="ml-2 text-muted-foreground">{field.comment}</span>
                        </div>
                      ) : null;
                    }).filter(Boolean)}
                  </div>
                </div>

                {/* Condiciones Subestándar */}
                <div className="bg-muted/20 border border-orange-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">⚠️ Condiciones Subestándar/Inseguras</h3>
                  <div className="space-y-2">
                    {[
                      'S5_C2_1', 'S5_C2_2', 'S5_C2_3', 'S5_C2_4', 'S5_C2_5',
                      'S5_C2_6', 'S5_C2_7', 'S5_C2_8', 'S5_C2_9', 'S5_C2_10',
                      'S5_C2_11', 'S5_C2_12', 'S5_C2_13', 'S5_C2_14', 'S5_C2_15',
                      'S5_C2_16', 'S5_C2_17'
                    ].map(code => {
                      const field = fieldsMap.get(code);
                      return field?.comment ? (
                        <div key={code} className="text-sm">
                          <span className="font-medium">{field.field_name}:</span>
                          <span className="ml-2 text-muted-foreground">{field.comment}</span>
                        </div>
                      ) : null;
                    }).filter(Boolean)}
                  </div>
                </div>
              </div>
            </div>

            {/* Causas Básicas */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2 text-primary/70">🔍 Causas Básicas/Subyacentes</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Factores Personales */}
                <div className="bg-muted/20 border border-purple-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">👤 Factores Personales</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Capacidad Física/Fisiológica', codes: ['S6_C1_1'] },
                      { title: 'Capacidad Mental/Psicológica', codes: ['S6_C1_2'] },
                      { title: 'Tensión Física/Fisiológica', codes: ['S6_C1_3'] },
                      { title: 'Tensión Mental/Psicológica', codes: ['S6_C1_4'] },
                      { title: 'Falta de Conocimientos', codes: ['S6_C1_5'] },
                      { title: 'Falta de Habilidad', codes: ['S6_C1_6'] },
                      { title: 'Motivación Incorrecta', codes: ['S6_C1_7'] }
                    ].map(category => {
                      const hasData = category.codes.some(code => fieldsMap.get(code)?.comment);
                      return hasData ? (
                        <div key={category.title} className="border-l-4 border-primary pl-3">
                          <h4 className="font-medium text-foreground">{category.title}</h4>
                          {category.codes.map(code => {
                            const field = fieldsMap.get(code);
                            return field?.comment ? (
                              <p key={code} className="text-sm text-muted-foreground mt-1">{field.comment}</p>
                            ) : null;
                          })}
                        </div>
                      ) : null;
                    }).filter(Boolean)}
                  </div>
                </div>

                {/* Factores Laborales */}
                <div className="bg-muted/20 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">🏭 Factores Laborales</h3>
                  <div className="space-y-3">
                    {[
                      { title: 'Liderazgo/Supervisión', codes: ['S6_C2_1'] },
                      { title: 'Ingeniería Inadecuada', codes: ['S6_C2_2'] },
                      { title: 'Compras Inadecuadas', codes: ['S6_C2_3'] },
                      { title: 'Mantenimiento Inadecuado', codes: ['S6_C2_4'] },
                      { title: 'Herramientas y Equipo', codes: ['S6_C2_5'] },
                      { title: 'Estándares de Trabajo', codes: ['S6_C2_6'] },
                      { title: 'Desgaste Excesivo', codes: ['S6_C2_7'] },
                      { title: 'Abuso o Mal Uso', codes: ['S6_C2_8'] }
                    ].map(category => {
                      const hasData = category.codes.some(code => fieldsMap.get(code)?.comment);
                      return hasData ? (
                        <div key={category.title} className="border-l-4 border-primary pl-3">
                          <h4 className="font-medium text-foreground">{category.title}</h4>
                          {category.codes.map(code => {
                            const field = fieldsMap.get(code);
                            return field?.comment ? (
                              <p key={code} className="text-sm text-muted-foreground mt-1">{field.comment}</p>
                            ) : null;
                          })}
                        </div>
                      ) : null;
                    }).filter(Boolean)}
                  </div>
                </div>
              </div>
            </div>

            {/* Necesidades de Acción de Control */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h2 className="text-lg font-medium mb-2 text-primary/70">🛠️ Necesidades de Acción de Control</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { title: 'Liderazgo y Administración', code: 'S7_C1' },
                  { title: 'Entrenamiento de Gerencia', code: 'S7_C2' },
                  { title: 'Inspecciones Planificadas', code: 'S7_C3' },
                  { title: 'Análisis y Procedimientos', code: 'S7_C4' },
                  { title: 'Investigación de Accidentes', code: 'S7_C5' },
                  { title: 'Observación de Tareas', code: 'S7_C6' }
                ].map(category => {
                  const field = fieldsMap.get(category.code);
                  return field?.comment ? (
                    <div key={category.code} className="bg-muted/20 border border-indigo-200 p-4 rounded-lg">
                      <h4 className="font-medium text-foreground">{category.title}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{field.comment}</p>
                    </div>
                  ) : null;
                }).filter(Boolean)}
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 text-primary/70">Acciones</h3>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    // Navegar a la página de edición del proyecto
                    // Añadir el proyecto al store de navegación antes de navegar
                    const newId = addNavItem({
                      name: tituloField?.comment,
                      id: projectId,
                      isExisting: false // Marcamos como false para que use la ruta /new/
                    });
                    // Actualizar manualmente la ruta activa
                    setActivePath(`/new/${projectId}`);
                    router.push(`/new/${projectId}`);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editar Proyecto
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-500/10"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar Proyecto
                </Button>
              </div>
            </div>
        </div>
      </motion.div>

      {/* Modal de confirmación para eliminar */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`/api/projects/${projectId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            });

            if (response.ok) {
              setShowDeleteModal(false);
              // Redirigir a la página principal después de eliminar
              router.push('/');
            } else {
              const data = await response.json();
              alert(`Error al eliminar: ${data.error || 'Error desconocido'}`);
            }
          } catch (err) {
            console.error('Error al eliminar el proyecto:', err);
            alert('No se pudo eliminar el proyecto. Inténtalo de nuevo más tarde.');
          } finally {
            setIsDeleting(false);
          }
        }}
        title="Eliminar Proyecto"
        message={`¿Estás seguro de que deseas eliminar el proyecto "${tituloField?.comment || 'Sin título'}"? Esta acción no se puede deshacer y se perderán todos los datos asociados.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
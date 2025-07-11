import { Button } from '@/components/ui/button';

interface FormNavigationProps {
  step: number;
  prevStep: () => void;
  nextStep: () => void;
  showButtons?: boolean;
}

const stepLabels = [
  'Datos del Proyecto',
  'Investigador /Accidentado',
  'Tipo de Contacto',
  'Causas Inmediatas',
  'Causas Básicas',
  'Acciones Correctivas'
];

export function FormNavigation({ step, prevStep, nextStep, showButtons = true }: FormNavigationProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="relative">
        {/* Línea de progreso base */}
        <div className="absolute top-[14px] left-[19.5px] right-[19.5px] h-[2px] bg-gray-100" />
        {/* Línea de progreso activa */}
        <div 
          className="absolute top-[14px] left-[19.5px] h-[2px] bg-primary/80 transition-all duration-300 ease-in-out" 
          style={{ width: `${(step / 6) * 100}%` }}
        />
        <div className="relative flex justify-between px-8">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div
                className={`w-7 h-7 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center
                  ${i + 1 === step
                    ? 'bg-primary shadow-lg shadow-primary/30 ring-4 ring-primary/20'
                    : i + 1 < step
                    ? 'bg-primary/80'
                    : 'bg-gray-100 hover:bg-gray-200'}
                  ${i + 1 <= step ? 'text-white' : 'text-gray-500'}`}
              >
                <span className="text-xs font-semibold">{i + 1}</span>
              </div>
              <div 
                className={`text-[11px] font-medium mt-3 transition-colors duration-300 text-center max-w-[90px] leading-tight
                  ${i + 1 === step 
                    ? 'text-primary font-semibold' 
                    : i + 1 < step 
                    ? 'text-gray-600' 
                    : 'text-gray-400 group-hover:text-gray-500'}`}
              >
                {stepLabels[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showButtons && (
        <div className="flex justify-between px-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            size="sm"
            className="min-w-[100px]"
          >
            Anterior
          </Button>

          <Button
            type="button"
            onClick={nextStep}
            disabled={step === 6}
            size="sm"
            className="min-w-[100px]"
          >
            {step === 6 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </div>
      )}
    </div>
  );
}
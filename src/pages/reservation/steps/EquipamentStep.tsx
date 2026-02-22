import { observer } from "mobx-react-lite";
import { FaTools, FaWrench, FaInfoCircle } from "react-icons/fa";
import { equipmentStore } from "../../../store/equipment/EquipmentStore";
import LoadingSpinner from "../../../commons/components/LoadingSpinner";

const EquipmentStep = observer(() => {
  const { stocks, isLoadingStocks } = equipmentStore;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-brand-blue/5 border border-brand-blue/10 p-5 rounded-3xl flex gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-sm shrink-0">
          <FaTools size={20} />
        </div>
        <div>
          <h3 className="text-brand-blue font-black text-xs uppercase tracking-[0.2em]">
            Recursos da Unidade
          </h3>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Os equipamentos abaixo estão{" "}
            <span className="text-emerald-600 font-bold">
              dispostos para uso do solicitante
            </span>
          </p>
        </div>
      </div>

      {isLoadingStocks ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="medium" />
        </div>
      ) : stocks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stocks.map((item) => (
            <div
              key={item.equipmentId}
              className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center justify-between hover:border-brand-blue/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                  <FaWrench size={16} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">
                    {item.equipmentName}
                  </p>
                  <p className="text-[10px] font-black uppercase text-slate-400 mt-0.5">
                    Estoque: {item.total}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xl font-black ${item.available > 0 ? "text-emerald-500" : "text-red-400"}`}
                >
                  {item.available}
                </span>
                <p className="text-[8px] font-black uppercase text-slate-400 leading-none">
                  Disponíveis
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            Nenhum equipamento cadastrado nesta unidade.
          </p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
        <FaInfoCircle className="text-amber-500 shrink-0 mt-0.5" size={14} />
        <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase">
          Para utilizar os equipamentos, entre em contato com a equipe técnica
          após a aprovação do seu pedido.
        </p>
      </div>
    </div>
  );
});

export default EquipmentStep;

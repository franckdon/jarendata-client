import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: StatCardProps) => {
  return (
    <div className="card card-hover p-5 relative overflow-hidden group">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-400 group-hover:bg-indigo-500" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>

          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}

          {trend && <p className="text-xs text-emerald-600 mt-2">{trend}</p>}
        </div>

        <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

import { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const ChartCard = ({ title, subtitle, children }: ChartCardProps) => {
  return (
    <div className="card p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="h-[280px]">{children}</div>
    </div>
  );
};

export default ChartCard;

const LoginLeftSide = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-indigo-950 relative overflow-hidden border-r border-slate-200">
      <div className="absolute -top-30 -left-30 w-72 h-72 bg-indigo-500/20 rouded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-start justify-center p-12 lg:p-20 w-full h-full">
        <h1 className="text-4xl lg:text-5xl font-medium text-white mn-6 leading-tight tracking-tight">
          Jarendata
        </h1>
        <h2 className="text-2xl lg:text-3xl font-medium text-white mn-6 leading-tight tracking-tight">
          WhatsApp-Powered Customer Intelligence
        </h2>
        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
          {" "}
          Launch surveys, collect verified customer data, and understand your
          market faster through WhatsApp conversations.
        </p>
      </div>
    </div>
  );
};

export default LoginLeftSide;

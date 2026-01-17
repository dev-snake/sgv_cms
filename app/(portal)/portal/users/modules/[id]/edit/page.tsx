"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ModuleForm } from "@/components/portal/module-form";
import api from "@/services/axios";
import { API_ROUTES } from "@/constants/routes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditModulePage() {
  const params = useParams();
  const id = params.id as string;
  const [module, setModule] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await api.get(`${API_ROUTES.MODULES}/${id}`);
        setModule(res.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải thông tin module");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchModule();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-40">
        <Loader2 className="animate-spin text-brand-primary opacity-20" size={48} />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="p-20 text-center">
        <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Không tìm thấy module</p>
      </div>
    );
  }

  return <ModuleForm initialData={module} isEditing />;
}

import { useState } from "react";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

export default function Profile(){
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: ""
  });

  return (
    <AppShell title="User Profile" showFab={false}>
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 grid place-items-center text-xl font-bold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="text-lg font-semibold">{form.name}</div>
            <div className="text-white/60 text-sm">User ID: {user?.id}</div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <Input label="Name" value={form.name} onChange={(v)=>setForm({...form,name:v})}/>
          <Input label="Email" value={form.email} onChange={(v)=>setForm({...form,email:v})}/>
          <Input label="Phone" value={form.phone} onChange={(v)=>setForm({...form,phone:v})}/>
          <Input label="Address" value={form.address} onChange={(v)=>setForm({...form,address:v})}/>
          <button className="w-full h-11 rounded-xl bg-[#2F6DEB] font-semibold">Save Changes</button>
        </div>
      </div>
    </AppShell>
  );
}

function Input({label,value,onChange}){
  return (
    <label className="block">
      <span className="text-white/70 text-sm">{label}</span>
      <input value={value} onChange={(e)=>onChange(e.target.value)}
             className="mt-1 w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 outline-none" />
    </label>
  );
}

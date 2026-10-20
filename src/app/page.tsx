import {Dashboard} from '@/components/dashboard';
export default async function Home({searchParams}:{searchParams:Promise<{tab?:string}>}){const p=await searchParams;return <Dashboard initialTab={p.tab==='designs'?'Mis diseños':'Inicio'}/>;}

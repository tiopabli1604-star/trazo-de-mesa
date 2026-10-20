import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Trazo de Mesa · Tu estudio personal',description:'Un espacio tranquilo para crear diseños, guardarlos en tu navegador y llevarte tus ideas.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body><a className="skip-link" href="#main">Saltar al contenido</a>{children}</body></html>;}

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="main-header">
            <div className="container">
                <div className="logo">
                    <Link href="#inicio" className="brand-logo">
                        <Image
                            src="/logo_prana_pilates.jpeg"
                            alt="Logo Prana Pilates"
                            width={50}
                            height={50}
                            className="header-logo"
                        />
                        <span>Prana Pilates</span>
                    </Link>
                </div>
                <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir menú">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li><Link href="#inicio" onClick={closeMenu}>Inicio</Link></li>
                        <li><Link href="#clases" onClick={closeMenu}>Clases</Link></li>
                        <li><Link href="#reservas" className="btn-primary" onClick={closeMenu}>Reservar Turno</Link></li>
                        <li><Link href="#contacto" onClick={closeMenu}>Contacto</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

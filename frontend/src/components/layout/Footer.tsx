import Link from 'next/link';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="container">
                <p>&copy; 2026 Prana Pilates. Todos los derechos reservados.</p>
                <div className="social-links">
                    <a href="https://www.instagram.com/pranapilates.db/" target="_blank" rel="noopener noreferrer"
                        aria-label="Instagram"><Instagram size={24} /></a>
                    <a href="#" aria-label="Facebook"><Facebook size={24} /></a>
                    <a href="https://wa.me/5491135638928" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle size={24} /></a>
                </div>
            </div>
        </footer>
    );
}

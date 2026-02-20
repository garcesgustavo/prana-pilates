import Link from 'next/link';

export default function Hero() {

    const scrollToBooking = () => {
        const bookingSection = document.getElementById('reservas');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="inicio" className="hero">
            <div className="hero-content fade-in-up">
                <h1>Prana Pilates</h1>
                <h2>Transforma Cuerpo y Mente</h2>
                <p>Descubre el poder del Pilates en un ambiente exclusivo y profesional.</p>
                <Link href="#reservas" className="btn-cta" onClick={(e) => {
                    e.preventDefault();
                    scrollToBooking();
                }}>
                    Comienza Hoy
                </Link>
            </div>
        </section>
    );
}

import Image from 'next/image';

export default function Gallery() {
    return (
        <section id="galeria" className="section">
            <div className="container">
                <h2 className="section-title fade-in-up">Nuestro Espacio</h2>
                <div className="gallery-grid">
                    <div className="gallery-item fade-in-up h-64 relative">
                        <Image src="/espacio_2.jpeg"
                            alt="Estudio de Pilates Luminoso" fill className="object-cover" />
                    </div>
                    <div className="gallery-item fade-in-up h-64 relative">
                        <Image src="/espacio_4.jpeg"
                            alt="Clase de Pilates" fill className="object-cover" />
                    </div>
                    <div className="gallery-item fade-in-up h-64 relative">
                        <Image src="/espacio_5.jpeg"
                            alt="Equipamiento Reformer" fill className="object-cover" />
                    </div>
                    <div className="gallery-item fade-in-up h-64 relative">
                        <Image src="/espacio_7.jpeg"
                            alt="Detalle Pilates" fill className="object-cover" />
                    </div>
                    <div className="gallery-item fade-in-up h-64 relative">
                        <Image src="/espacio_8.jpeg"
                            alt="Relax y Yoga" fill className="object-cover" />
                    </div>
                    <div className="gallery-item fade-in-up h-64 relative">
                        <Image src="/espacio_9.jpeg"
                            alt="Interior Estudio" fill className="object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}

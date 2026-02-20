import { SlidersHorizontal, Wind, Feather, Dumbbell, Flower2 } from 'lucide-react';

export default function Classes() {
    return (
        <section id="clases" className="section">
            <div className="container">
                <h2 className="section-title fade-in-up">Nuestras Clases</h2>
                <div className="classes-grid">
                    <div className="class-card fade-in-up">
                        <div className="class-icon">
                            <SlidersHorizontal size={32} />
                        </div>
                        <h3>Reformer</h3>
                        <p>Entrenamiento en camillas con resistencia progresiva. Ideal para <strong>tonificar la
                            musculatura profunda</strong>, <strong>corregir la postura</strong> y aumentar la fuerza
                            del núcleo sin impacto en las articulaciones.</p>
                    </div>
                    <div className="class-card fade-in-up">
                        <div className="class-icon">
                            <Wind size={32} />
                        </div>
                        <h3>Mat Pilates</h3>
                        <p>Conecta mente y cuerpo a través de ejercicios de suelo enfocados en el "Powerhouse". Mejora
                            tu <strong>control corporal</strong>, <strong>equilibrio</strong> y flexibilidad utilizando
                            tu propio peso.</p>
                    </div>
                    <div className="class-card fade-in-up">
                        <div className="class-icon">
                            <Feather size={32} />
                        </div>
                        <h3>Stretching</h3>
                        <p>Sesiones dedicadas al estiramiento profundo para <strong>liberar tensiones
                            acumuladas</strong>, <strong>mejorar el rango de movimiento</strong> y prevenir futuras
                            lesiones. Bienestar integral para tu cuerpo.</p>
                    </div>
                    <div className="class-card fade-in-up">
                        <div className="class-icon">
                            <Dumbbell size={32} />
                        </div>
                        <h3>Funcional</h3>
                        <p>Entrenamiento dinámico y enérgico. Mejora tu <strong>resistencia cardiovascular</strong>,
                            <strong>fuerza general</strong> y coordinación mediante circuitos de movimientos naturales.
                        </p>
                    </div>
                    <div className="class-card fade-in-up">
                        <div className="class-icon">
                            <Flower2 size={32} />
                        </div>
                        <h3>Yoga</h3>
                        <p>Conecta respiración y movimiento. Práctica ideal para ganar <strong>flexibilidad</strong>,
                            <strong>calma mental</strong> y equilibrio interior a través de asanas fluidas.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

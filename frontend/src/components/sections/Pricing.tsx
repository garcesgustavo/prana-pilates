import { Check, CalendarDays, User, MessageCircle } from 'lucide-react';

interface PricingProps {
    onPlanSelect: (plan: string) => void;
}

export default function Pricing({ onPlanSelect }: PricingProps) {
    return (
        <>
            <section id="precios" className="section">
                <div className="container">
                    <h2 className="section-title fade-in-up">Planes y Precios</h2>
                    <div className="pricing-grid">
                        <div className="pricing-card fade-in-up">
                            <div className="pricing-header">
                                <h3>Clase Suelta</h3>
                                <div className="price">$29.000 <span>/clase</span></div>
                            </div>
                            <ul className="pricing-features">
                                <li><Check size={16} className="text-green-500 mr-2" /> Acceso a 1 clase</li>
                                <li><Check size={16} className="text-green-500 mr-2" /> Válido por 15 días</li>
                                <li><Check size={16} className="text-green-500 mr-2" /> Todas las actividades</li>
                            </ul>
                            <button
                                className="btn-payment btn-outline"
                                onClick={() => onPlanSelect('Clase Suelta')}
                            >
                                Elegir Plan
                            </button>
                        </div>

                        <div className="pricing-card featured fade-in-up">
                            <div className="plan-badge text-black px-4 py-1 rounded-full text-xs font-bold uppercase absolute">Más Popular</div>
                            <div className="pricing-header">
                                <h3>Plan 2 Clases</h3>
                                <div className="price">$37.000 <span>/mes</span></div>
                            </div>
                            <ul className="pricing-features">
                                <li><Check size={16} className="text-[#E5DFD3] mr-2" /> 2 clases por semana</li>
                                <li><Check size={16} className="text-[#E5DFD3] mr-2" /> Seguimiento personalizado</li>
                                <li><Check size={16} className="text-[#E5DFD3] mr-2" /> App de reservas</li>
                            </ul>
                            <button
                                className="btn-payment btn-primary"
                                onClick={() => onPlanSelect('Pack 8 Clases')}
                            >
                                Comenzar Ahora
                            </button>
                        </div>

                        <div className="pricing-card fade-in-up">
                            <div className="pricing-header">
                                <h3>Plan 3 Clases</h3>
                                <div className="price">$44.000 <span>/mes</span></div>
                            </div>
                            <ul className="pricing-features">
                                <li><Check size={16} className="text-green-500 mr-2" /> 3 clases por semana</li>
                                <li><Check size={16} className="text-green-500 mr-2" /> Acceso prioritario</li>
                                <li><Check size={16} className="text-green-500 mr-2" /> Máximos beneficios</li>
                            </ul>
                            <button
                                className="btn-payment btn-outline"
                                onClick={() => onPlanSelect('Pack 12 Clases')}
                            >
                                Elegir Plan
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section id="reservas" className="section bg-light">
                <div className="container">
                    <h2 className="section-title fade-in-up">Reserva tu Clase</h2>
                    <div id="booking-app" className="fade-in-up">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100 max-w-4xl mx-auto">
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => {
                                e.preventDefault();
                                onPlanSelect('Solicitud de Reserva Web - Seña');
                            }}>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                        <CalendarDays size={20} /> Selecciona tu Clase
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="discipline" className="block text-sm font-medium text-neutral-600 mb-1">Disciplina</label>
                                            <select id="discipline" name="discipline" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#7D8F85] focus:outline-none" aria-label="Selecciona la disciplina">
                                                <option>Reformer Pilates</option>
                                                <option>Mat Pilates</option>
                                                <option>Yoga</option>
                                                <option>Stretching</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-neutral-600 mb-1">Fecha Preferida</label>
                                            <input type="date" id="date" name="date" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#7D8F85] focus:outline-none" aria-label="Selecciona la fecha preferida" />
                                        </div>
                                        <div>
                                            <label htmlFor="time" className="block text-sm font-medium text-neutral-600 mb-1">Horario Preferido</label>
                                            <select id="time" name="time" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#7D8F85] focus:outline-none" aria-label="Selecciona el horario preferido">
                                                <option>Mañana (08:00 - 12:00)</option>
                                                <option>Mediodía (12:00 - 16:00)</option>
                                                <option>Tarde (16:00 - 20:00)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                                            <User size={20} /> Tus Datos
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="fullname" className="block text-sm font-medium text-neutral-600 mb-1">Nombre Completo</label>
                                                <input type="text" id="fullname" name="fullname" placeholder="Ej: Maria Garcia" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#7D8F85] focus:outline-none" required />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-neutral-600 mb-1">Teléfono / WhatsApp</label>
                                                <input type="tel" id="phone" name="phone" placeholder="Ej: 11 1234 5678" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#7D8F85] focus:outline-none" required />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="mt-8 w-full bg-[#7D8F85] text-white font-bold py-4 rounded-xl hover:bg-[#5F6E66] transition-colors shadow-lg flex items-center justify-center gap-2">
                                        <MessageCircle size={20} />
                                        Reservar y Pegar Seña
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function Contact() {
    return (
        <section id="contacto" className="section">
            <div className="container">
                <h2 className="section-title fade-in-up">Contacto</h2>
                <div className="contact-grid">
                    <div className="contact-form-wrapper contact-form fade-in-up">
                        <form id="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Gracias por tu mensaje. Te contactaremos pronto.'); }}>
                            <div className="form-group">
                                <label htmlFor="name">Nombre:</label>
                                <input type="text" id="name" required className="w-full p-3 border rounded-lg" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" required className="w-full p-3 border rounded-lg" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Mensaje:</label>
                                <textarea id="message" rows={4} required className="w-full p-3 border rounded-lg"></textarea>
                            </div>
                            <button type="submit" className="btn-primary w-full">Enviar Mensaje</button>
                        </form>
                    </div>
                    <div className="map-wrapper fade-in-up h-[500px] w-full relative z-0">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3289.471607686851!2d-58.6859704847774!3d-34.46950278049449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbd2e69074b6f%3A0xe8c7b6f6f2d2b0e0!2sAv.%20Pres.%20Juan%20Domingo%20Per%C3%B3n%201072%2C%20B1614%20Villa%20De%20Mayo%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1646252000000!5m2!1ses!2sar"
                            title="Ubicación Prana Pilates"
                            className="w-full h-full border-0 rounded-2xl"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            key="google-map-embed-v3"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}

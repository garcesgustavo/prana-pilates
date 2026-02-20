import { X, CreditCard, Upload } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPlan: string;
}

export default function PaymentModal({ isOpen, onClose, selectedPlan }: PaymentModalProps) {
    if (!isOpen) return null;

    const handleWhatsAppPayment = () => {
        const message = `Hola, adjunto mi comprobante de pago para el plan: ${selectedPlan}`;
        const whatsappUrl = `https://wa.me/5491135638928?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="modal-overlay flex">
            <div className="modal-card fade-in-up" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose} aria-label="Cerrar modal">
                    <X size={24} />
                </button>
                <div className="text-center">
                    <div className="bg-[#7D8F85] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white">
                        <CreditCard size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-800 mb-2">Detalles de Pago</h3>
                    <p className="text-neutral-600 mb-6">Transfiere el monto del plan <strong>{selectedPlan}</strong> a la siguiente cuenta:</p>

                    <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 text-left mb-8 relative group">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">Banco</span>
                                <span className="font-medium">Tarjeta Naranja</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">Titular</span>
                                <span className="font-medium">Daniela Soledad Belforte</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">CBU</span>
                                <span className="font-mono bg-white px-2 py-1 rounded border border-neutral-100">4530000800010910521919</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">Alias</span>
                                <span className="font-bold text-[#7D8F85]">DBELFORTE7272.NX.ARS</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleWhatsAppPayment}
                        className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#128C7E] transition-colors shadow-lg flex items-center justify-center gap-3"
                    >
                        <Upload size={24} />
                        Enviar Comprobante por WhatsApp
                    </button>
                    <p className="text-xs text-neutral-400 mt-4">
                        Al hacer clic, se abrirá WhatsApp para que puedas adjuntar la foto del comprobante.
                    </p>
                </div>
            </div>
        </div>
    );
}

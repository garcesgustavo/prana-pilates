'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Hero from '../components/sections/Hero';
import Classes from '../components/sections/Classes';
import Gallery from '../components/sections/Gallery';
import Pricing from '../components/sections/Pricing';
import Contact from '../components/sections/Contact';
import Footer from '../components/layout/Footer';
import PaymentModal from '../components/ui/PaymentModal';

export default function Home() {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');

    const handlePricingClick = (plan: string) => {
        setSelectedPlan(plan);
        setIsPaymentModalOpen(true);
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.fade-in-up');
        animatedElements.forEach(el => observer.observe(el));

        return () => {
            if (observer) observer.disconnect();
        };
    }, []);

    return (
        <>
            <Header />

            <main>
                <Hero />
                <Classes />
                <Gallery />
                <Pricing onPlanSelect={handlePricingClick} />
                <Contact />
            </main>

            <Footer />

            <a href="https://wa.me/5491135638928?text=Hola,%20quisiera%20solicitar%20información%20sobre%20las%20clases%20de%20Prana%20Pilates."
                className="fixed bottom-20 right-6 px-6 py-3 bg-[#25D366] text-white rounded-full shadow-2xl z-50 flex items-center gap-3 hover:bg-[#20bd5a] transition-all hover:scale-105"
                target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <MessageCircle size={20} className="fill-current" />
                <span className="font-bold text-sm">WhatsApp</span>
            </a>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                selectedPlan={selectedPlan}
            />
        </>
    );
}

import { ApiService } from '../services/api.service.js';

/**
 * Payment Module
 * Handles payment modal functionality
 */
export class Payment {
    constructor() {
        this.paymentModal = document.getElementById('payment-modal');
        this.closePayment = document.querySelector('.close-modal');
        this.bankBtn = document.getElementById('show-bank');
        this.bankInfo = document.getElementById('bank-info');
        this.planButtons = document.querySelectorAll('.btn-payment');

        if (this.paymentModal) {
            this.init();
        }
    }

    init() {
        let activePlan = null;
        let activePrice = null;

        // Open Modal
        this.planButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                activePlan = btn.dataset.plan;
                activePrice = btn.dataset.price;

                const planText = document.getElementById('selected-plan-text');
                if (planText) {
                    planText.textContent = `${activePlan} ($${activePrice})`;
                }

                this.paymentModal.style.display = 'flex';
                if (this.bankInfo) this.bankInfo.style.display = 'none';

                // Reset MP button state if needed
                const mpPayButton = document.getElementById('mp-pay-button');
                if (mpPayButton) {
                    mpPayButton.disabled = false;
                    mpPayButton.innerHTML = '<i class="fas fa-lock"></i> Pagar con Mercado Pago / Tarjeta';

                    // Remove old listeners to avoid duplicates (clone node trick or just use oneshot)
                    // For simplicity, we assign a new function reference or handle via class property
                    mpPayButton.onclick = () => this.handleMpPayment(activePlan, activePrice, mpPayButton);
                }
            });
        });

        // Close Modal
        if (this.closePayment) {
            this.closePayment.addEventListener('click', () => {
                this.paymentModal.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === this.paymentModal) {
                this.paymentModal.style.display = 'none';
            }
        });

        // Toggle Bank Info
        if (this.bankBtn) {
            this.bankBtn.addEventListener('click', () => {
                this.bankInfo.style.display = this.bankInfo.style.display === 'block' ? 'none' : 'block';
            });
        }
    }

    /**
     * Handles Mercado Pago payment flow
     * @param {string} plan 
     * @param {number} price 
     * @param {HTMLElement} btn 
     */
    async handleMpPayment(plan, price, btn) {
        btn.disabled = true;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando pago seguro...';

        const response = await ApiService.createPreference({
            plan: plan,
            price: price
        });

        if (response && response.init_point) {
            window.location.href = response.init_point;
        } else {
            alert('Hubo un error al iniciar el pago. Por favor intenta de nuevo.');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
}

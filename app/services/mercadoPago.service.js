import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import {HOST, MP_ACCESS_TOKEN} from '../config.js';
const client = new MercadoPagoConfig({
    accessToken: MP_ACCESS_TOKEN
});

// Servicio de pago
export const crearPago = async (data) => {
    const payment = new Payment(client);
    return await payment.create({
        body: {
            transaction_amount: data.monto,
            description: data.description,
            payment_method: data.metodo,
            payer: { email: data.email}
        },
        requestOptions: { idempotencyKey: data.idempotencyKey }
    });
};

// Servicio para Checkout Pro
export const crearPreferencia = async (items) => {
    const preference = new Preference(client);
    return await preference.create({
        body: {
            items,
            back_urls: {
                success: 'localhost/pago/success',
                failure: 'localhost/pago/failure',
                pending: 'localhost/pago/pending'
            },
            auto_return: 'approved'
        }
    });
};
import { crearPago, crearPreferencia } from "../services/mercadoPago.service.js";

export const generarPago = async (req, res) => {
    try {
        
        const { monto, descripcion, metodo, email } = req.body;

        const pago = await crearPago({
            monto,
            descripcion,
            metodo,
            email,
            idempotencyKey: Date.now().toString()
        });

        res.json(pago);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el pago' });
    }
};

export const generarCheckout = async (req, res) => {
    try {
        const { items } = req.body;

        const preferencia = await crearPreferencia(items);
        res.json({ init_point: preferencia.init_point });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar la preferencia' });
    }
};
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { HOST, MP_ACCESS_TOKEN } from '../config.js';
import { Router } from "express";
import QRCode from 'qrcode';
import router from '../routes/upload.routes.js';


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
            payer: { email: data.email }
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

export const crearQR = async (req, res) => {
    try {
        const preference = new Preference(client);

        const body = {
            items: [
                { title: 'Producto X', quantity: 1, unit_price: 500 }
            ],
            back_urls: {
                success: 'localhost/pago/success',
                failure: 'localhost/pago/failure',
                pending: 'localhost/pago/pending'
            },
            auto_return: 'approved'
        };

        const response = await preference.create({ body });

        // URL del checkout
        const checkoutUrl = response.init_point;

        // Generar QR con la URL
        // Podés usar librerías como `qrcode`
        // npm install qrcode

        const qrDataUrl = await QRCode.toDataURL(checkoutUrl);

        res.json({ checkoutUrl, qrDataUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar QR de pago' });
    }
};


router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;

      // Consultar detalles del pago
      const payment = new Payment(client);
      const response = await payment.get({ id: paymentId });

      const pago = response;

      // Guardar en la base de datos
      /*
      await pool.query(
        `INSERT INTO pagos (id_pago, estado, monto, metodo, fecha)
         VALUES (?, ?, ?, ?, ?)`,
        [
          pago.id,
          pago.status,
          pago.transaction_amount,
          pago.payment_method_id,
          pago.date_created
        ]
      );*/
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;